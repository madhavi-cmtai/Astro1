import Testimonials from "./testimonials";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Testimonials",
  description: "All the testimonials from our happy customers.",
};

export default function TestimonialsPage() {
  return <Testimonials />;
}