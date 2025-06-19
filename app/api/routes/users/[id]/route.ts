import { NextResponse } from "next/server";
import UserService from "../../../services/userServices";
import consoleManager from "../../../utils/consoleManager";


export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    try {
        const user = await UserService.getUserById(id);
        if (!user) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "User not found",
            }, { status: 404 });
        }
        consoleManager.log("Fetched user:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "User fetched successfully",
            data: user,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in GET /api/users/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });

    }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;    
    try {
        const user = await UserService.updateUser(id, req.body);
        if (!user) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "User not found",
            }, { status: 404 });
        }
        consoleManager.log("Updated user:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "User updated successfully",
            data: user,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in PUT /api/users/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;    
    try {
        const user = await UserService.deleteUser(id);
        if (!user) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "User not found",
            }, { status: 404 });
        }
        consoleManager.log("Deleted user:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "User deleted successfully",
            data: user,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });
    } catch (error: any) {
        consoleManager.error("Error in DELETE /api/users/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

