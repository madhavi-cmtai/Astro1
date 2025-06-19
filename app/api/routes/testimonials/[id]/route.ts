import { NextRequest, NextResponse } from "next/server";
import { IncomingForm } from "formidable";
import { Readable } from "stream";
import { replaceMedia, deleteMedia } from "@/app/api/controller/mediaController";
import TestimonialService from "@/app/api/services/testimonialServices";

// Disable body parsing for formidable
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper: parse FormData using formidable
const parseForm = async (req: Request) => {
    const form = new IncomingForm({ keepExtensions: true });

    const contentType = req.headers.get("content-type") || "";
    const contentLength = req.headers.get("content-length") || "";

    const bodyBuffer = Buffer.from(await req.arrayBuffer());

    const mockReq = Object.assign(Readable.from(bodyBuffer), {
        headers: {
            "content-type": contentType,
            "content-length": contentLength,
        },
        method: "POST",
        url: "",
    });

    return new Promise<{ fields: any; files: any }>((resolve, reject) => {
        form.parse(mockReq as any, (err, fields, files) => {
            if (err) reject(err);
            else resolve({ fields, files });
        });
    });
};


// PUT - Update Testimonial
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const existing = await TestimonialService.getTestimonialById(id);

        if (!existing) {
            return NextResponse.json({
                statusCode: 404,
                message: "Testimonial not found",
                data: null,
                errorCode: "NOT_FOUND",
                errorMessage: "Testimonial not found"
            }, { status: 404 });
        }

        const { fields, files } = await parseForm(req);
        const getField = (f: any) => (Array.isArray(f) ? f[0] : f || "");

        const name = getField(fields.name) || existing.name;
        const description = getField(fields.description) || existing.description;
        const spread = getField(fields.spread) || existing.spread;
        const ratingRaw = getField(fields.rating);
        const status = getField(fields.status) === "inactive" ? "inactive" : "active";
        const updatedOn = new Date().toISOString();
        const mediaTypeField = getField(fields.mediaType);

        let mediaType = mediaTypeField || existing.mediaType;
        let media = existing.media;
        const rating = ratingRaw ? parseInt(ratingRaw) : existing.rating;

        // Validate mediaType
        if (!["image", "video", "no-media"].includes(mediaType)) {
            return NextResponse.json({
                statusCode: 400,
                message: "Invalid media type",
                errorCode: "VALIDATION_ERROR",
                errorMessage: "Media type must be 'image', 'video', or 'no-media'"
            }, { status: 400 });
        }

        // Handle media replacement if file is sent
        const file = Array.isArray(files.media) ? files.media[0] : files.media;

        if (file && file.size > 0 && file.filepath) {
            const uploaded = await replaceMedia(file, existing.media); // ✅ FIXED ARG ORDER
            media = uploaded.url;
            mediaType = uploaded.type;
        }

        // Apply conditional validation
        if (!name) {
            return NextResponse.json({
                statusCode: 400,
                message: "Name is required",
                errorCode: "VALIDATION_ERROR",
                errorMessage: "Name is required"
            }, { status: 400 });
        }

        if (mediaType === "image") {
            if (!description || typeof rating !== "number" || isNaN(rating) || !media) {
                return NextResponse.json({
                    statusCode: 400,
                    message: "Image testimonials require name, description, media, and rating",
                    errorCode: "VALIDATION_ERROR",
                    errorMessage: "Invalid input for image testimonial"
                }, { status: 400 });
            }
        }

        if (mediaType === "video") {
            if (!media) {
                return NextResponse.json({
                    statusCode: 400,
                    message: "Video testimonials require name and media",
                    errorCode: "VALIDATION_ERROR",
                    errorMessage: "Invalid input for video testimonial"
                }, { status: 400 });
            }
        }

        if (mediaType === "no-media") {
            media = ""; // clear media
            if (!description || typeof rating !== "number" || isNaN(rating) || !spread) {
                return NextResponse.json({
                    statusCode: 400,
                    message: "Text testimonials require name, description, rating, and spread",
                    errorCode: "VALIDATION_ERROR",
                    errorMessage: "Invalid input for text testimonial"
                }, { status: 400 });
            }
        }

        const updated = {
            ...existing,
            name,
            description,
            media,
            mediaType,
            spread,
            rating,
            status,
            updatedOn,
        };

        await TestimonialService.updateTestimonial(id, updated);

        return NextResponse.json({
            statusCode: 200,
            message: "Testimonial updated successfully",
            data: updated,
            errorCode: "NO",
            errorMessage: "",
        });

    } catch (err: any) {
        console.error("PUT error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to update testimonial" },
            { status: 500 }
        );
    }
}


// DELETE - Remove testimonial
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const testimonial = await TestimonialService.getTestimonialById(id);
        if (!testimonial) {
            return NextResponse.json({ error: "Testimonial not found" }, { status: 404 });
        }

        // Delete media if present
        if (testimonial.media) {
            await deleteMedia(testimonial.media);
        }

        await TestimonialService.deleteTestimonial(id);

        return NextResponse.json({
            data: id,
            message: "Testimonial deleted successfully",
            statusCode: 200,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (err: any) {
        console.error("DELETE error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to delete testimonial" },
            { status: 500 }
        );
    }
}
