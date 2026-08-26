const Course = require("../models/Course");
const Tag = require("../models/Tag");
const User = require("../models/User");
const Section = require("../models/Section");
const SubSection = require("../models/SubSection");
const { uploadImageToCloudinary } = require("../utils/imageUploder");
const CourseProgress = require("../models/CoureseProgress"); 
// createCourse handler
exports.createCourse = async (req, res) => {
    try {
        const { courseName, courseDescription, whatYouWillLearn, price, tag, category, status, instructions } = req.body;
        const thumbnail = req.files.thumbnailImage;

        if (!courseName || !courseDescription || !whatYouWillLearn || !price || !tag || !category || !thumbnail) {
            return res.status(400).json({
                success: false,
                message: "All fields are mandatory",
            });
        }

        const userId = req.user.id;
        const instructorDetails = await User.findById(userId);
        console.log("Instructor Details:-", instructorDetails);

        if (!instructorDetails) {
            return res.status(404).json({
                success: false,
                message: "Instructor details not found",
            });
        }

        const categoryDetails = await Tag.findById(category);
        if (!categoryDetails) {
            return res.status(404).json({
                success: false,
                message: "Category details not found",
            });
        }

        const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);

        const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor: instructorDetails._id,
            whatYouWillLearn,
            price,
            tag: JSON.parse(tag),
            category: categoryDetails._id,
            thumbnail: thumbnailImage.secure_url,
            status: status || "Draft",
            instructions: instructions ? JSON.parse(instructions) : [],
        });

        await User.findByIdAndUpdate(
            instructorDetails._id,
            { $push: { courses: newCourse._id } },
            { new: true },
        );

        await Tag.findByIdAndUpdate(
            categoryDetails._id,
            { $push: { course: newCourse._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Course created successfully",
            data: newCourse,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to create the course",
            error: err.message,
        });
    }
};

// showAllCourses handler
exports.showAllCourses = async (req, res) => {
    try {
        const allCourses = await Course.find({}, {
            courseName: true,
            price: true,
            thumbnail: true,
            instructor: true,
            ratingAndReviews: true,
            studentsEnrolled: true,
            courseDescription: true,
            tag: true,
            category: true,
            status: true,
            createdAt: true,
        })
        .populate({
            path: "instructor",
            select: "firstName lastName email image",
        })
        .populate({
            path: "category",
            select: "name description",
        })
        .populate("ratingAndReviews")
        .sort({ createdAt: -1 })
        .exec();

        return res.status(200).json({
            success: true,
            message: "Data for all courses fetched successfully",
            data: allCourses,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Could not fetch course data",
            error: err.message,
        });
    }
};

// searchCourses handler
exports.searchCourses = async (req, res) => {
    try {
        const { searchQuery } = req.query;

        let query = {};
        if (searchQuery && searchQuery.trim() !== "") {
            const regex = new RegExp(searchQuery.trim(), "i");

            // Find matching instructors by name
            const matchingInstructors = await User.find({
                $or: [
                    { firstName: regex },
                    { lastName: regex },
                ]
            }).select("_id");
            const instructorIds = matchingInstructors.map((inst) => inst._id);

            // Find matching tags/categories
            const matchingTags = await Tag.find({
                name: regex
            }).select("_id");
            const tagIds = matchingTags.map((t) => t._id);

            query = {
                $or: [
                    { courseName: regex },
                    { courseDescription: regex },
                    { tag: { $in: [regex] } },
                    { instructor: { $in: instructorIds } },
                    { category: { $in: tagIds } },
                ]
            };
        }

        const courses = await Course.find(query)
            .populate({
                path: "instructor",
                select: "firstName lastName email image",
            })
            .populate({
                path: "category",
                select: "name description",
            })
            .populate({
                path: "ratingAndReviews",
                populate: {
                    path: "user",
                    select: "firstName lastName image",
                },
            })
            .sort({ createdAt: -1 })
            .exec();

        return res.status(200).json({
            success: true,
            message: "Courses retrieved successfully",
            data: courses,
        });
    } catch (err) {
        console.log("Error in searchCourses:", err);
        return res.status(500).json({
            success: false,
            message: "Failed to search courses",
            error: err.message,
        });
    }
};

// getCourseDetails handler
exports.getCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" },
            })
            .populate("tag")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Course details not found for ${courseId}`,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Course details fetched successfully",
            data: {
                courseDetails,
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Could not fetch course data",
            error: err.message,
        });
    }
};


exports.getInstructorCourses = async (req, res) => {
    try {
        const instructorId = req.user.id;
        const instructorCourses = await Course.find({ instructor: instructorId }).sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: instructorCourses,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Failed to retrieve instructor courses",
            error: err.message,
        });
    }
};

exports.editCourse = async (req, res) => {
    try {
        const { courseId } = req.body;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (req.files && req.files.thumbnailImage) {
            const thumbnail = req.files.thumbnailImage;
            const thumbnailImage = await uploadImageToCloudinary(thumbnail, process.env.FOLDER_NAME);
            course.thumbnail = thumbnailImage.secure_url;
        }

        const {
            courseName,
            courseDescription,
            price,
            tag,
            category,
            status,
            instructions,
            whatYouWillLearn,
        } = req.body;

        if (courseName) course.courseName = courseName;
        if (courseDescription) course.courseDescription = courseDescription;
        if (price) course.price = price;
        if (whatYouWillLearn) course.whatYouWillLearn = whatYouWillLearn;
        if (status) course.status = status;
        if (tag) course.tag = JSON.parse(tag);
        if (instructions) course.instructions = JSON.parse(instructions);

        if (category) {
            const categoryDetails = await Tag.findById(category);
            if (!categoryDetails) {
                return res.status(404).json({
                    success: false,
                    message: "Category details not found",
                });
            }
            course.category = categoryDetails._id;
        }

        await course.save();

        const updatedCourse = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .populate("category")
            .populate("instructor")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Course updated successfully",
            data: updatedCourse,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while updating course",
            error: err.message,
        });
    }
};



exports.deleteCourse = async (req, res) => {
    try {
        const { courseId } = req.body;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                success: false,
                message: "Course not found",
            });
        }

        if (course.instructor.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: "You are not authorized to delete this course",
            });
        }

        const studentsEnrolled = course.studentsEnrolled;
        for (const studentId of studentsEnrolled) {
            await User.findByIdAndUpdate(studentId, { $pull: { courses: courseId } });
        }

        await Tag.findByIdAndUpdate(course.category, { $pull: { course: courseId } });
        await User.findByIdAndUpdate(course.instructor, { $pull: { courses: courseId } });

        const courseSections = course.courseContent;
        for (const sectionId of courseSections) {
            const section = await Section.findById(sectionId);
            if (section) {
                const subSections = section.subSection;
                for (const subSectionId of subSections) {
                    await SubSection.findByIdAndDelete(subSectionId);
                }
            }
            await Section.findByIdAndDelete(sectionId);
        }

        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            success: true,
            message: "Course deleted successfully",
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while deleting the course",
            error: err.message,
        });
    }
};

exports.getFullCourseDetails = async (req, res) => {
    try {
        const { courseId } = req.body;
        const userId = req.user.id;

        const courseDetails = await Course.findById(courseId)
            .populate({
                path: "instructor",
                populate: { path: "additionalDetails" },
            })
            .populate("category")
            .populate("ratingAndReviews")
            .populate({
                path: "courseContent",
                populate: { path: "subSection" },
            })
            .exec();

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: `Could not find course with id: ${courseId}`,
            });
        }

        let courseProgressCount = await CourseProgress.findOne({
            courseID: courseId,
            userId: userId,
        });

        let totalDurationInSeconds = 0;
        courseDetails.courseContent.forEach((content) => {
            content.subSection.forEach((subSection) => {
                totalDurationInSeconds += parseInt(subSection.timeDuration || 0);
            });
        });
        const totalDuration = `${Math.floor(totalDurationInSeconds / 60)}m`;

        return res.status(200).json({
            success: true,
            data: {
                courseDetails,
                totalDuration,
                completedVideos: courseProgressCount?.completedVideos || [],
            },
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Could not fetch full course details",
            error: err.message,
        });
    }
};