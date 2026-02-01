import { v2 as cloudinary } from 'cloudinary';

export async function uploadFile(file: File, path: string): Promise<string> {
    // Configure lazily to ensure env vars are loaded in serverless context
    cloudinary.config({
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_KEY,
        api_secret: process.env.CLOUDINARY_API_SECRET
    });

    try {
        if (!file) throw new Error("No file provided");

        // Debugging: Check if keys are present (do not log actual secrets)
        if (!process.env.CLOUDINARY_API_KEY) {
            console.error("CRITICAL: CLOUDINARY_API_KEY is missing in process.env");
            throw new Error("Server Misconfiguration: Missing Cloudinary API Key");
        }

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
        throw error; // Throw real error to see it in UI
    }
}
