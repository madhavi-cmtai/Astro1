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

// Your exact custom Rashi order:
const rashiOrder = [
    "Mesh (Aries)", "Vrishabh (Taurus)", "Mithun (Gemini)", "Kark (Cancer)",
    "Singh (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischik (Scorpio)",
    "Dhanu (Sagittarius)", "Makar (Capricorn)", "Kumbh (Aquarius)", "Meen (Pisces)"

];

export default function RashifalDashboard() {
    const [rashifals, setRashifals] = useState<Rashifal[]>([]);
    const [loading, setLoading] = useState(true);
    const [savingId, setSavingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ [id: string]: string }>({});
    const [editMode, setEditMode] = useState<{ [id: string]: boolean }>({});

    useEffect(() => {
        const fetchRashifals = async () => {
            try {
                const res = await axios.get("/api/routes/rashifal");

                // Sort rashifals based on custom rashiOrder
                const sorted = [...res.data].sort((a: Rashifal, b: Rashifal) => {
                    return rashiOrder.indexOf(a.title) - rashiOrder.indexOf(b.title);
                });

                setRashifals(sorted);

                const initialForm = sorted.reduce((acc: any, curr: Rashifal) => {
                    acc[curr.id] = curr.description || "";
                    return acc;
                }, {});

                const initialEdit = sorted.reduce((acc: any, curr: Rashifal) => {
                    acc[curr.id] = false;
                    return acc;
                }, {});

                setFormData(initialForm);
                setEditMode(initialEdit);
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

    const handleEdit = (id: string) => {
        setEditMode((prev) => ({ ...prev, [id]: true }));
    };

    const handleSave = async (id: string) => {
        if (!editMode[id]) return;
        setSavingId(id);
        try {
            await axios.put(`/api/routes/rashifal/${id}`, {
                description: formData[id],
            });
            setEditMode((prev) => ({ ...prev, [id]: false }));
        } catch (error) {
            console.error("Failed to update rashifal", error);
        } finally {
            setSavingId(null);
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
                            disabled={!editMode[rashi.id]}
                            onChange={(e) => handleChange(rashi.id, e.target.value)}
                        />
                        <div className="flex gap-3">
                            <Button
                                onClick={() => handleEdit(rashi.id)}
                                className="bg-[#1e201f] text-white hover:bg-[#585D59]"
                            >
                                Edit
                            </Button>
                            <Button
                                onClick={() => handleSave(rashi.id)}
                                disabled={!editMode[rashi.id] || savingId === rashi.id}
                                className="bg-[var(--primary-red)] text-white hover:bg-red-700"
                            >
                                {savingId === rashi.id ? "Saving..." : "Save"}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
