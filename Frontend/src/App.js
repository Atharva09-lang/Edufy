const BASE_URL = "https://edufy-qqy3.vercel.app/api/v1";

export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllTags",
};

export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
};

export const courseEndpoints = {
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllTags",
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
};

export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
};

export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
};

export const authEndpoints = {
  SENDOTP_API: BASE_URL + "/user/sendOTP",
  SIGNUP_API: BASE_URL + "/user/signup",
  LOGIN_API: BASE_URL + "/user/login",
  RESETPASSTOKEN_API: BASE_URL + "/user/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/user/reset-password",
};

export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
};

export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
};

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
};