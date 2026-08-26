const Category = require("../models/Category");
const Tag = require("../models/Tag");
const Course = require("../models/Course");

// create Category
exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name || !description) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const categoryDetails = await Category.create({
            name,
            description,
        });
        console.log(categoryDetails);

        return res.status(200).json({
            success: true,
            message: "Category created successfully",
            data: categoryDetails,
        });

    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Get all Tags
exports.showAllTags = async (req, res) => {
    try {
        const allTags = await Tag.find({}, { name: true, description: true, course: true }).populate("course").exec();
        return res.status(200).json({
            success: true,
            message: "All tags returned successfully",
            data: allTags
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: err.message,
        });
    }
};

// Category page details
exports.getCategoryPayDetails = async (req, res) => {
    try {
        const { categoryId } = req.body;

        const selectedCategory = await Tag.findById(categoryId)
            .populate({
                path: "course",
                populate: [
                    { path: "instructor", select: "firstName lastName email image" },
                    { path: "ratingAndReviews" }
                ]
            })
            .exec();

        if (!selectedCategory) {
            return res.status(404).json({
                success: false,
                message: "Category not found"
            });
        }

        const differentCategories = await Tag.find({ _id: { $ne: categoryId } })
            .populate({
                path: "course",
                populate: [
                    { path: "instructor", select: "firstName lastName email image" },
                    { path: "ratingAndReviews" }
                ]
            })
            .exec();

        const topSellingCourses = await Course.find({ status: "Published" })
            .sort({ studentsEnrolled: -1 })
            .limit(10)
            .populate({
                path: "instructor",
                select: "firstName lastName email image",
            })
            .populate("ratingAndReviews")
            .exec();

        return res.status(200).json({
            success: true,
            message: "Category details fetched successfully",
            data: {
                selectedCategory,
                differentCategories,
                differentCategory: differentCategories.length > 0 ? differentCategories[0] : null,
                topSellingCourses,
                mostSellingCourses: topSellingCourses
            }
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error occurred while fetching category details",
            error: err.message
        });
    }
};