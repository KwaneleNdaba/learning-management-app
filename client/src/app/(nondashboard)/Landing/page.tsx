"use client"
import React from 'react'
import { motion } from "framer-motion"
import Link from 'next/link'
import Image from 'next/image'
import { useCarousel } from '@/hooks/useCarousel'

function Landing() {

    const currentImage = useCarousel({ totalImages: 3 });

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className='landing'
        >
            <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="landing__hero"
            >
                <div className="landing__hero-content">
                    <h1 className="landing__title">
                        Courses
                    </h1>
                    <p className="landing__description">
                        This is the list of courses you can enroll in.
                        <br />
                        Courses when you need them and want them.
                    </p>
                    <div className="landing__cta">
                        <Link
                            href="/search"
                        >
                            <div className='landing__cta-button'
                            >
                                Search for Courses
                            </div>
                        </Link>
                    </div>
                </div>
                <div className="landing__hero-images">
                    {
                        ["/images/hero1.jpg", "/images/hero2.jpg", "/images/hero3.jpg"].map((src: any, index: any) => (
                            <Image
                                key={src}
                                alt={`Hero Banner ${index + 1}`}
                                fill
                                src={src}
                                priority={index === currentImage}
                                sizes="(max-width: 768px) 100vw (max-width : 1200px) 50vw, 33vw"
                                className={`landing__hero-image ${index === currentImage ? "landing__hero-image--active" : ""}`}
                            />
                        ))
                    }
                </div>
            </motion.div>
            <motion.div

                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5 }}
                viewport={{ amount: 0.3, once: true }}
                className="landing__featured"
            >
                <h2 className="landing__featured-title">
                    Featured Courses
                </h2>
                <p className="landing__featured-description">
                    We multitude of courses, which are video-first and highly accredited, are partnered with SETA and the QCTO to deliver accessible, high-quality vocational training that’s tailored to suit individuals and businesses in South Africa.
                </p>
                    <div className="landing__tags">
                        {[
                            "Web development",
                            "Enterprise IT",
                            "React Nextjs",
                            "Node JS",
                            "AWS Cloud Services"
                        ].map((tag , index ) => (
                            <p key={index} className='landing__tag'>
                                {tag}
                            </p>
                        ))}
                    </div>
            </motion.div>
        </motion.div>
    )
}

export default Landing
