import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

interface CacheEntry {
    data: any[];
    timestamp: number;
    etag: string;
}
interface Blog {
    id: string;
    title: string;
    summary: string;
    image?: string;
    titleLower?: string;
    createdOn?: any;
    updatedOn?: any;
}

class BlogService {
    static blogs: any[] = [];
    private static cache: CacheEntry | null = null;
    private static CACHE_TTL = 30000; // 30 seconds
    private static readonly BATCH_SIZE = 10;

    static async initBlogs() {
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
            const blogsRef = db.collection("blogs").orderBy("createdOn", "desc");

            let allBlogs: any[] = [];
            let lastDoc = null;

            do {
                let query = blogsRef.limit(this.BATCH_SIZE);
                if (lastDoc) {
                    query = query.startAfter(lastDoc);
                }

                const snapshot = await query.get();
                if (snapshot.empty) break;

                const batchDocs = snapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                    _cached: Date.now(),
                }));

                allBlogs = [...allBlogs, ...batchDocs];
                lastDoc = snapshot.docs[snapshot.docs.length - 1];
            } while (lastDoc);

            this.cache = {
                data: allBlogs,
                timestamp: Date.now(),
                etag: `blogs-v1-${Date.now()}`,
            };

            this.blogs = allBlogs; // update in-memory cache
            consoleManager.log(`Blog cache refreshed with ${allBlogs.length} entries`);
        } catch (error) {
            consoleManager.error("Error refreshing blog cache:", error);
            throw new Error("Failed to refresh blogs cache");
        }
    }

    static async getAllBlogs(forceRefresh = false) {
        try {
            if (forceRefresh || this.isCacheStale()) {
                await this.refreshCache();
            }
            return this.cache?.data || [];
        } catch (error) {
            consoleManager.error("Error getting all blogs:", error);
            throw new Error("Failed to fetch blogs");
        }
    }

    static async addBlog(blogData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const normalizedTitle = (blogData.title || "").toLowerCase().replace(/\s+/g, " ").trim();

            const newBlogRef = await db.collection("blogs").add({
                ...blogData,
                titleLower: normalizedTitle,
                createdOn: timestamp,
                updatedOn: timestamp,
            });

            consoleManager.log("New blog added with ID:", newBlogRef.id);
            await this.getAllBlogs(true);

            return { id: newBlogRef.id, ...blogData, titleLower: normalizedTitle, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("Error adding blog:", error);
            throw new Error("Failed to add blog");
        }
    }

    static async getBlogByTitle(title: string) {
        try {
            const normalizedTitle = title.toLowerCase().replace(/\s+/g, " ").trim();

            const cachedBlog = this.blogs.find((b: any) => {
                const blogTitle = (b.title || "").toLowerCase().replace(/\s+/g, " ").trim();
                return blogTitle === normalizedTitle;
            });

            if (cachedBlog) {
                consoleManager.log("Blog fetched from cache by title:", cachedBlog.id);
                return cachedBlog;
            }

            const snapshot = await db
                .collection("blogs")
                .where("titleLower", "==", normalizedTitle)
                .get();

            if (snapshot.empty) {
                consoleManager.warn("No blog found with title:", title);
                return null;
            }

            const doc = snapshot.docs[0];
            consoleManager.log("Blog fetched from Firestore by title:", doc.id);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("Error fetching blog by title:", error);
            throw new Error("Failed to fetch blog by title");
        }
    }

    static async getBlogById(blogId: string) {
        try {
            const docRef = db.collection("blogs").doc(blogId);
            const doc = await docRef.get();

            if (!doc.exists) {
                consoleManager.warn("No blog found with ID:", blogId);
                return null;
            }

            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("Error fetching blog by ID:", error);
            throw new Error("Failed to fetch blog by ID");
        }
    }
    

    static async updateBlog(blogId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const updatePayload: any = {
                ...updatedData,
                updatedOn: timestamp,
            };

            if (updatedData.title) {
                updatePayload.titleLower = updatedData.title.toLowerCase().replace(/\s+/g, " ").trim();
            }

            const blogRef = db.collection("blogs").doc(blogId);
            await blogRef.update(updatePayload);

            consoleManager.log("Blog updated:", blogId);
            await this.getAllBlogs(true);

            return { id: blogId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("Error updating blog:", error);
            throw new Error("Failed to update blog");
        }
    }

    static async deleteBlog(blogId: string) {
        try {
            await db.collection("blogs").doc(blogId).delete();
            consoleManager.log("Blog deleted:", blogId);
            await this.getAllBlogs(true);

            return { success: true, message: "Blog deleted successfully" };
        } catch (error) {
            consoleManager.error("Error deleting blog:", error);
            throw new Error("Failed to delete blog");
        }
    }
}

export default BlogService;
