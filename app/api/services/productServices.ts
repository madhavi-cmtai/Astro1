import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class ProductService {
    static products: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initProducts() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for products...");
        const productsCollection = db.collection("products");

        productsCollection.onSnapshot((snapshot: any) => {
            this.products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Products updated, count:", this.products.length);
        });

        this.isInitialized = true;
    }

    // Get all products (Uses cache unless forceRefresh is true)
    static async getAllProducts(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing products from Firestore...");
            const snapshot = await db.collection("products").orderBy("createdOn", "desc").get();
            this.products = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached products. No Firestore read.");
        }
        return this.products;
    }

    // Add a new product with createdOn timestamp
    static async addProduct(productData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newProductRef = await db.collection("products").add({
                ...productData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New product added with ID:", newProductRef.id);

            // Force refresh the cache after adding a new product
            await this.getAllProducts(true);

            return { id: newProductRef.id, ...productData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding product:", error);
            throw new Error("Failed to add product");
        }
    }

    // Get product by ID (fetches from cache first)
    static async getProductById(productId: string) {
        try {
            // Check if product exists in cache
            const cachedProduct = this.products.find((p: any) => p.id === productId);
            if (cachedProduct) {
                consoleManager.log("✅ Product fetched from cache:", productId);
                return cachedProduct;
            }

            // Fetch from Firestore if not in cache
            const productRef = db.collection("products").doc(productId);
            const doc = await productRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ Product not found:", productId);
                return null;
            }

            consoleManager.log("✅ Product fetched from Firestore:", productId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching product by ID:", error);
            throw new Error("Failed to fetch product");
        }
    }

    // Update product with updatedOn timestamp
    static async updateProduct(productId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const productRef = db.collection("products").doc(productId);
            await productRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ Product updated:", productId);

            // Force refresh the cache after updating a product
            await this.getAllProducts(true);

            return { id: productId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating product:", error);
            throw new Error("Failed to update product");
        }
    }

    // Delete product
    static async deleteProduct(productId: string) {
        try {
            await db.collection("products").doc(productId).delete();
            consoleManager.log("✅ Product deleted:", productId);

            // Force refresh the cache after deleting a product
            await this.getAllProducts(true);

            return { success: true, message: "Product deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting product:", error);
            throw new Error("Failed to delete product");
        }
    }
}

export default ProductService;
