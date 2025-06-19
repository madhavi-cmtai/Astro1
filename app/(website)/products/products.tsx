"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import {
  fetchProducts,
  selectFilteredProducts,
  selectLoading,
  selectError,
  setSelectedCategory,
  selectSelectedCategory,
} from "@/lib/redux/features/productSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const whatsappNumber = "+919871776559";
const PREDEFINED_CATEGORIES = ["All", "Crystals", "Rudraksh", "Candles", "Oil & sprays", "Other items"];

const ProductsPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const products = useSelector(selectFilteredProducts);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const selectedCategory = useSelector(selectSelectedCategory);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  const handleCategoryChange = (category: string) => {
    dispatch(setSelectedCategory(category === "All" ? null : category));
  };

  const renderProductCard = (product: any) => (
    <Card
      key={product.id}
      className="overflow-hidden rounded-xl shadow-[0_4px_12px_0_var(--primary-green)] border border-[var(--primary-green)] flex flex-col bg-white/95 hover:shadow-[0_6px_20px_0_var(--primary-green)] transition"
    >
      <div className="relative w-full h-[17rem] bg-white -mt-7 -mb-7">
        <Image
          src={product.image || "/images/product-placeholder.jpg"}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <CardHeader className="p-0 mb-1">
          <CardTitle className="text-xl font-bold text-[var(--primary-red)] flex flex-col gap-1">
            {product.name}
            <span className="text-lg font-extrabold text-[#73CDA7]">₹{product.price} </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col justify-between flex-grow p-0">
          <p className="text-gray-700 font-medium text-[15px] mb-2 line-clamp-3">
            {product.description}
          </p>

          {product.size && (
            <p className="text-sm text-gray-600 mb-1">
              <strong>Size:</strong> {product.size}
            </p>
          )}
          {product.benefits && (
            <p className="text-sm text-gray-600 mb-1">
              <strong>Benefits:</strong> {product.benefits}
            </p>
          )}
          {product.category && (
            <p className="text-sm text-gray-600 mb-4">
              <strong>Category:</strong> {product.category}
            </p>
          )}

          <a
            href={`https://wa.me/${whatsappNumber}?text=Hi, I'm interested in buying the "${encodeURIComponent(
              product.name
            )}" (${product.category || 'Product'}).`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block text-center bg-[var(--primary-red)] hover:bg-[#FE1D37] text-white font-bold py-2 px-4 rounded-xl transition"
          >
            Buy Now
          </a>
        </CardContent>
      </div>
    </Card>
  );
  

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
      {/* Hero Banner */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0">
          <Image
            src="/images/product-banner.JPG"
            alt="Tarot products banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[var(--primary-gold)]">Products</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Explore our most-loved tarot readings. Handpicked spreads, powerful insights, and guidance you'll never
            forget!
          </p>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto px-4 mb-8">
        <div className="flex flex-wrap justify-center gap-4">
          {PREDEFINED_CATEGORIES.map((category) => {
            const isActive =
              (selectedCategory === null && category === "All") || selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full font-semibold text-sm border transition ${isActive
                    ? "bg-[var(--primary-red)] text-white border-[var(--primary-red)]"
                    : "border-gray-300 text-gray-600 hover:bg-gray-100"
                  }`}
              >
                {category}
              </button>
            );
          })}
        </div>
      </div>

      {/* Product Grid */}
      <section className="container mx-auto px-4 pb-20">
        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchProducts())}
              className="px-4 py-2 bg-[var(--primary-red)] text-white rounded hover:bg-[var(--primary-red-dark)] transition"
            >
              Try Again
            </button>
          </div>
        ) : loading ? (
          <p className="text-center text-gray-500 py-10">Loading products...</p>
        ) : products.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No products available for this category</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map(renderProductCard)}
          </div>
        )}
      </section>
    </div>
  );
};

export default ProductsPage;
