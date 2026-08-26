const { instance } = require("../config/razorpay");
const Course = require("../models/Course");
const User = require("../models/User");
const CourseProgress = require("../models/CoureseProgress");
const mailSender = require("../utils/mailSender");
const { courseEnrollmentEmail } = require("../mail/template/courseEnrollmentMail");
const { paymentSuccessEmail } = require("../mail/template/paymentSuccessEmail");
const crypto = require("crypto");
const mongoose = require("mongoose");

// Initiate the Razorpay Order
exports.capturePayment = async (req, res) => {
    try {
        let { courses, course_id } = req.body;
        const userId = req.user.id;

        let courseList = courses || course_id;
        if (!courseList || (Array.isArray(courseList) && courseList.length === 0)) {
            return res.status(400).json({
                success: false,
                message: "Please provide Course ID(s)",
            });
        }

        if (!Array.isArray(courseList)) {
            courseList = [courseList];
        }

        let totalAmount = 0;

        for (const courseId of courseList) {
            let course;
            try {
                course = await Course.findById(courseId);
                if (!course) {
                    return res.status(404).json({
                        success: false,
                        message: `Could not find course with ID ${courseId}`,
                    });
                }

                // Check if user is already enrolled
                const uid = new mongoose.Types.ObjectId(userId);
                if (course.studentsEnrolled.includes(uid)) {
                    return res.status(400).json({
                        success: false,
                        message: `Student is already enrolled in course: ${course.courseName}`,
                    });
                }

                totalAmount += course.price;
            } catch (err) {
                console.error("Error checking course in capturePayment:", err);
                return res.status(500).json({
                    success: false,
                    message: err.message,
                });
            }
        }

        const options = {
            amount: totalAmount * 100, // in paise
            currency: "INR",
            receipt: `rcpt_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
            notes: {
                userId: userId,
                courses: JSON.stringify(courseList),
            },
        };

        const paymentResponse = await instance.orders.create(options);

        return res.status(200).json({
            success: true,
            message: paymentResponse,
            data: paymentResponse,
            key_id: process.env.RAZORPAY_KEY,
        });
    } catch (err) {
        console.error("Error in capturePayment:", err);
        return res.status(500).json({
            success: false,
            message: "Could not initiate order",
            error: err.message,
        });
    }
};

// Verify the payment signature and enroll student
exports.verifyPayment = async (req, res) => {
    try {
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            courses,
        } = req.body;
        const userId = req.user.id;

        if (
            !razorpay_order_id ||
            !razorpay_payment_id ||
            !razorpay_signature ||
            !courses ||
            !userId
        ) {
            return res.status(400).json({
                success: false,
                message: "Payment verification failed: Missing required fields",
            });
        }

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex");

        if (expectedSignature === razorpay_signature) {
            // Enroll student in all purchased courses
            await enrollStudents(courses, userId, res);

            return res.status(200).json({
                success: true,
                message: "Payment Verified and Enrollment Successful",
            });
        }

        return res.status(400).json({
            success: false,
            message: "Payment Verification Failed: Invalid Signature",
        });
    } catch (err) {
        console.error("Error in verifyPayment:", err);
        return res.status(500).json({
            success: false,
            message: "Payment verification error",
            error: err.message,
        });
    }
};

// Helper function to enroll students
const enrollStudents = async (courses, userId, res) => {
    if (!courses || !userId) {
        return;
    }

    let courseList = Array.isArray(courses) ? courses : [courses];

    for (const courseId of courseList) {
        try {
            // Add student to course
            const enrolledCourse = await Course.findByIdAndUpdate(
                courseId,
                { $push: { studentsEnrolled: userId } },
                { new: true }
            );

            if (!enrolledCourse) {
                console.error(`Course not found for enrollment: ${courseId}`);
                continue;
            }

            // Create CourseProgress document
            const courseProgress = await CourseProgress.create({
                courseId: courseId,
                userId: userId,
                completedVideos: [],
            });

            // Add course and courseProgress to user
            const enrolledStudent = await User.findByIdAndUpdate(
                userId,
                {
                    $push: {
                        courses: courseId,
                        courseProgress: courseProgress._id,
                    },
                },
                { new: true }
            );

            // Send course enrollment confirmation email
            if (enrolledStudent) {
                try {
                    await mailSender(
                        enrolledStudent.email,
                        `Successfully Enrolled into ${enrolledCourse.courseName} - Edufy`,
                        courseEnrollmentEmail(
                            enrolledCourse.courseName,
                            `${enrolledStudent.firstName} ${enrolledStudent.lastName}`
                        )
                    );
                } catch (emailErr) {
                    console.error("Failed to send course enrollment email:", emailErr);
                }
            }
        } catch (error) {
            console.error("Error enrolling student in course:", error);
        }
    }
};

// Send Payment Success Email
exports.sendPaymentSuccessEmail = async (req, res) => {
    try {
        const { orderId, paymentId, amount } = req.body;
        const userId = req.user.id;

        if (!orderId || !paymentId || !amount || !userId) {
            return res.status(400).json({
                success: false,
                message: "Please provide all details for payment success email",
            });
        }

        const enrolledStudent = await User.findById(userId);
        if (!enrolledStudent) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        await mailSender(
            enrolledStudent.email,
            `Payment Received - Edufy`,
            paymentSuccessEmail(
                `${enrolledStudent.firstName} ${enrolledStudent.lastName}`,
                amount / 100,
                orderId,
                paymentId
            )
        );

        return res.status(200).json({
            success: true,
            message: "Payment success email sent successfully",
        });
    } catch (err) {
        console.error("Error in sendPaymentSuccessEmail:", err);
        return res.status(500).json({
            success: false,
            message: "Could not send payment success email",
            error: err.message,
        });
    }
};