import { NextRequest, NextResponse } from "next/server";
import LeadService from "../../../services/leadServices";
import consoleManager from "../../../utils/consoleManager";

// Get lead by ID (GET)
export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const lead = await LeadService.getLeadById(id);

        if (!lead) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Lead not found",
            }, { status: 404 });
        }

        consoleManager.log("Lead fetched:", lead);
        return NextResponse.json({
            statusCode: 200,
            message: "Lead fetched successfully",
            data: lead,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in GET /api/leads/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Update lead (PUT)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const body = await req.json();

        const updatedLead = await LeadService.updateLead(id, body);

        if (!updatedLead) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Lead not found",
            }, { status: 404 });
        }

        consoleManager.log("Lead updated:", updatedLead);
        return NextResponse.json({
            statusCode: 200,
            message: "Lead updated successfully",
            data: updatedLead,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in PUT /api/leads/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}

// Delete lead (DELETE)
export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    try {
        const { id } = await params;
        const isDeleted = await LeadService.deleteLead(id);

        if (!isDeleted.success) {
            return NextResponse.json({
                statusCode: 404,
                errorCode: "NOT_FOUND",
                errorMessage: "Lead not found",
            }, { status: 404 });
        }

        consoleManager.log("Lead deleted:", id);
        return NextResponse.json({
            statusCode: 200,
            message: "Lead deleted successfully",
            data: null,
            errorCode: "NO",
            errorMessage: "",
        }, { status: 200 });

    } catch (error: unknown) {
        const message = typeof error === "object" && error && "message" in error ? (error as { message?: string }).message : String(error);
        consoleManager.error("Error in DELETE /api/leads/[id]:", error);
        return NextResponse.json({
            statusCode: 500,
            errorCode: "INTERNAL_ERROR",
            errorMessage: message || "Internal Server Error",
        }, { status: 500 });
    }
}