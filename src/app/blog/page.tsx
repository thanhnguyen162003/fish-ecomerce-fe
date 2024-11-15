'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Breadcrumb from '@/components/Breadcrumb/Breadcrumb';
import BlogItem from '@/components/Blog/BlogItem';
import HandlePagination from '@/components/Other/HandlePagination';
import { useRouter } from 'next/navigation';

type Blog = {
    id: string;
    thumbnail: string | null;
    slug: string;
    title: string;
    content: string;
    staff_name: string;
    date: string;
    shortDesc?: string;
};

const BlogDefault = () => {
    const [currentPage, setCurrentPage] = useState<number>(0);
    const productsPerPage = 3;
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const fetchBlogs = async (): Promise<void> => {
            try {
                setLoading(true);
                const response = await fetch(
                    `https://kingfish.azurewebsites.net/api/v1/blog?PageNumber=${currentPage + 1}&PageSize=${productsPerPage}`
                );
                const data: Blog[] = await response.json();
                setBlogs(data);
            } catch (error) {
                setError((error as Error).message);
            } finally {
                setLoading(false);
            }
        };

        fetchBlogs();
    }, [currentPage]);

    const handleBlogClick = (slug: string): void => {
        router.push(`/blog/detail?slug=${slug}`);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error loading blogs. Please try again later.</div>;
    }

    const pageCount = Math.ceil(blogs.length / productsPerPage);

    const handlePageChange = (selected: number): void => {
        setCurrentPage(selected);
    };

    return (
        <>
            <div id="header" className="relative w-full">
                <Breadcrumb heading="Blog" />
            </div>
            <div className="blog default md:py-20 py-10">
                <div className="container">
                    <div className="flex justify-between max-md:flex-col gap-y-12">
                        <div className="left xl:w-3/4 md:w-2/3 pr-2">
                            <div className="list-blog flex flex-col md:gap-10 gap-8">
                                {blogs.map((item: Blog) => (
                                    <BlogItem key={item.id} data={item} type="style-default" />
                                ))}
                            </div>
                            {pageCount > 1 && (
                                <div className="list-pagination w-full flex items-center justify-center md:mt-10 mt-6">
                                    <HandlePagination pageCount={pageCount} onPageChange={handlePageChange} />
                                </div>
                            )}
                        </div>
                        <div className="right xl:w-1/4 md:w-1/3 xl:pl-[52px] md:pl-8">
                            <div className="recent md:mt-10 mt-6 pb-8 border-b border-line">
                                <div className="heading6">Recent Posts</div>
                                <div className="list-recent pt-1">
                                    {blogs.slice(0, 3).map((item: Blog) => (
                                        <div
                                            className="item flex gap-4 mt-5 cursor-pointer"
                                            key={item.id}
                                            onClick={() => handleBlogClick(item.slug)}
                                        >
                                            <Image
                                                src={item.thumbnail || '/default-thumbnail.jpg'}
                                                width={500}
                                                height={400}
                                                alt={item.title}
                                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                                            />
                                            <div>
                                                <div className="text-title mt-1">{item.title}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default BlogDefault;
