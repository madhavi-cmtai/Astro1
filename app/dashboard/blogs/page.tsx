"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search, FileText } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import {
    selectBlogs,
    selectError,
    selectLoading,
    updateBlog,
    deleteBlog as deleteBlogAction,
    addBlog,
    Blog,
    fetchBlogs
} from "@/lib/redux/features/blogSlice";
import { AppDispatch } from "@/lib/redux/store";

export default function BlogsPage() {
    const dispatch = useDispatch<AppDispatch>();
    const blogs = useSelector(selectBlogs);
    const error = useSelector(selectError);
    const loading = useSelector(selectLoading);

    const [search, setSearch] = useState("");
    const [modalOpen, setModalOpen] = useState(false);
    const [editBlog, setEditBlog] = useState<Blog | null>(null);
    const [form, setForm] = useState({ title: "", summary: "", image: "" });
    const [deleteBlog, setDeleteBlog] = useState<Blog | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        dispatch(fetchBlogs());
    }, [dispatch]);

    const filteredBlogs = useMemo(() => {
        return (Array.isArray(blogs) ? blogs : []).filter((p) => {
            const title = Array.isArray(p.title) ? p.title[0] : p.title;
            const summary = Array.isArray(p.summary) ? p.summary[0] : p.summary;

            return (
                title?.toLowerCase().includes(search.toLowerCase()) ||
                summary?.toLowerCase().includes(search.toLowerCase())
            );
        });
    }, [blogs, search]);

    const openAddModal = () => {
        setEditBlog(null);
        setForm({ title: "", summary: "", image: "" });
        setImageFile(null);
        setImagePreview(null);
        setModalOpen(true);
    };

    const openEditModal = (blog: Blog) => {
        setEditBlog(blog);
        setForm({
            title: blog.title,
            summary: blog.summary,
            image: blog.image || "",
        });
        setImageFile(null);
        setImagePreview(blog.image || null);
        setModalOpen(true);
    };

    const handleDelete = () => {
        if (!deleteBlog) return;
        setIsDeleting(true);
        setTimeout(() => {
            dispatch(deleteBlogAction(deleteBlog.id || ""));
            setIsDeleting(false);
            setDeleteBlog(null);
            toast.success("Blog deleted!");
        }, 800);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(true);

        try {
            if (editBlog && editBlog.id) {
                await dispatch(updateBlog({
                    id: editBlog.id,
                    title: form.title,
                    summary: form.summary,
                    image: editBlog.image,
                    file: imageFile || undefined,
                }, editBlog.id));
                toast.success("Blog updated!");
            } else {
                const formData = new FormData();
                formData.append("title", form.title);
                formData.append("summary", form.summary);
                if (imageFile) formData.append("image", imageFile);

                await dispatch(addBlog(formData));
                toast.success("Blog added!");
            }

            setModalOpen(false);
            dispatch(fetchBlogs());
        } catch (error) {
            console.error("Error submitting blog:", error);
            toast.error("Failed to save blog.");
        } finally {
            setIsEditing(false);
            setImageFile(null);
            setImagePreview(null);
        }
    };

    return (
        <div className="mx-auto p-0 flex flex-col gap-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
                <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>Blogs</h2>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
                    <div className="flex gap-2 w-full sm:w-auto">
                        <div className="relative w-full sm:w-72">
                            <Input
                                placeholder="Search Blogs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        </div>
                    </div>
                    <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer">
                        <Plus className="w-4 h-4" /> Add Blog
                    </Button>
                </div>
            </div>

            {/* Blog Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredBlogs.length === 0 ? (
                    <div className="col-span-full text-center text-gray-400 py-12">No blogs found.</div>
                ) : loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                    filteredBlogs.map((blog) => (
                        <div key={blog.id} className="bg-white rounded-2xl shadow-md border border-gray-100 flex flex-col overflow-hidden"
                            style={{ boxShadow: "0 4px 12px var(--primary-green, rgba(0, 128, 0, 0.2))" }}>
                            <div className="flex items-center justify-center h-32 bg-gray-100">
                                {blog.image ? (
                                    <img src={blog.image} alt={blog.title} className="w-full h-32 object-cover rounded-lg" />
                                ) : (
                                    <FileText className="w-12 h-12 text-[#e63946]" />
                                )}
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-between">
                                <div>
                                    <div className="text-lg font-bold mb-1" style={{ fontFamily: 'var(--font-main)' }}>{blog.title}</div>
                                    <div className="text-sm text-gray-700 mb-2 line-clamp-2">{blog.summary}</div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Button size="sm" variant="ghost" onClick={() => openEditModal(blog)} className="cursor-pointer">
                                        <Edit className="w-4 h-4 mr-1" /> Edit
                                    </Button>
                                    <Button size="sm" variant="ghost" onClick={() => setDeleteBlog(blog)} className="text-destructive cursor-pointer">
                                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Add/Edit Dialog */}
            <Dialog open={modalOpen} onOpenChange={setModalOpen}>
                <DialogContent>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <DialogHeader>
                            <DialogTitle>{editBlog ? "Edit Blog" : "Add Blog"}</DialogTitle>
                        </DialogHeader>
                        <Input
                            placeholder="Title"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            required
                        />
                        <textarea
                            placeholder="Summary"
                            value={form.summary}
                            onChange={(e) => setForm((f) => ({ ...f, summary: e.target.value }))}
                            required
                            rows={4}
                            className="w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#525150]/30 resize-none"
                        />
                        <div className="flex flex-col gap-2">
                            <label className="block text-sm font-medium">Image</label>
                            {imagePreview && (
                                <img src={imagePreview} alt="Preview" className="w-full h-40 object-cover rounded-lg mb-2 border" />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                ref={fileInputRef}
                                onChange={handleImageChange}
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#e63946]/10 file:text-[#e63946]"
                            />
                        </div>
                        <DialogFooter>
                            <Button type="submit" disabled={isEditing} className="gap-2 cursor-pointer">
                                {isEditing && <Loader2 className="w-4 h-4 animate-spin" />}
                                {editBlog ? "Update" : "Add"}
                            </Button>
                            <DialogClose asChild>
                                <Button type="button" variant="ghost">Cancel</Button>
                            </DialogClose>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={!!deleteBlog} onOpenChange={(open) => !open && setDeleteBlog(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Plan</DialogTitle>
                    </DialogHeader>
                    <div>
                        Are you sure you want to delete <span className="font-semibold text-[#e63946]">{deleteBlog?.title}</span>? This action cannot be undone.
                    </div>
                    <DialogFooter>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="gap-2 cursor-pointer"
                        >
                            {isDeleting && <Loader2 className="w-4 h-4 animate-spin" />} Delete
                        </Button>
                        <DialogClose asChild>
                            <Button type="button" variant="ghost" disabled={isDeleting}>Cancel</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
