import { NextResponse } from "next/server";
import { uploadMedia } from "@/app/api/controller/mediaController";
import TestimonialService from "@/app/api/services/testimonialServices";
import { IncomingForm } from "formidable";
import { Readable } from "stream";

// Disable Next.js body parsing
export const config = {
    api: {
        bodyParser: false,
    },
};

// Helper: Parse multipart form data using formidable
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

// fetch all testimonials
export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const status = searchParams.get("status");

        // Get client's ETag from request
        const ifNoneMatch = request.headers.get('if-none-match');

        // Generate response headers
        const headers = new Headers({
            'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
            'Vary': 'Accept, Authorization',
            'ETag': '"testimonials-v1"', // Simple versioning
        });

        // Initialize testimonials service
        await TestimonialService.initTestimonials();

        // Check if client's ETag matches
        if (ifNoneMatch === '"testimonials-v1"') {
            return new Response(null, {
                status: 304,
                headers,
            });
        }

        const data = status === "active"
            ? await TestimonialService.getActiveTestimonials()
            : await TestimonialService.getAllTestimonials();

        // Add performance metrics
        const metrics = {
            timestamp: Date.now(),
            count: data.length,
            activeCount: data.filter((t: any) => t.status === 'active').length,
        };
               
        return NextResponse.json({
            statusCode: 200,
            message: "Testimonials fetched successfully",
            data,
            metrics,
            errorCode: "NO",
            errorMessage: "",
        }, {
            headers,
            status: 200,
        });
    } catch (error: any) {
        console.error("GET error:", error);
        return NextResponse.json(
            {
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
                errorMessage: error.message || "Internal Server Error",
            },
            { status: 500 }
        );
    }
}

// ✅ POST handler - create a new testimonial
export async function POST(req: Request) {
    try {
        const { fields, files } = await parseForm(req);

        const getField = (f: any) => (Array.isArray(f) ? f[0] : f || "");

        const name = getField(fields.name);
        const description = getField(fields.description);
        const spread = getField(fields.spread);
        const ratingRaw = getField(fields.rating);
        const status = getField(fields.status) === "inactive" ? "inactive" : "active";
        const createdOn = new Date().toISOString();
        const updatedOn = createdOn;

        const rating = ratingRaw ? parseInt(ratingRaw) : undefined;

        const file = Array.isArray(files.media) ? files.media[0] : files.media;
        let media = "";
        let mediaType: "image" | "video" | null = null;

        if (file) {
            const uploaded = await uploadMedia(file);
            media = uploaded.url;
            mediaType = uploaded.type; // 'image' or 'video'
        }

        // === Conditional Validation ===
        if (!name) {
            return NextResponse.json({ error: "Name is required" }, { status: 400 });
        }

        if (mediaType === "image") {
            if (!description || typeof rating !== "number" || isNaN(rating) || !media) {
                return NextResponse.json(
                    {
                        error: "Image testimonials require name, description, rating, and media",
                    },
                    { status: 400 }
                );
            }
        }

        if (mediaType === "video") {
            if (!media) {
                return NextResponse.json(
                    { error: "Video testimonials require name and video file" },
                    { status: 400 }
                );
            }
        }

        if (!mediaType) {
            if (!description || typeof rating !== "number" || isNaN(rating) || !spread) {
                return NextResponse.json(
                    {
                        error:
                            "Text-only testimonials require name, description, rating, and spread",
                    },
                    { status: 400 }
                );
            }
        }

        const testimonial = {
            name,
            description: description || "",
            media,
            mediaType: mediaType || "no-media",
            spread: spread || "",
            rating: rating || 0,
            status,
            createdOn,
            updatedOn,
        };

        const newDoc = await TestimonialService.addTestimonial(testimonial);
        const id = newDoc.id;


        return NextResponse.json({
            statusCode: 201,
            message: "Testimonial created successfully",
            data: testimonial,
            errorCode: "NO",
            errorMessage: "",
        });
    } catch (err: any) {
        console.error("POST error:", err);
        return NextResponse.json(
            { error: err.message || "Failed to add testimonial" },
            { status: 500 }
        );
    }
}
