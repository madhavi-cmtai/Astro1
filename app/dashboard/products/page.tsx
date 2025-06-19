"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
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
import {
  Loader2,
  Plus,
  Edit,
  Trash2,
  Search,
  ImageOff,
} from "lucide-react";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProducts,
  selectProducts,
  selectError,
  selectLoading,
  updateProduct,
  deleteProduct as deleteProductAction,
  addProduct,
  Product,
} from "@/lib/redux/features/productSlice";
import { AppDispatch } from "@/lib/redux/store";

export default function ProductsPage() {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectProducts);
  const error = useSelector(selectError);
  const loading = useSelector(selectLoading);

  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    size: "",
    benefits: "",
    category: "",
  });
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteProduct, setDeleteProduct] = useState<Product | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(search.toLowerCase()) ||
        product.description.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        categoryFilter === "all" || product.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, categoryFilter]);

  const openAddModal = () => {
    setEditProduct(null);
    setForm({
      name: "",
      description: "",
      price: "",
      image: "",
      size: "",
      benefits: "",
      category: "",
    });
    setImageFile(null);
    setImagePreview(null);
    setModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditProduct(product);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      image: product.image,
      size: product.size || "",
      benefits: product.benefits || "",
      category: product.category || "",
    });
    setImagePreview(product.image || null);
    setModalOpen(true);
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
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("description", form.description);
    formData.append("price", form.price);
    formData.append("size", form.size);
    formData.append("benefits", form.benefits);
    formData.append("category", form.category);
    if (imageFile) formData.append("image", imageFile);

    try {
      if (editProduct) {
        await dispatch(updateProduct({ id: editProduct.id, product: formData }));
        toast.success("Product updated!");
      } else {
        await dispatch(addProduct(formData));
        toast.success("Product added!");
      }
      setModalOpen(false);
    } catch {
      toast.error(editProduct ? "Failed to update product" : "Failed to add product");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteProduct) return;
    try {
      await dispatch(deleteProductAction({ id: deleteProduct.id }));
      toast.success("Product deleted!");
    } catch {
      toast.error("Failed to delete product");
    } finally {
      setDeleteProduct(null);
    }
  };

  return (
    <div className="p-4 flex flex-col gap-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-[#e63946]">Products</h2>
        <div className="flex flex-wrap gap-2 w-full sm:w-auto items-center">
          <div className="relative w-full sm:w-72">
            <Input
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          </div>

          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="text-sm border px-3 py-2 rounded-md bg-white"
          >
            <option value="all">All Categories</option>
            {[...new Set(products.map((p) => p.category))].filter(Boolean).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>

          <Button onClick={openAddModal} className="gap-2">
            <Plus className="w-4 h-4" /> Add Product
          </Button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-500 py-12">No products found.</div>
        ) : (
          filteredProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md border p-4 flex flex-col"
              style={{
                boxShadow: "0 4px 12px var(--primary-green, rgba(0, 128, 0, 0.2))",
              }}
            >
              <div className="h-32 bg-gray-100 flex items-center justify-center rounded-md overflow-hidden">
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <ImageOff className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div className="mt-4 flex-1 space-y-1">
                <div className="font-semibold text-lg">{product.name}</div>
                <div className="text-sm text-gray-600 line-clamp-2">{product.description}</div>
                {product.size && <div className="text-sm text-gray-500">Size: {product.size}</div>}
                {product.benefits && (
                  <div className="text-sm text-gray-500 line-clamp-2">Benefits: {product.benefits}</div>
                )}
                {product.category && (
                  <div className="text-xs text-gray-400 italic">Category: {product.category}</div>
                )}
                <div className="text-sm text-green-600 mt-1">₹{product.price}</div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button size="sm" variant="ghost" onClick={() => openEditModal(product)}>
                  <Edit className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setDeleteProduct(product)}
                  className="text-destructive"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </Button>
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
              <DialogTitle>{editProduct ? "Edit Product" : "Add Product"}</DialogTitle>
            </DialogHeader>
            <Input
              placeholder="Name"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
            />
            <Input
              placeholder="Description"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              required
            />
            <Input
              type="number"
              placeholder="Price (₹)"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
            />
            <Input
              placeholder="Size (optional)"
              value={form.size}
              onChange={(e) => setForm((f) => ({ ...f, size: e.target.value }))}
            />
            <Input
              placeholder="Benefits (optional)"
              value={form.benefits}
              onChange={(e) => setForm((f) => ({ ...f, benefits: e.target.value }))}
            />
            <select
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              required
              className="w-full border rounded-md px-3 py-2 text-sm text-gray-700"
            >
              <option value="">Select Category</option>
              <option value="Crystals">Crystals</option>
              <option value="Rudraksh">Rudraksh</option>
              <option value="Candles">Candles</option>
              <option value="Oil & sprays">Oil & sprays</option>
              <option value="Other items">Other items</option>
            </select>

            <div className="flex flex-col gap-2">
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleImageChange}
                className="block w-full text-sm text-gray-500 file:py-2 file:px-4 file:bg-[#e63946]/10 file:text-[#e63946] file:rounded-md"
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="w-4 h-4 animate-spin" />}
                {editProduct ? "Update" : "Add"}
              </Button>
              <DialogClose asChild>
                <Button type="button" variant="ghost">Cancel</Button>
              </DialogClose>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={!!deleteProduct} onOpenChange={(open) => !open && setDeleteProduct(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Product</DialogTitle>
          </DialogHeader>
          <p>
            Are you sure you want to delete{" "}
            <span className="font-semibold text-[#e63946]">{deleteProduct?.name}</span>? This action cannot be undone.
          </p>
          <DialogFooter>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={loading}
              className="gap-2"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />} Delete
            </Button>
            <DialogClose asChild>
              <Button type="button" variant="ghost">Cancel</Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
