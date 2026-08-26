const SubSection = require('../models/SubSection');
const Section = require('../models/Section');
const { uploadVideoToCloudinary } = require('../utils/imageUploder');

exports.createSubSection = async (req, res) => {
    try {
        const { title, description, sectionId } = req.body;
        const video = req.files.video;

        if (!title || !description || !sectionId || !video) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        const uploadFile = await uploadVideoToCloudinary(video, process.env.FOLDER_NAME);
        console.log("CLOUDINARY UPLOAD RESULT:", uploadFile);

        const subSectionDetails = await SubSection.create({
            title,
            description,
            timeDuration: `${uploadFile.duration || 0}`,
            videoUrl: uploadFile.secure_url
        });

        const updatedSection = await Section.findByIdAndUpdate(
            sectionId,
            { $push: { subSection: subSectionDetails._id } },
            { new: true }
        ).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "Subsection created successfully",
            data: updatedSection
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while creating subsection",
            error: err.message
        });
    }
};

exports.updateSubsection = async (req, res) => {
    try {
        const { subSectionId, title, description, sectionId } = req.body;

        if (!subSectionId) {
            return res.status(400).json({
                success: false,
                message: "subSectionId is required"
            });
        }

        const subSection = await SubSection.findById(subSectionId);
        if (!subSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            });
        }

        if (title) subSection.title = title;
        if (description) subSection.description = description;

        if (req.files && req.files.video) {
            const uploadFile = await uploadVideoToCloudinary(req.files.video, process.env.FOLDER_NAME);
            subSection.videoUrl = uploadFile.secure_url;
            subSection.timeDuration = `${uploadFile.duration || 0}`;
        }

        await subSection.save();

        const updatedSection = await Section.findById(sectionId).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "SubSection updated successfully",
            data: updatedSection
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            success: false,
            message: "Error while updating subsection",
            error: err.message
        });
    }
};

exports.deleteSubsection = async (req, res) => {
    try {
        const { subSectionId, sectionId } = req.body;

        const deletedSubSection = await SubSection.findByIdAndDelete(subSectionId);
        if (!deletedSubSection) {
            return res.status(404).json({
                success: false,
                message: "SubSection not found"
            });
        }

        const updatedSection = await Section.findOneAndUpdate(
            { _id: sectionId },
            { $pull: { subSection: subSectionId } },
            { new: true }
        ).populate("subSection");

        return res.status(200).json({
            success: true,
            message: "SubSection deleted successfully",
            data: updatedSection
        });
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "Error while deleting subsection",
            error: err.message
        });
    }
};