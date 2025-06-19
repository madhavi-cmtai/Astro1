"use client";

import React, { useState, useEffect, useMemo, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Loader2, Plus, Edit, Trash2, Search } from "lucide-react";
import { toast } from "sonner";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchTestimonials,
  selectTestimonials,
  selectError,
  selectLoading,
  deleteTestimonial,
  addTestimonial,
  updateTestimonial,
} from "@/lib/redux/features/testimonialSlice";
import { AppDispatch } from "@/lib/redux/store";

interface TestimonialItem {
  id: string;
  name: string;
  description: string;
  media: string;
  mediaType: "image" | "video" | "no-media" | null;
  rating: number;
  spread: string;
  status: "active" | "inactive";
  createdOn: {
    _seconds: number;
    _nanoseconds: number;
  };
  updatedOn: {
    _seconds: number;
    _nanoseconds: number;
  };
}

export default function TestimonialPage() {
  const dispatch = useDispatch<AppDispatch>();
  const testimonialItems = useSelector(selectTestimonials);
  const error = useSelector(selectError);
  const isLoading = useSelector(selectLoading);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItem, setEditItem] = useState<TestimonialItem | null>(null);
  const [deleteItem, setDeleteItem] = useState<any>(null);
  const [mediaType, setMediaType] = useState<"image" | "video" | "no-media" | "">("");
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({ name: "", description: "", media: "", spread: "", rating: 0, status: "active" });
  useEffect(() => {
    dispatch(fetchTestimonials());
  }, []);

  const fetchDataWithRetry = async (retryCount = 0, delay = 1000) => {
    try {
      await dispatch(fetchTestimonials()).unwrap();
    } catch (err: any) {
      if (retryCount < 3) {
        toast.warning(`Retrying... (Attempt ${retryCount + 1}/3)`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return fetchDataWithRetry(retryCount + 1, delay * 2);
      } else {
        toast.error('Failed to load testimonials after multiple attempts. Please try again later.');
      }
    }
  };

  useEffect(() => {
    if (!isLoading) {
      fetchDataWithRetry();
    }
  }, [dispatch]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchDataWithRetry();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (mediaPreview) {
        URL.revokeObjectURL(mediaPreview);
      }
    };
  }, [mediaPreview]);

  const filteredItems = useMemo(
    () =>
      (Array.isArray(testimonialItems) ? testimonialItems : []).filter((item) =>
        (item.name ?? "").toLowerCase().includes((search ?? "").toLowerCase())
      ), [testimonialItems, search]
  );

  const openAddModal = () => {
    setEditItem(null);
    setForm({ name: "", description: "", media: "", spread: "", rating: 0, status: "active" });
    setMediaFile(null);
    setMediaPreview(null);
    setMediaType("");
    setModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setEditItem(item);
    setForm({
      name: item.name,
      description: item.description || "",
      media: item.media,
      spread: item.spread,
      rating: item.rating,
      status: item.status,
    });

    if (item.media?.match(/\.(jpeg|jpg|png|gif|webp)$/i)) {
      setMediaType("image");
    } else if (item.media?.match(/\.(mp4|webm|ogg)$/i)) {
      setMediaType("video");
    } else {
      setMediaType("no-media");
    }
    setMediaPreview(item.media || null);
    setModalOpen(true);
  };

  const handleDelete = async () => {
    if (!deleteItem?.id) return toast.error("Invalid testimonial ID.");
    setLoading(true);
    try {
      await dispatch(deleteTestimonial(deleteItem.id)).unwrap();
      toast.success("Deleted!");
    } catch {
      toast.error("Failed to delete.");
    }
    setLoading(false);
    setDeleteItem(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const formData = new FormData();
      const { name, description, spread, rating, status } = form;

      if (!name || !mediaType) {
        toast.error("Please fill all required fields.");
        setLoading(false);
        return;
      }

      formData.append("name", name);
      formData.append("status", status);
      if (!mediaType) {
        toast.error("Please select a media type.");
        setLoading(false);
        return;
      }

      try {
        if (mediaType === "image") {
          if (!editItem && !mediaFile) {
            toast.error("Please upload an image.");
            setLoading(false);
            return;
          }
          if (!description.trim()) {
            toast.error("Description is required for image testimonials.");
            setLoading(false);
            return;
          }
          if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            toast.error("Please provide a valid rating (0-5).");
            setLoading(false);
            return;
          }

          if (mediaFile) {
            const validImageTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!validImageTypes.includes(mediaFile.type)) {
              toast.error("Please upload a valid image file (JPEG, PNG, GIF, or WEBP).");
              setLoading(false);
              return;
            }
            formData.append("media", mediaFile);
          }
          formData.append("description", description.trim());
          formData.append("rating", String(rating));
        }

        if (mediaType === "video") {
          // For video type
          if (!editItem && !mediaFile) {
            toast.error("Please upload a video.");
            setLoading(false);
            return;
          }

          if (mediaFile) {
            const validVideoTypes = ['video/mp4', 'video/webm', 'video/ogg'];
            if (!validVideoTypes.includes(mediaFile.type)) {
              toast.error("Please upload a valid video file (MP4, WebM, or OGG).");
              setLoading(false);
              return;
            }
            formData.append("media", mediaFile);
          }
        }
        if (mediaType === "no-media") {
          // For text-only testimonials
          if (!description.trim()) {
            toast.error("Description is required for text testimonials.");
            setLoading(false);
            return;
          }
          if (typeof rating !== 'number' || rating < 0 || rating > 5) {
            toast.error("Please provide a valid rating (0-5).");
            setLoading(false);
            return;
          }
          if (!spread.trim()) {
            toast.error("Spread is required for text testimonials.");
            setLoading(false);
            return;
          }

          formData.append("description", description.trim());
          formData.append("rating", String(rating));
          formData.append("spread", spread.trim());
        }
      } catch (err: any) {
        console.error("Validation error:", err);
        toast.error("Error validating form data. Please try again.");
        setLoading(false);
        return;
      } if (editItem) {
        try {
          formData.append("id", editItem.id);
          formData.append("mediaType", mediaType);

          if (mediaType === "image" && !formData.get("description")) {
            formData.append("description", editItem.description || "");
          }
          if (mediaType === "image" && !formData.get("rating")) {
            formData.append("rating", String(editItem.rating || 0));
          }
          if (mediaType === "no-media" && !formData.get("spread")) {
            formData.append("spread", editItem.spread || "");
          }

          const result = await dispatch(updateTestimonial({ formData, id: editItem.id })).unwrap();
          if (!result) {
            throw new Error("Failed to update testimonial");
          }
          toast.success("Updated successfully!");
        } catch (err: any) {
          toast.error(err.message || "Failed to update testimonial. Please try again.");
          setLoading(false);
          return;
        }
      } else {
        try {
          await dispatch(addTestimonial(formData)).unwrap();
          toast.success("Added successfully!");
        } catch (err: any) {
          toast.error(err.message || "Failed to add testimonial. Please try again.");
          setLoading(false);
          return;
        }
      }
    } catch (err: any) {
      toast.error(err.message || "An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
      setModalOpen(false);
      setEditItem(null);
      setMediaFile(null);
      setMediaPreview(null);
      setMediaType("");
      setForm({
        name: "",
        description: "",
        media: "",
        spread: "",
        rating: 0,
        status: "active",
      });
    }
  };

  const handleMediaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) return toast.error("Max file size is 50MB.");
    const previewURL = URL.createObjectURL(file);
    setMediaFile(file);
    setMediaPreview(previewURL);
  };

  const formatDate = (timestamp: string | { _seconds: number; _nanoseconds: number }) => {
    if (typeof timestamp === 'string') {
      return new Date(timestamp).toLocaleDateString();
    }
    return new Date(timestamp._seconds * 1000).toLocaleDateString();
  };

  const renderMediaPreview = (url: string, type: "image" | "video" | "no-media" | null) => {
    if (!url) return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <span className="text-gray-400">No media</span>
      </div>
    );

    if (type === "image") {
      return (
        <img
          src={url}
          alt="Testimonial"
          className="w-full h-52 object-cover transition-transform group-hover:scale-105 "
        />
      );
    } else if (type === "video") {
      return (
        <video
          src={url}
          controls
          className="w-full h-52 object-cover"
        />
      );
    }

    return (
      <div className="w-full h-full bg-gray-50 flex items-center justify-center">
        <span className="text-gray-400">Unsupported media</span>
      </div>
    );
  };

  return (
    <div className="mx-auto p-0 flex flex-col gap-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-2 mb-1 flex-wrap">
        <h2 className="text-xl font-bold text-[#e63946]" style={{ fontFamily: 'var(--font-main)' }}>
          Testimonials
        </h2>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto items-stretch sm:items-center justify-end">
          <div className="relative w-full sm:w-72">
            <Input placeholder="Search Testimonials..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>
          <Button onClick={openAddModal} className="gap-2 w-full sm:w-auto cursor-pointer" disabled={isLoading} >
            <Plus className="w-4 h-4" /> Add Testimonials
          </Button>
        </div>
      </div>      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md mb-6">
          <div className="flex items-center gap-2">
            <span className="font-medium">Error:</span> {error}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 relative min-h-[200px]">
        {isLoading ? (
          <div className="col-span-full flex items-center justify-center absolute inset-0 bg-white/50 backdrop-blur-[1px]">
            <div className="flex flex-col items-center gap-3 p-4 rounded-lg bg-white shadow-sm border">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-sm text-gray-600">Loading testimonials...</p>
            </div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="col-span-full text-center text-gray-500">
            No testimonials found.
          </div>
        ) : (
          filteredItems.map((item) => (
            <div key={item.id} className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
              style={{
                boxShadow: "0 4px 12px var(--primary-green, rgba(0, 128, 0, 0.2))"
              }}>
              {/* Card Header - Status Badge */}
              <div className="absolute top-4 right-4 z-10">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${item.status === 'active'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-gray-100 text-gray-700'
                  }`}>
                  {item.status}
                </span>
              </div>
              {/* Video Type Card */}
              {item.mediaType === "video" && (
                <>
                  <div className="relative aspect-video">
                    <div className="absolute inset-0">
                      {renderMediaPreview(item.media, item.mediaType)}
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2 mt-3.5">
                      {item.name}
                    </h3>
                  </div>
                </>
              )}
              {/* Image Type Card */}
              {item.mediaType === "image" && (
                <>
                  <div className="relative aspect-video group">
                    <div className="absolute inset-0">
                      {renderMediaPreview(item.media, item.mediaType)}
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-800 mb-1">
                      {item.name}
                    </h3>

                    {item.spread && (
                      <p className="text-sm text-gray-500 italic mb-2">"{item.spread}"</p>
                    )}

                    <div className="flex items-center gap-1 mb-2">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${index < item.rating ? "text-yellow-400" : "text-gray-300"
                            }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    <p className="text-sm text-gray-600">{item.description}</p>
                  </div>
                </>
              )}
              {/* No Media Type Card */}
              {(!item.mediaType || item.mediaType === "no-media") && (
                <div className="p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    {item.name}
                  </h3>
                  {item.spread && (
                    <p className="text-sm text-gray-500 italic mb-2">"{item.spread}"</p>
                  )}
                  <div className="flex items-center gap-1 mb-3">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`w-4 h-4 ${index < item.rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>

                  <p className="text-sm text-gray-600 mb-3">
                    {item.description}
                  </p>
                </div>
              )}
              {/* Card Footer - Common for all types */}
              <div className="px-4 pb-4 mt-auto">
                <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                  <span className="text-xs text-gray-500">
                    {formatDate(item.createdOn)}
                  </span>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => openEditModal(item)}
                      className="hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setDeleteItem(item)}
                      disabled={loading}
                      className="text-red-600 hover:bg-red-50 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}

      </div>
      {/* Add/Edit Modal */}
      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <form onSubmit={handleSubmit} className="space-y-4">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
            </DialogHeader>

            <select
              value={mediaType}
              onChange={(e) => setMediaType(e.target.value as any)}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
            >
              <option value="">-- Choose Media Type --</option>
              <option value="image">Image</option>
              <option value="video">Video</option>
              <option value="no-media">No Media</option>
            </select>

            {mediaType && (
              <>
                <Input
                  placeholder="Name"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  required
                />
                {(mediaType === "image" || mediaType === "no-media") && (
                  <textarea
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                    className="w-full border p-2 rounded"
                    required
                  />
                )}
                {(mediaType === "image" || mediaType === "no-media") && (
                  <Input
                    type="number"
                    min={1}
                    max={5}
                    placeholder="Rating"
                    value={form.rating}
                    onChange={(e) => setForm((f) => ({ ...f, rating: +e.target.value }))}
                    required
                  />
                )}
                {mediaType === "no-media" && (
                  <Input
                    placeholder="Spread"
                    value={form.spread}
                    onChange={(e) => setForm((f) => ({ ...f, spread: e.target.value }))}
                    required
                  />
                )}
                {(mediaType === "image" || mediaType === "video") && (
                  <div>
                    <input
                      type="file"
                      accept={mediaType === "image" ? "image/*" : "video/*"}
                      ref={fileInputRef}
                      onChange={handleMediaChange}
                      className="block w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:border file:rounded file:border-gray-300 file:text-sm file:bg-gray-100 hover:file:bg-gray-200"
                    />
                    {renderMediaPreview(mediaPreview || '', mediaType as "image" | "video" | null)}
                  </div>
                )}
              </>
            )}

            <DialogFooter>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editItem ? "Update" : "Add"}
              </Button>
              <DialogClose asChild>
                <Button variant="ghost" type="button">
                  Cancel
                </Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Modal */}
      <Dialog open={!!deleteItem} onOpenChange={(open) => !open && setDeleteItem(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Testimonial</DialogTitle>
          </DialogHeader>
          <p>Are you sure you want to delete <strong>{deleteItem?.name}</strong>?</p>
          <DialogFooter>
            <Button variant="destructive" onClick={handleDelete} disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />} Delete
            </Button>
            <DialogClose asChild>
              <Button variant="ghost" type="button">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
