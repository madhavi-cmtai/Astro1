import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

interface CacheEntry {
    data: any[];
    timestamp: number;
    etag: string;
}


class BlogService {
    static blogs: any[] = [];
    private static cache: CacheEntry | null = null;
    private static CACHE_TTL = 30000; // 30 seconds
    private static readonly BATCH_SIZE = 10; 

    // Initialize cache if needed
    static async initBlogs() {
        if (!this.cache || this.isCacheStale()) {
            await this.refreshCache();
        }
        return this.cache?.data || [];
    }

    // Check if cache is stale
    private static isCacheStale(): boolean {
        if (!this.cache) return true;
        return Date.now() - this.cache.timestamp > this.CACHE_TTL;
    }

    // Refresh cache with pagination
    private static async refreshCache() {
        try {
            const blogsRef = db.collection("blogs")
                .orderBy("createdOn", "desc");

            let allBlogs: any[] = [];
            let lastDoc = null;
            
            // Fetch data in batches
            do {
                let query = blogsRef.limit(this.BATCH_SIZE);
                if (lastDoc) {
                    query = query.startAfter(lastDoc);
                }

                const snapshot = await query.get();
                if (snapshot.empty) break;

                const batchDocs = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                    _cached: Date.now() // Add cache timestamp to each document
                }));
                
                allBlogs = [...allBlogs, ...batchDocs];
                lastDoc = snapshot.docs[snapshot.docs.length - 1];

            } while (lastDoc);

            // Update cache with new data
            this.cache = {
                data: allBlogs,
                timestamp: Date.now(),
                etag: `blogs-v1-${Date.now()}`
            };

            consoleManager.log(`✅ Blog cache refreshed with ${allBlogs.length} entries`);
        } catch (error) {
            consoleManager.error("❌ Error refreshing blog cache:", error);
            throw new Error("Failed to refresh blogs cache");
        }
    }

    // Get all blogs with optimized caching
    static async getAllBlogs(forceRefresh = false) {
        try {
            if (forceRefresh || this.isCacheStale()) {
                await this.refreshCache();
            }
            return this.cache?.data || [];
        } catch (error) {
            consoleManager.error("❌ Error getting all blogs:", error);
            throw new Error("Failed to fetch blogs");
        }
    }

    // Add a new blog with createdOn timestamp
    static async addBlog(blogData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newBlogRef = await db.collection("blogs").add({
                ...blogData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New blog added with ID:", newBlogRef.id);

            // Force refresh the cache after adding a new blog
            await this.getAllBlogs(true);

            return { id: newBlogRef.id, ...blogData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding blog:", error);
            throw new Error("Failed to add blog");
        }
    }

    // Get blog by ID (fetches from cache first)
    static async getBlogById(blogId: string) {
        
        try {
            
            const cachedBlog = this.blogs.find((b: any) => b.id === blogId);
            if (cachedBlog) {
                consoleManager.log("✅ Blog fetched from cache:", blogId);
                return cachedBlog;
            }

            const blogRef = db.collection("blogs").doc(blogId);
            const doc = await blogRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Blog not found:", blogId);
                return null;
            }

            consoleManager.log("✅ Blog fetched from Firestore:", blogId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching blog by ID:", error);
            throw new Error("Failed to fetch blog");
        }
    }

    // Update blog with updatedOn timestamp
    static async updateBlog(blogId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const blogRef = db.collection("blogs").doc(blogId);
            await blogRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Blog updated:", blogId);

            // Force refresh the cache after updating a blog
            await this.getAllBlogs(true);

            return { id: blogId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating blog:", error);
            throw new Error("Failed to update blog");
        }
    }

    // Delete blog
    static async deleteBlog(blogId: string) {
        try {
            await db.collection("blogs").doc(blogId).delete();
            consoleManager.log("✅ Blog deleted:", blogId);

            // Force refresh the cache after deleting a blog
            await this.getAllBlogs(true);

            return { success: true, message: "Blog deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting blog:", error);
            throw new Error("Failed to delete blog");
        }
    }
}

export default BlogService;
