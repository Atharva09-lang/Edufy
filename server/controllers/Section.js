const Section = require("../models/Section");
const Course = require("../models/Course");

exports.createSection = async (req, res) => {
    try {
        const { sectionName, courseId } = req.body;
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing properties"
            });
        }

        const newSection = await Section.create({ sectionName });

        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            { $push: { courseContent: newSection._id } },
            { new: true }
        ).populate({
            path: "courseContent",
            populate: { path: "subSection" }
        }).exec();

        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourseDetails
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while creating section",
            error: err.message
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        const { sectionId, sectionName, courseId } = req.body;
        if (!sectionName || !sectionId) {
            return res.status(400).json({
                success: false,
                message: "Missing section name or id"
            });
        }

        const updatedSection = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        if (!updatedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        const course = await Course.findById(courseId)
            .populate({
                path: "courseContent",
                populate: { path: "subSection" }
            }).exec();

        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            data: course
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while updating section",
            error: err.message
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        const { sectionId, courseId } = req.body;

        const deletedSection = await Section.findByIdAndDelete(sectionId);
        if (!deletedSection) {
            return res.status(404).json({
                success: false,
                message: "Section not found"
            });
        }

        // remove the section reference from the course document
        // (this must be findOneAndUpdate + $pull, NOT findOneAndDelete!)
        await Course.findOneAndUpdate(
            { _id: courseId },
            { $pull: { courseContent: sectionId } },
            { new: true }
        );

        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
            data: {}
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting section",
            error: err.message
        });
    }
};