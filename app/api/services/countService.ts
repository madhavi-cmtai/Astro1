import { db } from "../config/firebase";
import consoleManager from "../utils/consoleManager";

class CountService {
  static counts: { [key: string]: number } = {
    leads: 0,
    portfolios: 0,
    testimonials: 0,
    services: 0,
    brands: 0,
  };
  static isInitialized = false;

  static async initCounts() {
    if (this.isInitialized) return;

    const collections = ["leads", "portfolios", "testimonials", "services", "brands"];

    for (let collectionName of collections) {
      try {
        const snapshot = await db.collection(collectionName).get();
        this.counts[collectionName] = snapshot.size; // ✅ `snapshot.size` se count milta hai
      } catch (error: any) {
        consoleManager.error(`❌ Error getting count for ${collectionName}:`, error.message);
        this.counts[collectionName] = 0;
      }
    }

    this.isInitialized = true;
  }

  static getCounts() {
    consoleManager.log("Returning cached counts");
    return this.counts;
  }

  static async refreshCounts() {
    this.isInitialized = false;
    await this.initCounts();
    return this.counts;
  }
}

export default CountService;
