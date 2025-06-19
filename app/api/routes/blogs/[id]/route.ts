import { NextResponse, NextRequest } from "next/server";
import BlogService from "../../../services/blogServices";
import consoleManager from "../../../utils/consoleManager";
import { ReplaceImage, DeleteImage } from "@/app/api/controller/imageController";
import formidable, { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs";

export const config = {
    api: {
        bodyParser: false,
    },
};

// GET
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const rawTitle = id;

        // Normalize the slug to a title string
        const decodedTitle = decodeURIComponent(rawTitle)
            .toLowerCase()
            .replace(/-/g, " ")
            .replace(/\s+/g, " ")
            .trim();

        const blog = await BlogService.getBlogByTitle(decodedTitle);

        if (!blog) {
            return NextResponse.json(
                {
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "Blog not found by title",
                },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Blog fetched successfully",
                data: blog,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in GET /api/routes/blogs/[id]:", error);
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


// PUT
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        const form = new IncomingForm({ keepExtensions: true, multiples: false });
        const nodeReq = Readable.fromWeb(req.body as any) as any;
        nodeReq.headers = Object.fromEntries(req.headers.entries());
        nodeReq.method = req.method;

        const { fields, files } = await new Promise<{ fields: any; files: any }>((resolve, reject) => {
            form.parse(nodeReq, (err, fields, files) => {
                if (err) reject(err);
                else resolve({ fields, files });
            });
        });

        const title = Array.isArray(fields.title) ? fields.title[0] : fields.title;
        const summary = Array.isArray(fields.summary) ? fields.summary[0] : fields.summary;


        const existingBlog = await BlogService.getBlogById(id);
        if (!existingBlog) {
            return NextResponse.json(
                {
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "Blog not found",
                },
                { status: 404 }
            );
        }

        const image = Array.isArray(files.image) ? files.image[0] : files.image;
        let imageUrl: string | undefined;

        if (image && image.filepath) {
            let imageToReplace: string | undefined = undefined;

            if (
                typeof existingBlog === "object" &&
                existingBlog !== null &&
                "image" in existingBlog &&
                typeof existingBlog.image === "string"
            ) {
                imageToReplace = existingBlog.image;
            }

            let replacedImage: string | undefined = undefined;
            if (imageToReplace) {
                replacedImage = await ReplaceImage(
                    fs.createReadStream(image.filepath),
                    imageToReplace,
                    800,
                    600
                );
            }

            imageUrl = replacedImage ?? undefined;
        }
        
        const updatedBlog = await BlogService.updateBlog(id, {
            title,
            summary,
            titleLower: (title || "").toLowerCase().replace(/\s+/g, " ").trim(),
            ...(imageUrl && { image: imageUrl }),
        });
        

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Blog updated successfully",
                data: updatedBlog,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/routes/blogs/[id]:", error);
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

// DELETE
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Cast the blog to the expected Blog interface
        const blog = await BlogService.getBlogById(id) as {
            id: string;
            image?: string;
            [key: string]: any;
        };

        if (!blog) {
            return NextResponse.json(
                {
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "Blog not found",
                },
                { status: 404 }
            );
        }

        if (blog.image) {
            try {
                await DeleteImage(blog.image);
            } catch (imgErr) {
                consoleManager.error(`Image deletion failed for blog ${id}:`, imgErr);
            }
        }

        const deletedBlog = await BlogService.deleteBlog(id);

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Blog deleted successfully",
                data: deletedBlog,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/routes/blogs/[id]:", error);
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

