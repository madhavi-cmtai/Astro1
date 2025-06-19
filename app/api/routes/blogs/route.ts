import { NextRequest, NextResponse } from "next/server";
import BlogService from "../../services/blogServices";
import { UploadImage } from "../../controller/imageController";
import consoleManager from "../../utils/consoleManager";
import formidable, { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs";



export const config = {
    api: {
        bodyParser: false, 
    },
};

export async function GET(request: NextRequest) {
    try {
        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get("page") || "1");
        const limit = parseInt(searchParams.get("limit") || "10");

        await BlogService.initBlogs();
        const blogs = await BlogService.getAllBlogs();

        const startIndex = (page - 1) * limit;
        const paginatedBlogs = blogs.slice(startIndex, startIndex + limit);

        const eTag = `"blogs-${Date.now()}"`;
        const ifNoneMatch = request.headers.get("if-none-match");

        if (ifNoneMatch === eTag && paginatedBlogs.length > 0) {
            return new Response(null, {
                status: 304,
                headers: {
                    "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
                    ETag: eTag,
                },
            });
        }

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Blogs fetched successfully",
                data: paginatedBlogs,
                pagination: {
                    currentPage: page,
                    totalPages: Math.ceil(blogs.length / limit),
                    hasMore: startIndex + limit < blogs.length,
                    totalItems: blogs.length,
                },
                errorCode: "NO",
                errorMessage: "",
            },
            {
                status: 200,
                headers: {
                    "Cache-Control": "public, max-age=30, stale-while-revalidate=60",
                    ETag: eTag,
                    Vary: "Accept, Authorization",
                },
            }
        );
    } catch (error: any) {
        consoleManager.error("Error in GET /api/blogs:", error);
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

export async function POST(req: NextRequest) {
    try {
        const form = new IncomingForm({ keepExtensions: true, multiples: false });
        const nodeReq = Readable.fromWeb(req.body as any) as any;
        nodeReq.headers = Object.fromEntries(req.headers.entries());
        nodeReq.method = req.method;
        const data = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(nodeReq, (err, fields, files) => {
                if (err) {
                    
                    reject(err);
                } else {         
                    resolve({ fields, files });
                }
            });
        });

        const title = Array.isArray(data.fields.title) ? data.fields.title[0] : data.fields.title;
        const summary = Array.isArray(data.fields.summary) ? data.fields.summary[0] : data.fields.summary; 
        const image = Array.isArray(data.files.image) ? data.files.image[0] : data.files.image;
        if (!title || !summary || !image) {
            
            return NextResponse.json(
                { statusCode: 400, errorMessage: "Title, summary, and image are required" },
                { status: 400 }
            );
        }
        const imageStream = fs.createReadStream(image.filepath);
        const imageUrl = await UploadImage(imageStream, 800, 600);

        if (!imageUrl) {
            throw new Error("Image upload returned no URL");
        }

        const newBlog = {
            title,
            summary,
            image: imageUrl,
            titleLower: (title || "").toLowerCase().replace(/\s+/g, " ").trim(),
        };
        
        const created = await BlogService.addBlog(newBlog);
        return NextResponse.json(
            {
                statusCode: 201,
                message: "Blog created successfully",
                data: created,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 201 }
        );
    } catch (error) {
        return NextResponse.json(
            {
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
                errorMessage: "Something went wrong",
            },
            { status: 500 }
        );
    }
}
  