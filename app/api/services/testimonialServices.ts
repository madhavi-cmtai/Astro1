import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

interface CacheEntry {
    data: any[];
    timestamp: number;
    etag: string;
}

class TestimonialService {
    private static cache: CacheEntry | null = null;
    private static CACHE_TTL = 30000; // 30 seconds
    private static readonly BATCH_SIZE = 20;

    // Normalize mediaType
    private static normalizeMediaType(item: any) {
        if (!item.mediaType || item.mediaType === "none") {
            item.mediaType = "no-media";
        }
        return item;
    }

    static async initTestimonials() {
        if (!this.cache || this.isCacheStale()) {
            await this.refreshCache();
        }
        return this.cache?.data || [];
    }

    private static isCacheStale(): boolean {
        if (!this.cache) return true;
        return Date.now() - this.cache.timestamp > this.CACHE_TTL;
    }

    private static async refreshCache() {
        try {
            const testimonialsRef = db.collection("testimonials").orderBy("createdOn", "desc");

            let allTestimonials: any[] = [];
            let lastDoc = null;

            do {
                let query = testimonialsRef.limit(this.BATCH_SIZE);
                if (lastDoc) {
                    query = query.startAfter(lastDoc);
                }

                const snapshot = await query.get();
                if (snapshot.empty) break;

                const batchDocs = snapshot.docs.map(doc => {
                    const data = { id: doc.id, ...doc.data() };
                    return this.normalizeMediaType(data);
                });

                allTestimonials = [...allTestimonials, ...batchDocs];
                lastDoc = snapshot.docs[snapshot.docs.length - 1];

            } while (lastDoc);

            this.cache = {
                data: allTestimonials,
                timestamp: Date.now(),
                etag: `v1-${Date.now()}`
            };

            consoleManager.log(`✅ Cache refreshed with ${allTestimonials.length} testimonials`);
        } catch (error) {
            consoleManager.error("❌ Error refreshing cache:", error);
            throw new Error("Failed to refresh testimonials cache");
        }
    }

    static async getAllTestimonials(forceRefresh = false) {
        try {
            if (forceRefresh || this.isCacheStale()) {
                await this.refreshCache();
            }
            return this.cache?.data || [];
        } catch (error) {
            consoleManager.error("❌ Error getting all testimonials:", error);
            throw new Error("Failed to fetch testimonials");
        }
    }

    static async getActiveTestimonials(forceRefresh = false) {
        try {
            if (!forceRefresh && this.cache && !this.isCacheStale()) {
                const activeTestimonials = this.cache.data.filter(
                    testimonial => testimonial.status === "active"
                );
                consoleManager.log("Returning active testimonials from cache. Count:", activeTestimonials.length);
                return activeTestimonials;
            }

            const snapshot = await db.collection("testimonials")
                .where("status", "==", "active")
                .orderBy("createdOn", "desc")
                .get();

            const activeTestimonials = snapshot.docs.map(doc => {
                const data = { id: doc.id, ...doc.data() };
                return this.normalizeMediaType(data);
            });

            this.cache = {
                data: activeTestimonials,
                timestamp: Date.now(),
                etag: `v1-${Date.now()}`
            };

            consoleManager.log("✅ Active testimonials fetched from Firestore. Count:", activeTestimonials.length);
            return activeTestimonials;
        } catch (error) {
            consoleManager.error("❌ Error getting active testimonials:", error);
            throw new Error("Failed to fetch active testimonials");
        }
    }

    static async addTestimonial(testimonialData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const mediaType = testimonialData.mediaType || "no-media";

            const newTestimonialRef = await db.collection("testimonials").add({
                ...testimonialData,
                mediaType,
                createdOn: timestamp,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ New testimonial added with ID:", newTestimonialRef.id);

            await this.getAllTestimonials(true);

            return { id: newTestimonialRef.id, ...testimonialData, mediaType, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding testimonial:", error);
            throw new Error("Failed to add testimonial");
        }
    }

    static async getTestimonialById(testimonialId: string, forceFirestore: boolean = false) {
        try {
            if (!forceFirestore && this.cache && !this.isCacheStale()) {
                const cachedTestimonial = this.cache.data.find(t => t.id === testimonialId);
                if (cachedTestimonial) {
                    consoleManager.log("✅ Testimonial fetched from cache:", testimonialId);
                    return cachedTestimonial;
                }
            }

            const testimonialRef = db.collection("testimonials").doc(testimonialId);
            const doc = await testimonialRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Testimonial not found:", testimonialId);
                return null;
            }

            const testimonial = this.normalizeMediaType({ id: doc.id, ...doc.data() });

            if (this.cache) {
                this.cache.data = this.cache.data.map(t =>
                    t.id === testimonialId ? testimonial : t
                );
            }

            consoleManager.log("✅ Testimonial fetched from Firestore:", testimonialId);
            return testimonial;
        } catch (error) {
            consoleManager.error("❌ Error fetching testimonial by ID:", error);
            throw new Error("Failed to fetch testimonial");
        }
    }

    static async updateTestimonial(testimonialId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();

            // Normalize mediaType if undefined
            if (!updatedData.mediaType || updatedData.mediaType === "none") {
                updatedData.mediaType = "no-media";
            }

            const testimonialRef = db.collection("testimonials").doc(testimonialId);
            await testimonialRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Testimonial updated:", testimonialId);

            await this.getAllTestimonials(true);

            return { id: testimonialId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating testimonial:", error);
            throw new Error("Failed to update testimonial");
        }
    }

    static async deleteTestimonial(testimonialId: string) {
        try {
            await db.collection("testimonials").doc(testimonialId).delete();
            consoleManager.log("✅ Testimonial deleted:", testimonialId);

            await this.getAllTestimonials(true);

            return { success: true, message: "Testimonial deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting testimonial:", error);
            throw new Error("Failed to delete testimonial");
        }
    }
}

export default TestimonialService;
