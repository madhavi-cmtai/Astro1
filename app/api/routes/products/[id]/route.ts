import { NextRequest, NextResponse } from "next/server";
import ProductService from "../../../services/productServices";
import consoleManager from "../../../utils/consoleManager";
import formidable, { IncomingForm } from "formidable";
import { Readable } from "stream";
import fs from "fs";
import { ReplaceImage, DeleteImage } from "../../../controller/imageController";

// Get a single product by ID (GET)
export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const products = await ProductService.getProductById(id);

        if (!products) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Product not found",
            }, { status: 404 });
        }

        return NextResponse.json({
            statusCode: 200,
            message: "Product fetched successfully",
            data: products,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update a product by ID (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        if (!id) throw new Error("Product ID is required");

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

        const name = Array.isArray(fields.name) ? fields.name[0] : fields.name;
        const description = Array.isArray(fields.description) ? fields.description[0] : fields.description;
        const price = Array.isArray(fields.price) ? fields.price[0] : fields.price;
        const size = Array.isArray(fields.size) ? fields.size[0] : fields.size;
        const benefits = Array.isArray(fields.benefits) ? fields.benefits[0] : fields.benefits;
        const category = Array.isArray(fields.category) ? fields.category[0] : fields.category;

        const existingProduct = await ProductService.getProductById(id);
        if (!existingProduct) {
            return NextResponse.json(
                { statusCode: 404, errorCode: "NOT_FOUND", errorMessage: "Product not found" },
                { status: 404 }
            );
        }

        const image = Array.isArray(files.image) ? files.image[0] : files.image;
        let imageUrl: string | undefined;

        if (image?.filepath) {
            const replacedImage = await ReplaceImage(
                fs.createReadStream(image.filepath),
                existingProduct.image,
                800,
                600
            );
            imageUrl = replacedImage;
        }

        const updatedProduct = await ProductService.updateProduct(id, {
            ...(name && { name }),
            ...(description && { description }),
            ...(price && { price }),
            ...(size && { size }),
            ...(benefits && { benefits }),
            ...(category && { category }),
            ...(imageUrl && { image: imageUrl }),
            updatedOn: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Product updated successfully",
                data: updatedProduct,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/routes/products/[id]:", error);
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

// Delete a product by ID (DELETE)
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        // Fetch the product
        const product = await ProductService.getProductById(id) as {
            id: string;
            image?: string;
            [key: string]: any;
        };

        if (!product) {
            return NextResponse.json(
                {
                    statusCode: 404,
                    errorCode: "NOT_FOUND",
                    errorMessage: "Product not found",
                },
                { status: 404 }
            );
        }

        // Delete associated image if exists
        if (product.image) {
            try {
                await DeleteImage(product.image);
            } catch (imgErr) {
                consoleManager.error(`Image deletion failed for product ${id}:`, imgErr);
            }
        }

        // Delete product record
        const deletedProduct = await ProductService.deleteProduct(id);

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Product deleted successfully",
                data: deletedProduct,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/routes/products/[id]:", error);
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
