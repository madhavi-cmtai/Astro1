import { NextRequest, NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import ProductService from "../../services/productServices";
import consoleManager from "../../utils/consoleManager";

// GET: Fetch all products
export async function GET(req: Request) {
    try {
        const products = await ProductService.getAllProducts();
        consoleManager.log("Fetched all products:", products.length);

        // Sort by createdOn DESC and pick latest 6
        const recommended = [...products]
            .sort((a, b) => new Date(b.createdOn).getTime() - new Date(a.createdOn).getTime())
            .slice(0, 6);

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Products fetched successfully",
                data: {
                    products,
                    recommended,
                },
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/routes/products:", error);
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

// POST: Add a new product
export async function POST(req: Request) {
    try {
        const formData = await req.formData();

        const name = formData.get("name")?.toString();
        const description = formData.get("description")?.toString();
        const priceStr = formData.get("price")?.toString();
        const size = formData.get("size")?.toString();
        const benefits = formData.get("benefits")?.toString();
        const category = formData.get("category")?.toString();
        const file = formData.get("image");

        const price = parseFloat(priceStr || "");
        if (!name || !description || isNaN(price) || !file || !category) {
            return NextResponse.json(
                {
                    statusCode: 400,
                    errorCode: "BAD_REQUEST",
                    errorMessage: "Name, description, price, category, and image are required.",
                },
                { status: 400 }
            );
        }

        const imageUrl = await UploadImage(file, 600, 400);

        const newProduct = await ProductService.addProduct({
            name,
            description,
            price,
            size: size || "",
            benefits: benefits || "",
            category,
            image: imageUrl,
            createdOn: new Date().toISOString(),
            updatedOn: new Date().toISOString(),
        });

        return NextResponse.json(
            {
                statusCode: 201,
                message: "Product added successfully",
                data: newProduct,
                errorCode: "NO",
                errorMessage: "",
            },
            { status: 201 }
        );
    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/routes/products:", error);
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
