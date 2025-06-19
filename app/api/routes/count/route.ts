import { NextResponse } from "next/server";
import CountService from "../../services/countService";
import consoleManager from "../../utils/consoleManager";

export async function GET() {
    try {
        await CountService.initCounts(); // 🔥 Yeh zaroori hai — warna counts hamesha 0 rahenge

        const counts = CountService.getCounts(); // Real-time or cached counts

        return NextResponse.json({
            statusCode: 200,
            message: "Counts fetched successfully",
            data: counts,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: any) {
        consoleManager.error("Error in GET /api/count:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: error.message || "Internal Server Error",
        }, { status: 500 });
    }
}

