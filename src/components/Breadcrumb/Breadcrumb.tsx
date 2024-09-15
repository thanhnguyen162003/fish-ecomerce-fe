import React from 'react'
import Link from 'next/link'
import * as Icon from "@phosphor-icons/react/dist/ssr";

interface Pros {
    heading: string
}

const Breadcrumb: React.FC<Pros> = ({ heading}) => {
    return (
        <>
            <div className="breadcrumb-block style-shared">
                <div className="breadcrumb-main overflow-hidden">
                    <div className="container lg:pt-[134px] pt-24 pb-10 relative">
                        <div className="main-content w-full h-full flex flex-col items-center justify-center relative z-[1]">
                            <div className="text-content">
                                <div className="heading2 text-center font-bold">{heading}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Breadcrumb