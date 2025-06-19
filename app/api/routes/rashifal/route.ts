import { NextRequest, NextResponse } from "next/server";
import RashifalService from "@/app/api/services/rashifalService";

// POST: Add new Rashifal (Firestore auto-generates ID)
export async function POST(req: NextRequest) {
    try {
        const { title, description } = await req.json();

        if (!title || !description) {
            return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
        }

        const newRashifal = await RashifalService.addRashifal({ title, description });

        return NextResponse.json({ message: "Rashifal added", ...newRashifal });
    } catch (error) {
        console.error("Error adding Rashifal:", error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}

// GET: Fetch all Rashifals
export async function GET(req: NextRequest) {
    try {
        const rashifals = await RashifalService.getAllRashifals();
        return NextResponse.json(rashifals);
    } catch (error) {
        console.error("Error fetching Rashifals:", error);
        return NextResponse.json({ error: "Failed to fetch Rashifals" }, { status: 500 });
    }
}

