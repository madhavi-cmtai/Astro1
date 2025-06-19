"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { titleToSlug } from "@/lib/redux/features/blogSlice";
import { AppDispatch } from "@/lib/redux/store";
import { Blog, fetchBlogByTitle } from "@/lib/redux/features/blogSlice";

interface PopularPost {
  id: string;
  title: string;
  excerpt: string;
  imageUrl: string;
}

export default function BlogList() {
  const dispatch = useDispatch<AppDispatch>();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [popularPosts, setPopularPosts] = useState<PopularPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/routes/blogs");
        if (!res.ok) throw new Error("Failed to fetch blogs");

        const result = await res.json();
        const normalizedBlogs: Blog[] = result.data.map((item: any) => ({
          id: item.id,
          title: Array.isArray(item.title) ? item.title[0] : item.title,
          summary: Array.isArray(item.summary) ? item.summary[0] : item.summary,
          image: item.image || "",
        }));

        setBlogs(normalizedBlogs);
      } catch (error) {
        setError("Failed to load blogs. Please try again later.");
        toast.error("Failed to load blogs");
      } finally {
        setLoading(false);
      }
    };

    const fetchPopularPosts = async () => {
      try {
        const res = await fetch("/api/routes/blogs?limit=6");
        if (!res.ok) throw new Error("Failed to fetch popular posts");

        const result = await res.json();
        const latest: PopularPost[] = result.data.slice(0, 6).map((item: any) => ({
          id: item.id,
          title: Array.isArray(item.title) ? item.title[0] : item.title,
          excerpt: Array.isArray(item.summary) ? item.summary[0] : item.summary,
          imageUrl: item.image || "/images/default.jpg",
        }));

        setPopularPosts(latest);
      } catch (error) {
        toast.error("Failed to load popular posts");
      }
    };

    fetchBlogs();
    fetchPopularPosts();
  }, []);

  return (
    <div className="min-h-screen bg-white" style={{ fontFamily: "var(--font-main)" }}>
      {/* Hero */}
      <div className="relative min-h-[340px] md:min-h-[420px] flex flex-col items-center justify-center text-white text-center overflow-hidden mb-12">
        <div className="absolute inset-0">
          <Image
            src="/images/blog-banner.png"
            alt="Blog banner"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/50" />
        </div>
        <div className="relative z-10 px-4">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 drop-shadow-lg tracking-tight leading-tight">
            Our <span className="text-[var(--primary-gold)]">Blogs</span>
          </h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto font-semibold drop-shadow-lg mt-2">
            Step into the mystical world of <span className="font-bold">Card Readings</span> where every card drawn is a message from the universe just for you.
          </p>
        </div>
      </div>

      {/* Blogs */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-10">🃏 Blogs</h2>

        {error ? (
          <div className="text-center py-10">
            <p className="text-red-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[var(--primary-red)] text-white rounded hover:bg-[var(--primary-red-dark)] transition"
            >
              Retry
            </button>
          </div>
        ) : loading ? (
          <p className="text-center text-gray-500 py-10">Loading blogs...</p>
        ) : blogs.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">No blogs found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogs.map((blog) => (
              <Link
                key={blog.id}
                href={`/blogs/${titleToSlug(blog.title)}`}
                className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition group block"
                style={{ boxShadow: "0 4px 10px var(--primary-green)" }}
              >
                <div className="relative w-full h-48">
                  {blog.image ? (
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                      No Image Available
                    </div>
                  )}
                </div>

                <div className="p-4">
                  <h2 className="text-xl font-bold text-[var(--primary-red)] group-hover:text-[var(--primary-red-dark)] transition">
                    {blog.title}
                  </h2>
                  <p className="text-sm mt-2 text-gray-600 line-clamp-2">{blog.summary}</p>
                  <span className="text-[#73CDA7] font-semibold mt-3 inline-block group-hover:underline transition">
                    Read More →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Popular Posts */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-3xl font-bold text-center text-[var(--primary-red)] mb-10">🔥 Popular Posts</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blogs/${titleToSlug(post.title)}`}
              className="rounded-xl shadow-md overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition group block"
              style={{ boxShadow: "0 4px 10px var(--primary-green)" }}
            >
              <div className="relative w-full h-48">
                <Image
                  src={post.imageUrl}
                  alt={post.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              <div className="p-4">
                <h2 className="text-xl font-bold text-[var(--primary-red)] group-hover:text-[var(--primary-red-dark)] transition">
                  {post.title}
                </h2>
                <p className="text-sm mt-2 text-gray-600 line-clamp-2">{post.excerpt}</p>
                <span className="text-[#73CDA7] font-semibold mt-3 inline-block group-hover:underline transition">
                  Read More →
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
