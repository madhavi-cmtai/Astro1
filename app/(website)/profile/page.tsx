import Profile from "./profile";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "My Profile - Travelink County",
  description: "My Profile of our services and packages.",
};

export default function ProfilePage() {
    return <Profile />;
}