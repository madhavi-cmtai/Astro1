import { NextResponse } from "next/server";
import { UploadImage } from "../../controller/imageController";
import UserService from "../../services/userServices";
import consoleManager from "../../utils/consoleManager";

// Get all packages (GET)
export async function GET(req: Request) {
    try {

        // Fetch packages based on status filter
        const users = await UserService.getAllUsers();
        consoleManager.log("Fetched all users:", users.length);


        return NextResponse.json({
            statusCode: 200,
            message: "Users fetched successfully",
            data: users,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("❌ Error in GET /api/users:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Add a new user (POST)
export async function POST(req: Request) {  
    try {
        const formData = await req.formData();
        const title = formData.get("title");
        const file = formData.get("image");

        if (!title || !file) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "BAD_REQUEST",
                errorMessage: "Title, and image are required",
            }, { status: 400 });
        }

        // Upload image to Firebase Storage (800x600 for packages)
        const imageUrl = await UploadImage(file, 600, 400);
        consoleManager.log("✅ Package image uploaded:", imageUrl);

        // Save package data in Firestore
        const newUser = await UserService.addUser({
            title,
            image: imageUrl,
        });

        consoleManager.log("✅ User created successfully:", newUser);

        return NextResponse.json({
            statusCode: 201,
            message: "User added successfully",
            data: newUser,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 201 });

    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/users:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}
