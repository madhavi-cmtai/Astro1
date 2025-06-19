import sharp from "sharp";
import { adminStorage } from "../config/firebase";
import fs from "fs";
import { Readable } from "stream"; 
// Helper to convert a readable stream to a buffer
const streamToBuffer = (stream: NodeJS.ReadableStream): Promise<Buffer> => {
  return new Promise((resolve, reject) => {
    const chunks: Uint8Array[] = [];
    stream.on("data", (chunk) => chunks.push(chunk));
    stream.on("end", () => resolve(Buffer.concat(chunks)));
    stream.on("error", reject);
  });
};

const UploadImage = async (file: any, width: number, height: number): Promise<string> => {
  try {
    let buffer: Buffer;

    // Support browser Blob, Node buffer, or readable stream (from formidable)
    if (typeof file.arrayBuffer === "function") {
      const arrayBuffer = await file.arrayBuffer();
      buffer = Buffer.from(arrayBuffer);
    } else if (file instanceof Buffer) {
      buffer = file;
    } else if (typeof file.pipe === "function") {
      buffer = await streamToBuffer(file);
    } else {
      throw new Error("Unsupported file type");
    }

    const bucket = adminStorage.bucket();
    const filePath = `stall-craft/${Date.now()}_${file.originalFilename || file.name || "image"}`;
    const firebaseFile = bucket.file(filePath);

    const imgWidth = parseInt(width.toString());
    const imgHeight = parseInt(height.toString());

    const resizedBuffer = await sharp(buffer)
      .resize(imgWidth, imgHeight, { fit: sharp.fit.cover })
      .toBuffer();

    const blobStream = firebaseFile.createWriteStream({
      metadata: { contentType: file.mimetype || "image/jpeg" },
    });

    return new Promise((resolve, reject) => {
      blobStream.on("error", reject);
      blobStream.on("finish", async () => {
        const [url] = await firebaseFile.getSignedUrl({
          action: "read",
          expires: "03-09-2491",
        });
        resolve(url);
      });
      blobStream.end(resizedBuffer);
    });
  } catch (error: any) {
    throw new Error("Error uploading image: " + error.message);
  }
};

const ReplaceImage = async (file: any, oldImageUrl: string, width: number, height: number): Promise<string | undefined> => {
  try {
    const bucket = adminStorage.bucket();

    if (oldImageUrl) {
      try {
        console.log("Old Image URL:", oldImageUrl);
        let oldFilePath;
        if (oldImageUrl.includes("/o/")) {
          oldFilePath = oldImageUrl.split("/o/")[1].split("?")[0];
        } else if (oldImageUrl.includes("storage.googleapis.com")) {
          const urlParts = oldImageUrl.split("storage.googleapis.com/")[1].split("?")[0];
          oldFilePath = urlParts.split("/").slice(1).join("/");
        } else {
          throw new Error("Invalid old image URL format");
        }

        const decodedOldFilePath = decodeURIComponent(oldFilePath);
        await bucket.file(decodedOldFilePath).delete();
        console.log("Old image deleted:", decodedOldFilePath);
      } catch (deleteError: any) {
        console.warn("Failed to delete old image:", deleteError.message);
        throw new Error("Failed to delete old image: " + deleteError.message);
      }
    }

    if (file && (typeof file === "string" || file instanceof Readable)) {
      return await UploadImage(file, width, height);
    } else {
      return undefined; 
    }
  } catch (error: any) {
    throw new Error("Error replacing image: " + error.message);
  }
};

const DeleteImage = async (imageUrl: string) => {
  try {
    if (!imageUrl) return;

    const bucket = adminStorage.bucket();

    let filePath;
    if (imageUrl.includes("/o/")) {
      filePath = imageUrl.split("/o/")[1].split("?")[0];
    } else if (imageUrl.includes("storage.googleapis.com")) {
      const urlParts = imageUrl.split("storage.googleapis.com/")[1].split("?")[0];
      filePath = urlParts.split("/").slice(1).join("/");
    } else {
      throw new Error("Invalid image URL format");
    }

    const decodedFilePath = decodeURIComponent(filePath);
    await bucket.file(decodedFilePath).delete();
    console.log("Deleted image from Firebase Storage:", decodedFilePath);
  } catch (error: any) {
    console.warn("Failed to delete image from Firebase:", error.message);
    throw new Error("Image deletion error: " + error.message);
  }
};

export { UploadImage, ReplaceImage, DeleteImage };
