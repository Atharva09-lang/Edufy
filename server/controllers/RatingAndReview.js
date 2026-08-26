const RatingAndReview = require('../models/RatingAndReview');
const Course = require('../models/Course');
const mongoose = require('mongoose'); 

exports.createRating = async (req, res) => {
    try {
        const userId = req.user.id;
        const { courseId, rating, review } = req.body;
        
        const courseDetails = await Course.findOne({
            _id: courseId,
            studentsEnrolled: { $elemMatch: { $eq: userId } }
        });

        if (!courseDetails) {
            return res.status(404).json({
                success: false,
                message: "Student is not enrolled in the course",
            });
        }

        const alreadyReviewed = await RatingAndReview.findOne({
            course: courseId,
            user: userId
        });

        if (alreadyReviewed) {
            return res.status(400).json({
                success: false,
                message: "Student already reviewed the course",
            });
        }

        const ratingReview = await RatingAndReview.create({
            course: courseId,
            user: userId,
            rating,
            review,
        });

        
        await Course.findByIdAndUpdate(
            courseId,
            { $push: { ratingAndReviews: ratingReview._id } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Rating and Review created successfully",
            data: ratingReview,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Not able to create and rate the review",
            error: err.message,
        });
    }
};

exports.getAverageRating = async (req, res) => {
    try {
        const { courseId } = req.body;

        const avgRating = await RatingAndReview.aggregate([
            {
                $match: { course: new mongoose.Types.ObjectId(courseId) } 
            },
            {
                $group: {
                    _id: null,
                    averageRating: { $avg: "$rating" },
                }
            }
        ]);

        if (avgRating.length > 0) {
            return res.status(200).json({
                success: true,
                message: "Average rating fetched successfully",
                data: avgRating[0].averageRating,
            });
        }

        return res.status(200).json({
            success: true,
            message: "Average rating is 0",
            data: 0,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Not able to fetch the average rating",
            error: err.message,
        });
    }
};

exports.getAllRating = async (req, res) => {
    try {
        const allReview = await RatingAndReview.find({})
            .sort({ rating: "desc" })
            .populate({ path: "user", select: "firstName lastName email image" })
            .populate({ path: "course", select: "courseName" })
            .exec();

        return res.status(200).json({
            success: true,
            message: "All rating and review fetched successfully",
            data: allReview,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Not able to fetch the rating and review",
            error: err.message,
        });
    }
};


exports.getRatingByCourseId = async (req, res) => {
    try {
        const { courseId } = req.body;

        if (!courseId) {
            return res.status(400).json({
                success: false,
                message: "Course ID is required"
            });
        }

        const reviews = await RatingAndReview.find({ course: courseId })
            .populate({
                path: "user",
                select: "firstName lastName email image"
            });

        if (!reviews.length) {
            return res.status(404).json({
                success: false,
                message: "No reviews found for this course"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ratings fetched successfully",
            data: reviews
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Not able to fetch the rating and review",
            error: err.message,
        });
    }
};