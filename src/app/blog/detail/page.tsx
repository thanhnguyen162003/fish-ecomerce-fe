'use client';

import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';

type BlogDetail = {
    id: string;
    title: string;
    slug: string;
    content_html: string;
    staff_name: string | null;
    created_at: string;
    thumbnail: string | null;
};

const BlogDetailTwo: React.FC = () => {
    const searchParams = useSearchParams();
    const slug = searchParams.get('slug');
    const [blogDetail, setBlogDetail] = useState<BlogDetail | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!slug) {
            setError('Blog slug not provided.');
            setLoading(false);
            return;
        }

        const fetchBlogDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(`https://kingfish.azurewebsites.net/api/v1/blog/slug/${slug}`);
                if (!response.ok) {
                    throw new Error(`Error fetching blog details: ${response.statusText}`);
                }
                const data: BlogDetail = await response.json();
                setBlogDetail(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogDetail();
    }, [slug]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

    if (!blogDetail) {
        return <div>No blog details available.</div>;
    }

    return (
        <>
            <div id="header" className="relative w-full">
                <Breadcrumb heading="Blog Detail" />
            </div>
            <div className="blog detail md:py-20 py-10">
                <div className="container">
                    <div className="main lg:w-2/3 mx-auto">
                        <div className="blog-title heading3">{blogDetail.title}</div>
                        <div className="author flex items-center gap-4 mt-4">
                            <div className="caption1 text-secondary">by {blogDetail.staff_name || 'Admin'}</div>
                            <div className="line w-5 h-px bg-secondary"></div>
                            <div className="caption1 text-secondary">
                                {new Date(blogDetail.created_at).toLocaleDateString()}
                            </div>
                        </div>
                        <div className="blog-image mt-6">
                            <Image
                                src={blogDetail.thumbnail || '/default-thumbnail.jpg'}
                                width={800}
                                height={600}
                                alt={blogDetail.title}
                                className="w-full object-cover rounded-xl"
                            />
                        </div>
                        <div className="blog-content mt-8">
                            <div
                                className="body1"
                                dangerouslySetInnerHTML={{ __html: blogDetail.content_html }}
                            ></div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDetailTwo;
