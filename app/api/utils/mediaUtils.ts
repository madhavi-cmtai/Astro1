import { v4 as uuidv4 } from "uuid";
import { adminStorage } from "@/app/api/config/firebase"; // assumes this is admin.storage()

// Upload a file to Firebase Storage and return the public URL
export const uploadMedia = async (file: File): Promise<string> => {
    const buffer = Buffer.from(await file.arrayBuffer());
    const filename = `testimonials/${uuidv4()}-${file.name}`;

    const bucket = adminStorage.bucket(); // ✅ Get default bucket
    const fileRef = bucket.file(filename);

    await fileRef.save(buffer, {
        metadata: {
            contentType: file.type,
            metadata: {
                firebaseStorageDownloadTokens: uuidv4(), // optional, but common
            },
        },
    });

    return `https://storage.googleapis.com/${bucket.name}/${filename}`;
};

// Replace existing file with a new one
export const replaceMedia = async (newFile: File, oldUrl: string): Promise<string> => {
    if (oldUrl) {
        const oldPath = decodeURIComponent(new URL(oldUrl).pathname.split("/").slice(3).join("/"));
        const bucket = adminStorage.bucket();
        const oldRef = bucket.file(oldPath);
        try {
            await oldRef.delete();
        } catch (err) {
            console.warn("Error deleting old media:", err);
        }
    }

    return uploadMedia(newFile);
};

// Delete a file by URL
export const deleteMedia = async (url: string): Promise<void> => {
    if (!url) return;

    const path = decodeURIComponent(new URL(url).pathname.split("/").slice(3).join("/"));
    const bucket = adminStorage.bucket();
    const fileRef = bucket.file(path);

    await fileRef.delete();
};
