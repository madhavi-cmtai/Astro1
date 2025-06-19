"use client";

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchBlogById,
    selectBlog,
    selectLoading,
    selectError,
} from "@/lib/redux/features/blogSlice";
import { AppDispatch } from "@/lib/redux/store";
import { useParams, useRouter } from "next/navigation";

export default function BlogDetailPage() {
    const { id } = useParams();
    const dispatch = useDispatch<AppDispatch>();
    const router = useRouter();

    const blog = useSelector(selectBlog);
    const loading = useSelector(selectLoading);
    const error = useSelector(selectError);

    useEffect(() => {
        if (id && typeof id === "string") {
            dispatch(fetchBlogById(id));
        }
    }, [dispatch, id]);

    const handleBack = () => {
        router.push("/blogs");
    };

    if (loading) {
        return <p className="text-center py-10 text-gray-600">Loading blog...</p>;
    }

    if (error || !blog) {
        return (
            <div className="text-center py-10">
                <h1 className="text-2xl font-bold text-red-500">
                    Blog not found or failed to load
                </h1>
                <button
                    onClick={handleBack}
                    className="mt-4 px-4 py-2 bg-[var(--primary-red)] text-white rounded hover:bg-[var(--primary-red-dark)] transition"
                >
                    ← Back to Blogs
                </button>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <button
                onClick={handleBack}
                className="mb-6 px-4 py-2 bg-[var(--primary-red)] text-white rounded hover:bg-[#CD0909] transition"
            >
                ← Back to Blogs
            </button>

            <h1 className="text-4xl font-bold mb-4 text-[var(--primary-red)]">{blog.title}</h1>

            {blog.image && (
                <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-auto mb-6 rounded-lg border"
                />
            )}

            <p className="text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.summary}
            </p>
        </div>
    );
}
