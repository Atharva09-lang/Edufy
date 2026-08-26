import { toast } from "react-hot-toast";
import { studentEndpoints } from "../apis";
import { apiConnector } from "../apiconnector";
import rzpLogo from "../../assets/Logo/rzp_logo.png"
import { setPaymentLoading } from "../../slices/courseSlice";
import { resetCart } from "../../slices/cartSlice";

const { COURSE_PAYMENT_API, COURSE_VERIFY_API, SEND_PAYMENT_SUCCESS_EMAIL_API } = studentEndpoints;

function loadScript(src) {
    return new Promise((resolve) => {
        const script = document.createElement("script");
        script.src = src;

        script.onload = () => {
            resolve(true);
        }
        script.onerror = () => {
            resolve(false);
        }
        document.body.appendChild(script);
    })
}

export async function buyCourse(token, courses, userDetails, navigate, dispatch) {
    const toastId = toast.loading("Initiating Payment...");
    try {
        // Load the Razorpay Checkout SDK script
        const res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            toast.error("RazorPay SDK failed to load. Check your internet connection.");
            toast.dismiss(toastId);
            return;
        }

        // Initiate the order with backend
        const orderResponse = await apiConnector(
            "POST",
            COURSE_PAYMENT_API,
            { courses },
            {
                Authorization: `Bearer ${token}`,
            }
        );

        if (!orderResponse?.data?.success) {
            throw new Error(orderResponse?.data?.message || "Failed to create payment order");
        }

        const orderData = orderResponse.data.data || orderResponse.data.message;
        const razorpayKey = orderResponse.data.key_id || process.env.REACT_APP_RAZORPAY_KEY || "rzp_test_TOuI5yxdVg0k5v";

        // Razorpay Checkout Options with QR / UPI configuration
        const options = {
            key: razorpayKey,
            currency: orderData.currency || "INR",
            amount: `${orderData.amount}`,
            order_id: orderData.id,
            name: "Edufy",
            description: "Course Enrollment Payment",
            image: rzpLogo,
            prefill: {
                name: `${userDetails?.firstName || ""} ${userDetails?.lastName || ""}`.trim(),
                email: userDetails?.email || "",
                contact: userDetails?.additionalDetails?.contactNumber || ""
            },
            config: {
                display: {
                    blocks: {
                        upi: {
                            name: "Pay via UPI / QR Code",
                            instruments: [
                                {
                                    method: "upi",
                                    flows: ["qr", "intent", "collect"]
                                }
                            ]
                        },
                        other: {
                            name: "Cards / Netbanking / Wallets",
                            instruments: [
                                { method: "card" },
                                { method: "netbanking" },
                                { method: "wallet" }
                            ]
                        }
                    },
                    sequence: ["block.upi", "block.other"],
                    preferences: {
                        show_default_blocks: true
                    }
                }
            },
            theme: {
                color: "#6366F1",
            },
            handler: function (response) {
                // Send payment confirmation email
                sendPaymentSuccessEmail(response, orderData.amount, token);
                // Verify payment on backend and enroll student
                verifyPayment({ ...response, courses }, token, navigate, dispatch);
            },
            modal: {
                ondismiss: function () {
                    toast.error("Payment Cancelled");
                }
            }
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();

        paymentObject.on("payment.failed", function (response) {
            toast.error("Payment Failed");
            console.error("Razorpay Payment Error:", response.error);
        });

    } catch (error) {
        console.error("PAYMENT API ERROR.....", error);
        toast.error(error?.response?.data?.message || error?.message || "Could not complete payment");
    }
    toast.dismiss(toastId);
}

async function sendPaymentSuccessEmail(response, amount, token) {
    try {
        await apiConnector(
            "POST",
            SEND_PAYMENT_SUCCESS_EMAIL_API,
            {
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                amount,
            },
            {
                Authorization: `Bearer ${token}`
            }
        );
    } catch (error) {
        console.error("PAYMENT SUCCESS EMAIL ERROR....", error);
    }
}

// Verify payment signature & enroll student
async function verifyPayment(bodyData, token, navigate, dispatch) {
    const toastId = toast.loading("Verifying Payment....");
    dispatch(setPaymentLoading(true));
    try {
        const response = await apiConnector("POST", COURSE_VERIFY_API, bodyData, {
            Authorization: `Bearer ${token}`,
        });

        if (!response?.data?.success) {
            throw new Error(response?.data?.message || "Payment verification failed");
        }

        toast.success("Payment Successful! You are now enrolled in the course.");
        navigate("/dashboard/enrolled-courses");
        dispatch(resetCart());
    } catch (error) {
        console.error("PAYMENT VERIFY ERROR....", error);
        toast.error(error?.response?.data?.message || error?.message || "Could not verify Payment");
    }
    toast.dismiss(toastId);
    dispatch(setPaymentLoading(false));
}