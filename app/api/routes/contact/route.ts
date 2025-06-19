import { db } from "@/app/api/config/firebase";
import { NextRequest, NextResponse } from "next/server";

// GET all contact messages
export async function GET() {
    try {
        const snapshot = await db
            .collection("contactMessages")
            .orderBy("timestamp", "desc")
            .get();

        const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return NextResponse.json({ success: true, data: messages }, { status: 200 });
    } catch (error) {
        console.error("Error fetching messages:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch contact messages" },
            { status: 500 }
        );
    }
}

// POST: add a new contact message
export async function POST(req: NextRequest) {
    try {
        const { name, email, message, phone } = await req.json();

        if (!name || !email || !message) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const data = {
            name,
            email,
            message,
            phone: phone || "",
            timestamp: new Date().toISOString(),
            status: "New", // default status
        };

        const docRef = await db.collection("contactMessages").add(data);

        // 🔧 Changed response shape to include { success: true, data: {...} }
        return NextResponse.json(
            { success: true, data: { id: docRef.id, ...data } },
            { status: 201 }
        );
    } catch (error) {
        console.error("Error saving message:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
