"use client";
import { Container } from "react-bootstrap";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import {useEffect, useState} from "react";
import productService from "@/services/product/productService";


const RecommentProduct = () => {

    const [products,setProducts] = useState<ProductPreviewVm[]>([])


    useEffect(() => {
        productService.getProductBestSeller()
            .then((res)=>{
                setProducts(res)
            })
            .catch((error)=>{
                console.log(error.message)
            })
    }, []);


    const handleClickProductCard = (slug: string)=>{

    }


    return (
        <Container className="mt-14">
            <h2
                className="text-2xl font-bold mb-6 text-center text-gray-800"
                style={{ fontFamily: "'Poppins', sans-serif" }}
            >
                You May Like - Best Seller
            </h2>

            <Swiper
                key={products.length}
                modules={[Navigation, Pagination, Autoplay]}
                spaceBetween={20}
                slidesPerView={4}
                navigation
                pagination={{ clickable: true }}
                breakpoints={{
                    320: { slidesPerView: 1 },
                    640: { slidesPerView: 2 },
                    768: { slidesPerView: 3 },
                    1024: { slidesPerView: 4 },
                }}
                autoplay={{ delay: 3000, disableOnInteraction: false }}
                loop={true}
                className="pb-5"

            >
                {products.map((product) => (
                    <SwiperSlide key={product.id}>
                        <div
                            onClick={()=> handleClickProductCard(product.slug)}
                            className="group bg-white p-3 rounded-lg   hover:shadow-lg transition">
                            <div className="relative overflow-hidden rounded-md">
                                <img
                                    src={product.avatarUrl}
                                    alt={product.name}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                />
                                <a className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300">
                                    <span className="text-white text-sm font-medium bg-red-500 px-4 py-2 rounded">
                                        Quick View
                                    </span>
                                </a>
                            </div>
                            <div className="mt-3 flex justify-between items-center">
                                <div>
                                    <a
                                        href=""
                                        className="block text-gray-700 font-medium hover:text-fuchsia-500 transition"
                                    >
                                        {product.name}
                                    </a>
                                    <span className="text-gray-900 font-semibold transition">
                                        ${product.price}
                                    </span>
                                </div>
                                <button className="text-gray-400 hover:text-red-500 transition">
                                    ♥
                                </button>
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </Container>
    );
};

export default RecommentProduct;
