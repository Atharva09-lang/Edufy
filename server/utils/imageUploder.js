const cloudinary = require("cloudinary").v2

exports.uploadImageToCloudinary = async (file, folder, height, quality) => {
    const options = { folder }
    if (height) {
        options.height = height
    }
    if (quality) {
        options.quality = quality
    }
    options.resource_type = "auto"

    return await cloudinary.uploader.upload(file.tempFilePath, options)
}

exports.uploadVideoToCloudinary = async (file, folder) => {
    const LARGE_FILE_THRESHOLD = 10 * 1024 * 1024 // 10MB

    if (file.size > LARGE_FILE_THRESHOLD) {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload_large(
                file.tempFilePath,
                {
                    folder,
                    resource_type: "video",
                    chunk_size: 6000000,
                },
                (error, result) => {
                    if (error) {
                        return reject(error)
                    }
                    resolve(result)
                }
            )
        })
    }

    return await cloudinary.uploader.upload(file.tempFilePath, {
        folder,
        resource_type: "video",
    })
}