const express = require('express');
const router = express.Router();

const{
    updateProfile ,
    deleteAccount,
    getAllUserDetails,
    updateDisplayPicture,
    instructorDashboard,
    getEnrolledCourses,
}=require('../controllers/Profile');

const {auth, isTeacher} = require('../middleware/auth');

router.put('/updateProfile', auth, updateProfile);
router.delete('/deleteAccount', auth, deleteAccount);
router.get('/getAllUserDetails', auth, getAllUserDetails);
router.put('/updateDisplayPicture', auth, updateDisplayPicture);
router.get('/instructorDashboard', auth, isTeacher, instructorDashboard);
router.get('/getEnrolledCourses', auth, getEnrolledCourses);

module.exports = router;