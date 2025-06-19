"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "@/lib/redux/store";
import { fetchBlogs, selectBlogs, selectLoading } from "@/lib/redux/features/blogSlice";
import { titleToSlug } from "@/lib/redux/features/blogSlice";
import { FileText, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

const BlogsSection = () => {
    const dispatch = useDispatch<AppDispatch>();
    const blogs = useSelector(selectBlogs);
    const loading = useSelector(selectLoading);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const latestBlogs = Array.isArray(blogs) ? blogs.slice(0, 3) : [];

    return (
        <section
            className="relative py-20 px-6 bg-gradient-to-br from-white via-white to-[var(--primary-green)] rounded-xl shadow-ms mx-auto w-full max-w-7xl overflow-hidden mt-15"
            style={{ fontFamily: "var(--font-main)" }}
        >
            {/* Glow Orbs */}
            <motion.div
                className="absolute w-28 h-28 bg-[var(--primary-red)] rounded-full blur-2xl opacity-20 top-6 left-6 z-0"
                animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 6, repeat: Infinity }}
            />
            <motion.div
                className="absolute w-24 h-24 bg-[var(--primary-gold)] rounded-full blur-2xl opacity-20 bottom-6 right-6 z-0"
                animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
                transition={{ duration: 7, repeat: Infinity }}
            />

            <div className="relative z-10 max-w-7xl mx-auto text-center mb-12">
                <h2 className="text-4xl sm:text-5xl font-extrabold text-[var(--primary-red)] to-[var(--primary-gold)] mb-4">
                    Latest Blogs
                </h2>
                <p className="text-lg text-[#73CDA7] max-w-3xl mx-auto">
                    Discover insights, spiritual wisdom, and tips to guide your journey.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-40">
                    <Loader2 className="w-6 h-6 animate-spin text-[var(--primary-red)]" />
                </div>
            ) : latestBlogs.length === 0 ? (
                <div className="text-center text-gray-500">No blogs available.</div>
            ) : (
                <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                            {latestBlogs.map((blog) => (
                                <div
                                    key={blog.id}
                                    className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition group"
                                    style={{ boxShadow: "0 4px 10px var(--primary-green)" }}
                                >
                                    <div className="flex items-center justify-center h-40 bg-gray-100">
                                        {blog.image ? (
                                            <img
                                                src={blog.image}
                                                alt={blog.title}
                                                className="w-full h-40 object-cover rounded-t-xl"
                                            />
                                        ) : (
                                            <FileText className="w-12 h-12 text-[var(--primary-red)]" />
                                        )}
                                    </div>
                                    <div className="p-4" style={{ fontFamily: "var(--font-main)" }}>
                                        <h3 className="text-lg font-bold text-[var(--primary-red)] group-hover:text-black transition-colors duration-300 mb-1">
                                    {blog.title}</h3>
                                        <p className="text-sm text-gray-700 mb-3 line-clamp-3">{blog.summary}</p>
                                        <Link href={`/blogs/${titleToSlug(blog.title)}`}>
                                            <span className="text-[#73CDA7] font-semibold mt-3 inline-block group-hover:underline transition">
                                                Read More →
                                            </span>
                                        </Link>

                                    </div>
                                </div>
                            ))}

                </div>
            )}

            <div className="mt-10 text-center relative z-10">
                <Link href="/blogs">
                    <Button className="text-white bg-[var(--primary-red)] hover:bg-[#d62828] px-6 py-2 rounded-full">
                        View All Blogs
                    </Button>
                </Link>
            </div>
        </section>
    );
};

export default BlogsSection;
