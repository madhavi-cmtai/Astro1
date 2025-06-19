import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";
import admin from "firebase-admin";

class UserService {
    static users: any[] = [];
    static isInitialized = false;

    // Initialize Firestore real-time listener (runs once)
    static initUsers() {
        if (this.isInitialized) return;

        consoleManager.log("Initializing Firestore listener for users...");
        const usersCollection = db.collection("users");

        usersCollection.onSnapshot((snapshot: any) => {
            this.users = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            consoleManager.log("🔥 Firestore Read: Users updated, count:", this.users.length);
        });

        this.isInitialized = true;
    }

    // Get all users (Uses cache unless forceRefresh is true)
    static async getAllUsers(forceRefresh = false) {
        if (forceRefresh || !this.isInitialized) {
            consoleManager.log("Force refreshing users from Firestore...");
            const snapshot = await db.collection("users").orderBy("createdOn", "desc").get();
            this.users = snapshot.docs.map((doc: any) => ({ id: doc.id, ...doc.data() }));
            this.isInitialized = true;
        } else {
            consoleManager.log("Returning cached users. No Firestore read.");
        }
        return this.users;
    }

    // Get all active users (Uses cache unless forceRefresh is true)
    static async getActiveUsers(forceRefresh = false) {
        // Fetch all users (either from cache or Firestore)
        const allUsers = await this.getAllUsers(forceRefresh);

        // Filter users where status is 'active'
        const activeUsers = allUsers.filter((user: any) => user.status === "approved");

        consoleManager.log("Returning active users. Count:", activeUsers.length);
        return activeUsers;
    }

    // Add a new user with createdOn timestamp
    static async addUser(userData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const newUserRef = await db.collection("users").add({
                ...userData,
                createdOn: timestamp,
            });

            consoleManager.log("✅ New user added with ID:", newUserRef.id);

            // Force refresh the cache after adding a user
            await this.getAllUsers(true);

            return { id: newUserRef.id, ...userData, createdOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error adding user:", error);
            throw new Error("Failed to add user");
        }
    }

    // Get user by ID (fetches from cache first)
    static async getUserById(userId: string) {
        try {
            // Check if user exists in cache
            const cachedUser = this.users.find((u: any) => u.id === userId);
            if (cachedUser) {
                consoleManager.log("✅ User fetched from cache:", userId);
                return cachedUser;
            }

            // Fetch from Firestore if not in cache
            const userRef = db.collection("users").doc(userId);
            const doc = await userRef.get();

            if (!doc.exists) {
                consoleManager.warn("⚠️ User not found:", userId);
                return null;
            }

            consoleManager.log("✅ User fetched from Firestore:", userId);
            return { id: doc.id, ...doc.data() };
        } catch (error) {
            consoleManager.error("❌ Error fetching user by ID:", error);
            throw new Error("Failed to fetch user");
        }
    }

    // Update user with updatedOn timestamp
    static async updateUser(userId: string, updatedData: any) {
        try {
            const timestamp = admin.firestore.FieldValue.serverTimestamp();
            const userRef = db.collection("users").doc(userId);
            await userRef.update({
                ...updatedData,
                updatedOn: timestamp,
            });

            consoleManager.log("✅ User updated:", userId);

            // Force refresh the cache after updating a user
            await this.getAllUsers(true);

            return { id: userId, ...updatedData, updatedOn: timestamp };
        } catch (error) {
            consoleManager.error("❌ Error updating user:", error);
            throw new Error("Failed to update user");
        }
    }

    // Delete user
    static async deleteUser(userId: string) {
        try {
            await db.collection("users").doc(userId).delete();
            consoleManager.log("✅ User deleted:", userId);

            // Force refresh the cache after deleting a user
            await this.getAllUsers(true);

            return { success: true, message: "User deleted successfully" };
        } catch (error) {
            consoleManager.error("❌ Error deleting user:", error);
            throw new Error("Failed to delete user");
        }
    }
}

export default UserService;
