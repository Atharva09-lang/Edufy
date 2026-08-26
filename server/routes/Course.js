// routes/course.js
const express = require("express");
const router = express.Router();

// Course controllers
const {
  createCourse,
  showAllCourses,
  searchCourses,
  getCourseDetails,
  getInstructorCourses,
  editCourse,
  deleteCourse,
  getFullCourseDetails,
} = require("../controllers/Course");

// Category controllers
const {
  createCategory,
  showAllTags,
  getCategoryPayDetails,
} = require("../controllers/Category");

// Section controllers
const {
  createSection,
  updateSection,
  deleteSection,
} = require("../controllers/Section");

// SubSection controllers
const {
  createSubSection,
  updateSubsection,
  deleteSubsection,
} = require("../controllers/SubSection");

// Rating and Review controllers
const {
  createRating,
  getAverageRating,
  getAllRating,
  getRatingByCourseId,
} = require("../controllers/RatingAndReview");

// Middleware
const { auth, isTeacher, isStudent, isAdmin } = require("../middleware/auth");



// Create a new course (instructor only)
router.post("/createCourse", auth, isTeacher, createCourse);

// Get all courses (public)
router.get("/getAllCourses", showAllCourses);

// Search courses (public)
router.get("/searchCourses", searchCourses);

// Get single course full details (public / or auth if you gate it)
router.post("/getCourseDetails", getCourseDetails);

// Get all courses created by the logged-in instructor
router.get("/getInstructorCourses", auth, isTeacher, getInstructorCourses);

router.post("/getFullCourseDetails", auth, getFullCourseDetails);

// Delete a course (instructor only)
router.delete("/deleteCourse", auth, isTeacher, deleteCourse);

// Edit a course (instructor only)
router.post("/editCourse", auth, isTeacher, editCourse);

//Section routes

router.post("/addSection", auth, isTeacher, createSection);
router.post("/updateSection", auth, isTeacher, updateSection);
router.post("/deleteSection", auth, isTeacher, deleteSection);

//  SubSection routes

router.post("/addSubSection", auth, isTeacher, createSubSection);
router.post("/updateSubSection", auth, isTeacher, updateSubsection);
router.post("/deleteSubSection", auth, isTeacher, deleteSubsection);


//Category (Tag) routes

router.post("/createCategory", auth, isAdmin, createCategory);
router.get("/showAllTags", showAllTags);
router.post("/getCategoryPageDetails", getCategoryPayDetails);
//Rating and Review routes

router.post("/createRating", auth, isStudent, createRating);
router.get("/getAverageRating", getAverageRating);
router.get("/getReviews", getAllRating);
router.post("/getReviewsByCourse", getRatingByCourseId);

module.exports = router;