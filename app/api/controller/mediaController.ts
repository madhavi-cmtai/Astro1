import { adminStorage } from "../config/firebase";
import { File as FormidableFile } from "formidable";
import fs from "fs/promises";
const MAX_MEDIA_SIZE = 50 * 1024 * 1024; 

// Upload new media
const uploadMedia = async (file: any): Promise<{ url: string; type: "image" | "video" }> => {
    try {
        if (!file || !file.filepath) throw new Error("No media file provided.");

        const buffer = await fs.readFile(file.filepath);

        // Check file size (e.g. 50MB limit)
        if (buffer.length > MAX_MEDIA_SIZE) {
            throw new Error("File size exceeds the 50MB limit.");
        }

        // Extract file extension from originalFilename
        const originalName = file.originalFilename || "file";
        let extension = originalName.split(".").pop()?.toLowerCase();
        if (!extension || extension === originalName) {
            extension = "jpg";
        }

        const timestamp = Date.now();
        const filePath = `stall-craft/media/${Date.now()}_${file.originalFilename}`;

        const firebaseFile = adminStorage.bucket().file(filePath);

        const blobStream = firebaseFile.createWriteStream({
            metadata: { contentType: file.mimetype || "application/octet-stream" },
        });

        return new Promise((resolve, reject) => {
            blobStream.on("error", reject);

            blobStream.on("finish", async () => {
                const [url] = await firebaseFile.getSignedUrl({
                    action: "read",
                    expires: "03-09-2491",
                });

                const type: "image" | "video" = file.mimetype?.startsWith("video/")
                    ? "video"
                    : "image";

                resolve({ url, type });
            });

            blobStream.end(buffer);
        });

    } catch (error: any) {
        throw new Error("Error uploading media: " + error.message);
    }
};


// Replace media: delete old and upload new
const replaceMedia = async (
    file?: FormidableFile | null,
    oldUrl?: string | null
): Promise<{ url: string; type: "image" | "video" }> => {
    try {
        if (!file || !file.filepath) {
            if (typeof oldUrl === "string" && oldUrl.length > 0) {
                const fallbackType = oldUrl.includes(".mp4") || oldUrl.includes(".webm")
                    ? "video"
                    : "image";
                return { url: oldUrl, type: fallbackType };
            } else {
                throw new Error("No media file provided.");
            }
        }

        const bucket = adminStorage.bucket();

        if (oldUrl && oldUrl.length > 0) {
            try {
                let oldFilePath: string;
                if (oldUrl.includes("/o/")) {
                    oldFilePath = oldUrl.split("/o/")[1].split("?")[0];
                } else if (oldUrl.includes("storage.googleapis.com")) {
                    const parts = oldUrl.split("storage.googleapis.com/")[1];
                    oldFilePath = parts.split("/").slice(1).join("/").split("?")[0];
                } else if (oldUrl.includes(".firebasestorage.app")) {
                    const url = new URL(oldUrl);
                    oldFilePath = url.pathname.replace(/^\/+/, "");
                } else {
                    throw new Error("Invalid old media URL format");
                }

                const decodedOldFilePath = decodeURIComponent(oldFilePath);
                await bucket.file(decodedOldFilePath).delete();
                console.log(" Old media deleted:", decodedOldFilePath);
            } catch (deleteErr: any) {
                console.warn(" Failed to delete old media:", deleteErr.message);
            }
        }

        return await uploadMedia(file);
    } catch (error: any) {
        throw new Error("Error replacing media: " + error.message);
    }
  };;
  

  
// Delete media from Firebase Storage
const deleteMedia = async (mediaUrl: string) => {
    try {
        if (!mediaUrl) {
            console.warn(" No media URL provided for deletion");
            return; 
        }

        const bucket = adminStorage.bucket();
        let filePath: string;

        if (mediaUrl.includes("/o/")) {
            const encodedPath = mediaUrl.split("/o/")[1].split("?")[0];
            filePath = decodeURIComponent(encodedPath);
        } else if (mediaUrl.includes("storage.googleapis.com")) {
            const urlParts = mediaUrl.split("storage.googleapis.com/")[1].split("?")[0];
            filePath = urlParts.split("/").slice(1).join("/");
        } else if (mediaUrl.includes(".firebasestorage.app")) {
            const url = new URL(mediaUrl);
            let path = decodeURIComponent(url.pathname).replace(/^\/+/, "");
            filePath = path.includes("/o/") ? path.split("/o/")[1] : path;
        } else {
            console.warn(" Unknown media URL format:", mediaUrl);
            return; 
        }

        console.log(" Deleting from Firebase:", filePath);

        const [exists] = await bucket.file(filePath).exists();
        if (!exists) {
            console.warn("File not found in Firebase Storage:", filePath);
            return; 
        }

        await bucket.file(filePath).delete();
        console.log(" Deleted media from Firebase Storage:", filePath);

    } catch (error: any) {
        console.warn("⚠️ Failed to delete media:", error.message);
        
    }
};





export { uploadMedia, replaceMedia, deleteMedia };
