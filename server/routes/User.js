const express= require("express");
const router = express.Router();

const{
    sendOTP,
    signUp,
    login,
    changePassword,
}=require('../controllers/Auth');


const {
    resetPasswordToken,
    resetPassword
} = require('../controllers/ResetPassword');

const {auth} = require('../middleware/auth');

router.post('/resetPasswordToken', resetPasswordToken);
router.put('/resetPassword', resetPassword);

router.post('/sendOTP', sendOTP);
router.post('/signUp', signUp);
router.post('/login', login);
router.put('/changePassword', auth, changePassword);

module.exports = router;