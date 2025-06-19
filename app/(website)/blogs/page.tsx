
import Blogs from "./blogs";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Contact Us",
    description: "Contact us for more information about our services.",
};

export default function BlogPage() {
    return <Blogs />;
}