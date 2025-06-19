import { NextRequest, NextResponse } from "next/server";
import RashifalService from "@/app/api/services/rashifalService";

// PUT: Update Rashifal description (or other fields)
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const { description } = await req.json();

        if (!description) {
            return NextResponse.json({ error: "Missing description field" }, { status: 400 });
        }

        const updatedRashifal = await RashifalService.updateRashifal(id, { description });

        return NextResponse.json({ message: "Rashifal updated successfully", ...updatedRashifal });
    } catch (error) {
        console.error("Error updating Rashifal:", error);
        return NextResponse.json({ error: "Failed to update Rashifal" }, { status: 500 });
    }
}

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;

        if (!id) {
            return NextResponse.json({ error: "Missing ID" }, { status: 400 });
        }

        const rashifal = await RashifalService.getRashifalById(id);

        if (!rashifal) {
            return NextResponse.json({ error: "Rashifal not found" }, { status: 404 });
        }

        return NextResponse.json(rashifal);
    } catch (error) {
        console.error("Error fetching Rashifal:", error);
        return NextResponse.json({ error: "Failed to fetch Rashifal" }, { status: 500 });
    }
}