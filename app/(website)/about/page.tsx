import About from "./about";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us - Travelink County",
  description: "About us and our services.",
};

export default function AboutPage() {
    return <About />;
}

