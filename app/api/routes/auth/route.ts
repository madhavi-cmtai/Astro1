import { NextResponse } from "next/server";
import AuthService from "../../services/authServices";
import consoleManager from "../../utils/consoleManager";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email, password } = body;

        // Validate input
        if (!email || !password) {
            return NextResponse.json({
                statusCode: 400,
                errorCode: "INVALID_INPUT",
                errorMessage: "Email and password are required.",
            }, { status: 400 });
        }

        // Authenticate user
        const user = await AuthService.loginUser(email, password);
        consoleManager.log("✅ User logged in:", user.uid);

        // Create response
        const response = NextResponse.json({
            statusCode: 201,
            message: "User logged in successfully",
            data: user,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

        // Secure Cookie Settings
        const cookieOptions = {
            path: "/",
            secure: process.env.NODE_ENV === "production",
            httpOnly: true,
            sameSite: "strict",
            maxAge: 86400, // 1 day
        };

        // Set authentication token cookie
        response.headers.append("Set-Cookie", `authToken=${user.token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=86400`);
        response.headers.append("Set-Cookie", `isAuth=true; Path=/; Secure; SameSite=Strict; Max-Age=86400`);

        return response;
    } catch (error: any) {
        consoleManager.error("❌ Error in POST /api/auth/login:", error.message);

        let statusCode = 401;
        let errorMessage = "Invalid email or password.";
        if (error.message.includes("User not found")) {
            errorMessage = "User not found. Please check your email.";
        } else if (error.message.includes("Incorrect password")) {
            errorMessage = "Incorrect password. Please try again.";
        }

        return NextResponse.json({
            statusCode,
            errorCode: "AUTH_FAILED",
            errorMessage,
        }, { status: statusCode });
    }
}
