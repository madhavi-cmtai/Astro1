import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class RashifalService {
    static rashifals: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initRashifals() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for Rashifals...");
        const rashifalCollection = db.collection("rashifal");

        rashifalCollection.onSnapshot((snapshot: any) => {
            this.rashifals = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log(" Firestore Read: Rashifals updated, count:", this.rashifals.length);
        });

        this.isInitialized = true;
    }

    // Get all rashifals (cache unless forceRefresh is true)
    static async getAllRashifals(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log(" Force refreshing Rashifals from Firestore...");
            const snapshot = await db.collection("rashifal").orderBy("title").get();
            this.rashifals = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached Rashifals.");
        }

        return this.rashifals;
    }

    // Add a new rashifal (Firestore auto-generates ID)
    static async addRashifal(data: { title: string; description: string }) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const docRef = await db.collection("rashifal").add({
                ...data,
                updatedOn: timestamp,
            });

            consoleManager.log(" Rashifal added with ID:", docRef.id);
            await this.getAllRashifals(true);

            return { id: docRef.id, ...data, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error(" Error adding Rashifal:", error);
            throw new Error("Failed to add Rashifal");
        }
    }

    // Get a rashifal by ID (checks cache first)
    static async getRashifalById(id: string) {
        try {
            const cached = this.rashifals.find((r: any) => r.id === id);
            if (cached) {
                consoleManager.log(" Rashifal fetched from cache:", id);
                return cached;
            }

            const doc = await db.collection("rashifal").doc(id).get();
            if (!doc.exists) {
                consoleManager.warn(" Rashifal not found:", id);
                return null;
            }

            consoleManager.log(" Rashifal fetched from Firestore:", id);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error(" Error fetching Rashifal by ID:", error);
            throw new Error("Failed to fetch Rashifal");
        }
    }

    // Update a rashifal
    static async updateRashifal(id: string, updatedData: { description: string }) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            await db.collection("rashifal").doc(id).update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("Rashifal updated:", id);
            await this.getAllRashifals(true);

            return { id, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error(" Error updating Rashifal:", error);
            throw new Error("Failed to update Rashifal");
        }
    }
}

export default RashifalService;
