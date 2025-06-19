"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

type Rashifal = {
    id: string;
    title: string;
    description: string;
};

export default function RashifalDashboard() {
    const [rashifals, setRashifals] = useState<Rashifal[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState<{ [id: string]: string }>({});

    useEffect(() => {
        const fetchRashifals = async () => {
            try {
                const res = await axios.get("/api/routes/rashifal");
                setRashifals(res.data);
                const initialForm = res.data.reduce((acc: any, curr: Rashifal) => {
                    acc[curr.id] = curr.description || "";
                    return acc;
                }, {});
                setFormData(initialForm);
            } catch (error) {
                console.error("Failed to fetch rashifals", error);
            } finally {
                setLoading(false);
            }
        };
        fetchRashifals();
    }, []);

    const handleChange = (id: string, value: string) => {
        setFormData((prev) => ({ ...prev, [id]: value }));
    };

    const handleSave = async (id: string) => {
        setSaving(true);
        try {
            await axios.put(`/api/routes/rashifal/${id}`, {
                description: formData[id],
            });
        } catch (error) {
            console.error("Failed to update rashifal", error);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <Loader2 className="animate-spin w-6 h-6 text-green-600" />
                <span className="ml-2">Loading Rashifals...</span>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-6 text-center text-[var(--primary-red)]">
                Rashifal 
            </h1>
            <div className="grid grid-cols-1 gap-6">
                {rashifals.map((rashi) => (
                    <div
                        key={rashi.id}
                        className="border border-gray-300 rounded-xl shadow-md p-6 bg-white"
                    >
                        <h2 className="text-xl font-semibold mb-2 text-[var(--primary-red)]">
                            {rashi.title}
                        </h2>
                        <Textarea
                            className="w-full min-h-[120px] mb-4"
                            value={formData[rashi.id]}
                            onChange={(e) => handleChange(rashi.id, e.target.value)}
                        />
                        <Button
                            onClick={() => handleSave(rashi.id)}
                            disabled={saving}
                            className="bg-[var(--primary-red)] text-white hover:bg-green-700"
                        >
                            {saving ? "Saving..." : "Save Description"}
                        </Button>
                    </div>
                ))}
            </div>
        </div>
    );
}
