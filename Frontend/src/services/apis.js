const BASE_URL =
  process.env.REACT_APP_BASE_URL ||
  "https://edufy-backend-4s74.onrender.com";

// AUTH ENDPOINTS  (all mounted under /user in the Edufy backend, not /auth)
export const endpoints = {
  SENDOTP_API: BASE_URL + "/user/sendOTP",
  SIGNUP_API: BASE_URL + "/user/signUp",
  LOGIN_API: BASE_URL + "/user/login",
  RESETPASSTOKEN_API: BASE_URL + "/user/resetPasswordToken",
  RESETPASSWORD_API: BASE_URL + "/user/resetPassword",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getAllUserDetails",

  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
 
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",

  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  SEARCH_COURSES_API: BASE_URL + "/course/searchCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  // NOT YET IMPLEMENTED in backend (no editCourse controller/route)
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllTags",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
 
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",

  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",

  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",

  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// CATEGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllTags",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}

// CONTACT-US API

export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {

  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/user/changePassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteAccount",
}


export const aiEndpoints = {
  AI_CHAT_API: BASE_URL + "/ai/chat",
}