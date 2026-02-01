import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

export async function uploadFile(file: File, path: string): Promise<string> {
    try {
        if (!file) throw new Error("No file provided");

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: "lottopf", // Optional: organize in folder
                    public_id: path.replace(/\.[^/.]+$/, ""), // Remove extension for public_id
                    resource_type: "auto"
                },
                (error, result) => {
                    if (error) return reject(error);
                    if (result?.secure_url) resolve(result.secure_url);
                    else reject(new Error("Upload failed"));
                }
            );
            uploadStream.end(buffer);
        });

    } catch (error) {
        console.error("Cloudinary upload error:", error);
        throw new Error("Failed to upload image");
    }
}
