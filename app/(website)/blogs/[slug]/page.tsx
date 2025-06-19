import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

type PageProps = {
    params: Promise<{
        slug: string;
    }>;
};

async function getBlogData(slug: string) {
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ;

    const res = await fetch(`${baseUrl}/api/routes/blogs/${slug}`, {
        cache: "no-store",
    });

    if (!res.ok) return null;

    const result = await res.json();
    return result.data;
}

export default async function BlogDetailPage({ params }: PageProps) {
    const resolvedParams = await params;
    const blog = await getBlogData(resolvedParams.slug);

    if (!blog) return notFound();

    return (
        <div className="max-w-3xl mx-auto px-4 py-12" style={{ fontFamily: "var(--font-main)" }}>
            <Link
                href="/blogs"
                className="inline-flex items-center text-[var(--primary-green)] font-semibold text-sm hover:underline mb-6"
            >
                <ArrowLeft size={16} className="mr-1" />
                Back to Blogs
            </Link>

            <h1 className="text-3xl md:text-4xl font-extrabold text-[var(--primary-red)] mb-4">
                {blog.title}
            </h1>

            {blog.image && (
                <div className="relative w-full h-60 md:h-72 mb-6 rounded-xl overflow-hidden shadow-md">
                    <Image
                        src={blog.image}
                        alt={blog.title}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, 700px"
                    />
                </div>
            )}

            <p className="text-base md:text-lg text-gray-700 leading-relaxed whitespace-pre-line">
                {blog.summary}
            </p>
        </div>
    );
}
