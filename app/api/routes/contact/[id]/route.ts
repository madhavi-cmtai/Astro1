import { db } from "@/app/api/config/firebase";
import { NextRequest, NextResponse } from "next/server";

//  GET a specific contact message by ID
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const doc = await db.collection("contactMessages").doc(id).get();

        if (!doc.exists) {
            return NextResponse.json({ message: "Message not found" }, { status: 404 });
        }

        return NextResponse.json({ id: doc.id, ...doc.data() }, { status: 200 });
    } catch (error) {
        console.error(" Error fetching contact message:", error);
        return NextResponse.json({ message: "Error retrieving message" }, { status: 500 });
    }
}

// PUT to update a contact message (e.g., update status)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();
        await db.collection("contactMessages").doc(id).set({
            ...body,
            updatedOn: new Date().toISOString(),
        }, { merge: true });

        return NextResponse.json({ message: "Message updated successfully" }, { status: 200 });
    } catch (error) {
        console.error("Error updating contact message:", error);
        return NextResponse.json({ message: "Error updating message" }, { status: 500 });
    }
}


//  DELETE a specific contact message
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        await db.collection("contactMessages").doc(id).delete();

        return NextResponse.json({ message: "Message deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error(" Error deleting contact message:", error);
        return NextResponse.json({ message: "Error deleting message" }, { status: 500 });
    }
}
