'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface BlogProps {
    data: {
        id: string;
        thumbnail: string | null;
        slug: string;
        title: string;
        content: string;
        staff_name: string;
        date: string;
        shortDesc?: string;
    };
    type: string;
}

const BlogItem: React.FC<BlogProps> = ({ data, type }) => {
    const router = useRouter();

    const handleBlogClick = (slug: string) => {
        router.push(`/blog/detail?slug=${slug}`);
    };

    return (
        <div
            className={`blog-item ${type} h-full cursor-pointer`}
            onClick={() => handleBlogClick(data.slug)}
        >
            <div className="blog-main h-full block pb-8 border-b border-line">
                <div className="blog-thumb rounded-[20px] overflow-hidden">
                    <Image
                        src={data.thumbnail || '/default-thumbnail.jpg'}
                        width={2000}
                        height={1500}
                        alt={data.title || 'Blog Image'}
                        className="w-full duration-500"
                    />
                </div>
                <div className="blog-infor mt-7">
                    <div className="heading6 blog-title mt-3 duration-300">{data.title}</div>
                    <div className="flex items-center gap-2 mt-2">
                        <div className="blog-author caption1 text-secondary">by {data.staff_name}</div>
                        <span className="w-[20px] h-[1px] bg-black"></span>
                        <div className="blog-date caption1 text-secondary">{data.date}</div>
                    </div>
                    {data.shortDesc && <div className="body1 text-secondary mt-4">{data.shortDesc}</div>}
                    <div className="text-button underline mt-4">Read More</div>
                </div>
            </div>
        </div>
    );
};

export default BlogItem;
