import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";


interface Lead {
    id?: string;
    name: string;
    email: string;
    phone: string;
    message: string;
    status?: string;
    createdOn?: string;
    updatedOn?: string | null;
}

class LeadService {
    static leads: Lead[] = [];
    static isInitialized = false;

   
    static initLeads() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for leads...");
        const leadsCollection = db.collection("leads");

        leadsCollection.onSnapshot((snapshot) => {
            this.leads = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...this.normalizeTimestamps(doc.data()),
            }));
            consoleManager.log("Firestore listener: leads updated:", this.leads.length);
        });

        this.isInitialized = true;
    }

    private static normalizeTimestamps(data: any): Lead {
        return {
            ...data,
            createdOn: data.createdOn?.toDate?.().toISOString() ?? null,
            updatedOn: data.updatedOn?.toDate?.().toISOString() ?? null,
        };
    }


    static async addLead(leadData: Omit<Lead, "id" | "createdOn" | "updatedOn">) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();

            const docRef = await db.collection("leads").add({
                ...leadData,
                status: leadData.status ?? "New",
                createdOn: timestamp,
                updatedOn: timestamp,
            });

            consoleManager.log("Lead added:", docRef.id);

            return {
                id: docRef.id,
                ...leadData,
                createdOn: new Date().toISOString(),
                updatedOn: new Date().toISOString(),
            };
        } catch (error) {
            consoleManager.error(" Failed to add lead:", error);
            throw new Error("Failed to add lead");
        }
    }

    //  Get all leads
    static async getAllLeads(forceRefresh = false): Promise<Lead[]> {
        if (forceRefresh || !this.isInitialized) {
            const snapshot = await db.collection("leads").orderBy("createdOn", "desc").get();
            this.leads = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...this.normalizeTimestamps(doc.data()),
            }));
            this.isInitialized = true;
            consoleManager.log(" Fetched leads from Firestore:", this.leads.length);
        } else {
            consoleManager.log("Using cached leads.");
        }

        return this.leads;
    }

    // 📥 Get one lead by ID
    static async getLeadById(id: string): Promise<Lead | null> {
        const cached = this.leads.find((lead) => lead.id === id);
        if (cached) {
            consoleManager.log(" Lead from cache:", id);
            return cached;
        }

        const doc = await db.collection("leads").doc(id).get();
        if (!doc.exists) {
            consoleManager.warn(" Lead not found:", id);
            return null;
        }

        return {
            id: doc.id,
            ...this.normalizeTimestamps(doc.data()),
        };
    }

    // 🔄 Update a lead
    static async updateLead(id: string, updatedData: Partial<Lead>) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();

            await db.collection("leads").doc(id).update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log(" Lead updated:", id);

            return {
                id,
                ...updatedData,
                updatedOn: new Date().toISOString(),
            };
        } catch (error) {
            consoleManager.error(" Failed to update lead:", error);
            throw new Error("Failed to update lead");
        }
    }

    // 🗑️ Delete lead
    static async deleteLead(id: string) {
        try {
            await db.collection("leads").doc(id).delete();
            consoleManager.log(" Lead deleted:", id);
            return { success: true, message: "Lead deleted successfully" };
        } catch (error) {
            consoleManager.error(" Failed to delete lead:", error);
            throw new Error("Failed to delete lead");
        }
    }
}

export default LeadService;
