import Packages from "./products";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Packages - Travelink County",
  description: "Packages of our services and packages.",
};

export default function PackagesPage() {
    return <Packages />;
}

