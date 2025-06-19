import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const memberships = [
  {
    name: "Silver",
    price: "₹2,999/year",
    features: [
      "Access to basic packages",
      "Priority email support",
      "Exclusive member newsletter",
    ],
  },
  {
    name: "Gold",
    price: "₹5,999/year",
    features: [
      "All Silver benefits",
      "Early access to new packages",
      "Dedicated travel consultant",
    ],
  },
  {
    name: "Platinum",
    price: "₹9,999/year",
    features: [
      "All Gold benefits",
      "Complimentary airport transfers",
      "Special event invites",
    ],
  },
  {
    name: "Diamond",
    price: "₹14,999/year",
    features: [
      "All Platinum benefits",
      "Personalized itinerary planning",
      "24/7 VIP support",
    ],
  },
];

const Membership = () => {
  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: 'var(--font-main)' }}>
      {/* Hero Section */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0 bg-[url('/images/contact-banner.jpg')] bg-cover bg-center bg-no-repeat" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Membership <span className="text-[#ffc72c]">Plans</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Unlock exclusive benefits and premium experiences with our membership plans. Choose the best for your travel style!
          </p>
        </div>
      </div>

      {/* Memberships Grid */}
      <section className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {memberships.map((m) => (
            <Card key={m.name} className="overflow-hidden shadow-lg border-[#e3061320] flex flex-col">
              <CardHeader>
                <CardTitle className="text-2xl font-bold text-[#e30613] text-center">{m.name}</CardTitle>
                <div className="text-[#1a4d8f] text-xl font-extrabold text-center mt-2">{m.price}</div>
              </CardHeader>
              <CardContent>
                <ul className="text-neutral-700 font-medium space-y-2 mb-4">
                  {m.features.map((f) => (
                    <li key={f} className="flex items-center gap-2">
                      <span className="text-[#ffc72c] text-lg">•</span> {f}
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button className="bg-[#e30613] text-white font-bold px-6 py-2 rounded-full shadow hover:bg-[#ffc72c] hover:text-[#e30613] transition-colors border-2 border-[#e30613] hover:scale-105 active:scale-100 text-base">
                  Join Now
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Membership;