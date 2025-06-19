import { NextResponse } from "next/server";
import LeadService from "../../services/leadServices";

// GET /api/routes/leads
export async function GET(req: Request) {
  try {
    // Get search params
    const { searchParams } = new URL(req.url);
    const forceRefresh = searchParams.get('refresh') === 'true';
    
    const leads = await LeadService.getAllLeads(forceRefresh);
    
    if (!Array.isArray(leads)) {
      console.error('Invalid leads data format:', leads);
      throw new Error('Invalid leads data received from service');
    }

    console.log(`Successfully fetched ${leads.length} leads`);
    

    
    return NextResponse.json({ 
      success: true, 
      data: leads,
      count: leads.length,
      timestamp: new Date().toISOString()
    });
  } catch (error: any) {
    console.error('Error in GET /api/routes/leads:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: error.message || "Failed to fetch leads",
        error: process.env.NODE_ENV === 'development' ? {
          message: error.message,
          stack: error.stack,
        } : undefined
      },
      { status: 500 }
    );
  }
}

// POST /api/routes/leads
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, email, phone, message, status } = body;

        if (!name || !email || !phone || !message) {
            return NextResponse.json(
                { success: false, message: "All fields are required" },
                { status: 400 }
            );
        }

        const newLead = await LeadService.addLead({
            name,
            email,
            phone,
            message,
            status: status ?? "New",
        });

        return NextResponse.json({ success: true, data: newLead });
    } catch (error: unknown) {
        const err = error as Error;
        return NextResponse.json(
            { success: false, message: err.message || "Failed to create lead" },
            { status: 500 }
        );
    }
}
  
