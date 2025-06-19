import { NextRequest, NextResponse } from "next/server";
import { getFirestore } from "firebase-admin/firestore";
import consoleManager from "../utils/consoleManager";

// Initialize Firestore
const db = getFirestore();

export async function POST(req: NextRequest) {
    try {
        const { senderId, receiverId, content } = await req.json(); // Read JSON body

        if (!senderId || !receiverId || !content) {
            return NextResponse.json(
                { message: "All fields are required", statusCode: 400, errorCode: "BAD_REQUEST" },
                { status: 400 }
            );
        }

        const newMessage = {
            senderId,
            receiverId,
            content,
            timestamp: new Date().toISOString(), // Use ISO string for consistent date storage
        };

        const docRef = await db.collection("messages").add(newMessage);

        consoleManager.log("Message sent successfully:", docRef.id);

        return NextResponse.json(
            {
                message: "Message sent successfully",
                id: docRef.id,
                data: newMessage,
                statusCode: 201,
                errorCode: "NO",
            },
            { status: 201 }
        );
    } catch (error: any) {
        consoleManager.error("Error sending message:", error);
        return NextResponse.json(
            {
                message: error.message || "Failed to send message",
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
            },
            { status: 500 }
        );
    }
}

// GET all messages
export async function GET(req: NextRequest) { // No 'res' parameter in App Router GET
    try {
        const snapshot = await db.collection("leads").orderBy("createdOn", "desc").get();
        const leads = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

        return NextResponse.json(
            {
                statusCode: 200,
                message: "Leads fetched successfully",
                data: leads,
                errorCode: "NO",
            },
            { status: 200 }
        );
    } catch (error: any) {
        consoleManager.error("Error fetching leads:", error);
        return NextResponse.json(
            {
                statusCode: 500,
                errorCode: "INTERNAL_ERROR",
                errorMessage: error.message || "Failed to fetch leads",
            },
            { status: 500 }
        );
    }
}