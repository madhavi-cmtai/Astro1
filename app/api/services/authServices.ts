import { db } from "../config/firebase";
import jwt from "jsonwebtoken";
import consoleManager from "../utils/consoleManager";

const SECRET_KEY = "12"; // Change this to a proper secret key

class AuthService {
    static async loginUser(email: string, password: string) {
        try {
            consoleManager.log("🔍 Checking user:", email);

            // Fetch user from Firestore
            const userSnapshot = await db.collection("users").where("email", "==", email).get();

            if (userSnapshot.empty) {
                throw new Error("User not found. Please check your email.");
            }

            const userDoc = userSnapshot.docs[0];
            const userData = userDoc.data();

            // Simple password comparison (NOT recommended for production)
            if (password !== userData.password) {
                throw new Error("Incorrect password. Please try again.");
            }

            // Generate JWT token
            const token = jwt.sign({ uid: userDoc.id, email: userData.email }, SECRET_KEY, { expiresIn: "7d" });

            consoleManager.log("✅ User logged in successfully:", userDoc.id);
            return { token, uid: userDoc.id, email: userData.email };

        } catch (error: any) {
            consoleManager.error("❌ Error logging in user:", error.message);
            throw new Error("Login failed. Please check your credentials.");
        }
    }
}

    export default AuthService;
