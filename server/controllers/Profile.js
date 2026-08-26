const Profile = require('../models/Profile');
const User = require('../models/User');
const Course = require('../models/Course'); // was missing — used in deleteAccount
const { uploadImageToCloudinary } = require('../utils/imageUploder');

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", gender, aboutMe = "", contactNumber } = req.body;
        const id = req.user.id;

        if (!gender || !contactNumber) {
            return res.status(400).json({
                success: false,
                message: "Gender and contact number are required"
            });
        }

        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        const profileId = userDetails.additionalDetails;

        const updatedProfile = await Profile.findByIdAndUpdate(
            profileId,
            {
                ...(dateOfBirth && { dateOfBirth }),
                ...(gender && { gender }),
                ...(aboutMe && { aboutMe }),
                ...(contactNumber && { contactNumber }),
            },
            { new: true }
        );

        if (!updatedProfile) {
            return res.status(404).json({
                success: false,
                message: "Profile not found"
            });
        }
        const updatedUserDetails = await User.findById(id)
          .populate("additionalDetails")
          .exec();
        return res.status(200).json({
           success: true,
           message: "Profile updated successfully",
           updatedUserDetails,
     });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while updating profile",
            error: err.message
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        await Profile.findByIdAndDelete(userDetails.additionalDetails);

        // unenroll user from all courses
        await Course.updateMany(
            { studentsEnrolled: id },
            { $pull: { studentsEnrolled: id } }
        );

        await User.findByIdAndDelete(id);

        return res.status(200).json({
            success: true,
            message: "Account deleted successfully",
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting account",
            error: err.message
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const userDetails = await User.findById(id).populate("additionalDetails").exec();
        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "User details fetched successfully",
            data: userDetails
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching user details",
            error: err.message
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        if (!req.files || !req.files.displayPicture) {
            return res.status(400).json({
                success: false,
                message: "No image file provided"
            });
        }

        const displayPicture = req.files.displayPicture;
        const id = req.user.id;

        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        );

        const updatedUserDetails = await User.findByIdAndUpdate(
            id,
            { image: image.secure_url },
            { new: true }
        ).populate("additionalDetails").exec();

        return res.status(200).json({
            success: true,
            message: "Display picture updated successfully",
            data: updatedUserDetails
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while updating display picture",
            error: err.message
        });
    }
};

exports.instructorDashboard = async (req, res) => {
    try {
        const courseDetails = await Course.find({ instructor: req.user.id });

        const courseData = courseDetails.map((course) => {
            const totalStudentsEnrolled = course.studentsEnrolled.length;
            const totalAmountGenerated = totalStudentsEnrolled * course.price;

            return {
                _id: course._id,
                courseName: course.courseName,
                courseDescription: course.courseDescription,
                totalStudentsEnrolled,
                totalAmountGenerated,
            };
        });

        return res.status(200).json({
            success: true,
            courses: courseData
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching instructor dashboard data",
            error: err.message
        });
    }
};

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id;

        let userDetails = await User.findOne({ _id: userId })
            .populate({
                path: "courses",
                populate: {
                    path: "courseContent",
                    populate: {
                        path: "subSection",
                    },
                },
            })
            .populate("courseProgress")
            .exec();

        if (!userDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find user with id: ${userId}`,
            });
        }

        userDetails = userDetails.toObject();

        for (let i = 0; i < userDetails.courses.length; i++) {
            let totalDurationInSeconds = 0;
            let subSectionLength = 0;

            for (const section of userDetails.courses[i].courseContent) {
                totalDurationInSeconds += section.subSection.reduce(
                    (acc, curr) => acc + parseInt(curr.timeDuration || 0),
                    0
                );
                subSectionLength += section.subSection.length;
            }

            userDetails.courses[i].totalDuration = `${Math.floor(totalDurationInSeconds / 60)}m`;

            let completedVideoCount = 0;
            const progress = userDetails.courseProgress?.find(
                (p) => p.courseId?.toString() === userDetails.courses[i]._id.toString()
            );

            if (progress) {
                completedVideoCount = progress.completedVideos.length;
            }

            userDetails.courses[i].progressPercentage = subSectionLength === 0
                ? 100
                : Math.round((completedVideoCount / subSectionLength) * 100 * 100) / 100;
        }

        return res.status(200).json({
            success: true,
            data: userDetails.courses,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while fetching enrolled courses",
            error: err.message,
        });
    }
};