
"use client";
import { FC, useCallback, useMemo, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import { FaShoppingCart, FaStar, FaRegStar, FaHeart } from "react-icons/fa";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ProductDetailVm } from "@/models/product/productDetailVm";
import { CartItemPostVm } from "@/models/cart/CartItemPostVm";
import cartService from "@/services/cart/cartService";
import { useCartContext } from "@/context/cartContext";
import { toast } from "react-toastify";
import checkoutService from "@/services/order/checkoutService";
import { useUserInfoContext } from "@/context/userInfoContext";
import { CheckoutPostVm } from "@/models/order/checkout/CheckoutPostVm";
import { useRouter } from "next/navigation";

type Props = {
    productDetail: ProductDetailVm;
    averageStar: number;
    totalRating: number;
};

const ProductDetail: FC<Props> = ({
    productDetail,
    averageStar,
    totalRating,
}) => {
    const router = useRouter();
    const { email } = useUserInfoContext();
    const { fetchNumberCartItems } = useCartContext();
    const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);
    const [quantity, setQuantity] = useState(1);
    const allImages = [productDetail.avatarUrl, ...productDetail.productImageUrls];

    const renderStars = useMemo(() => {
        const fullStars = Math.floor(averageStar);
        const hasHalfStar = averageStar % 1 !== 0;
        const stars = [];
        for (let i = 0; i < fullStars; i++) {
            stars.push(<FaStar key={`full-${i}`} className="text-yellow-400" size={14} />);
        }
        if (hasHalfStar) {
            stars.push(<FaStar key="half" className="text-yellow-400" size={14} />);
        }
        const emptyStars = 5 - stars.length;
        for (let i = 0; i < emptyStars; i++) {
            stars.push(<FaRegStar key={`empty-${i}`} className="text-gray-300" size={14} />);
        }
        return stars;
    }, [averageStar]);

    const handleAddCart = useCallback(() => {
        const cartItemPostVm: CartItemPostVm = {
            quantity,
            productId: productDetail.id
        };
        cartService.addCartItem(cartItemPostVm)
            .then(res => {
                toast.success("Thêm vào giỏ thành công");
                fetchNumberCartItems();
            })
            .catch(error => {
                console.log(error);
            });
    }, [quantity, fetchNumberCartItems, productDetail.id]);

    const handleBuyProduct = useCallback(() => {
        const checkoutPostVm: CheckoutPostVm = {
            email,
            note: '',
            totalPrice: productDetail.price * quantity,
            checkoutItemPostVms: [
                {
                    productId: productDetail.id,
                    quantity: quantity
                }
            ]
        };
        checkoutService.createCheckout(checkoutPostVm)
            .then((res) => {
                router.push(`/checkout/${res.id}`);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [quantity, email, router, productDetail.id, productDetail.price]);

    return (
        <div className="mt-6 bg-white py-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <div className="relative bg-white rounded-lg overflow-hidden shadow-sm group">
                            <Swiper
                                modules={[Navigation, Thumbs]}
                                thumbs={{ swiper: thumbsSwiper }}
                                spaceBetween={10}
                                slidesPerView={1}
                                loop={true}
                                navigation={{
                                    nextEl: ".swiper-button-next-custom",
                                    prevEl: ".swiper-button-prev-custom",
                                }}
                            >
                                {allImages.map((url, idx) => (
                                    <SwiperSlide key={idx}>
                                        <img
                                            src={url}
                                            alt={`${productDetail.name} ${idx + 1}`}
                                            className="w-full h-[400px] object-contain" // Fixed height for consistency
                                            loading="lazy"
                                        />
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                            <button className="swiper-button-prev-custom absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100 lg:opacity-100">
                                <IoIosArrowBack size={16} />
                            </button>
                            <button className="swiper-button-next-custom absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 bg-white/90 hover:bg-white rounded-full shadow-md flex items-center justify-center text-gray-600 hover:text-gray-800 transition-all duration-200 opacity-0 group-hover:opacity-100 lg:opacity-100">
                                <IoIosArrowForward size={16} />
                            </button>
                        </div>
                        <div className="relative">
                            <Swiper
                                onSwiper={setThumbsSwiper}
                                modules={[Thumbs]}
                                spaceBetween={8}
                                slidesPerView={5}
                                watchSlidesProgress={true}
                                className="py-2"
                                breakpoints={{
                                    640: { slidesPerView: 5 },
                                    0: { slidesPerView: 3 }
                                }}
                            >
                                {allImages.slice(0, 5).map((url, idx) => (
                                    <SwiperSlide key={idx} className="!w-16">
                                        <div className="relative h-16 rounded-md overflow-hidden border-2 border-gray-200 hover:border-blue-400 cursor-pointer transition-all duration-200">
                                            <img
                                                src={url}
                                                alt={`${productDetail.name} ${idx + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </div>
                    </div>
                    <div className="space-y-6 lg:pl-6">
                        <div>
                            <h1 className="text-xl lg:text-2xl font-semibold text-gray-900 mb-2">
                                {productDetail.name}
                            </h1>
                            {/* Categories */}
                            {productDetail.categories.length > 0 && (
                                <div className="flex flex-wrap gap-2 mb-3">
                                    {productDetail.categories.map((cat, idx) => (
                                        <span key={idx} className="px-2 py-1 bg-gray-100 text-xs text-gray-600 rounded">
                                            {cat}
                                        </span>
                                    ))}
                                </div>
                            )}
                            <div className="flex items-center gap-2">
                                <div className="flex items-center gap-0.5">
                                    {renderStars}
                                </div>
                                <span className="text-sm text-gray-500">({totalRating} đánh giá)</span>
                            </div>
                        </div>

                        <div>
                            <span className="text-3xl font-bold text-red-600">
                                {productDetail.price.toLocaleString("vi-VN")} ₫
                            </span>
                        </div>

                        {productDetail.authorName && (
                            <div className="text-sm text-gray-600">
                                Tác giả: {productDetail.authorName}
                            </div>
                        )}

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Số lượng</label>
                            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-md p-2">
                                <button
                                    className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium transition-colors disabled:opacity-50"
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={quantity <= 1}
                                >
                                    -
                                </button>
                                <span className="w-8 text-center text-sm font-semibold text-gray-900">
                                    {quantity}
                                </span>
                                <button
                                    className="w-8 h-8 rounded-md bg-white hover:bg-gray-100 flex items-center justify-center text-gray-600 text-sm font-medium transition-colors"
                                    onClick={() => setQuantity(quantity + 1)}
                                >
                                    +
                                </button>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={handleAddCart}
                                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium text-sm transition-colors shadow-sm"
                                disabled={!email} 
                            >
                                <FaShoppingCart size={16} /> Thêm vào giỏ
                            </button>
                            <button
                                onClick={handleBuyProduct}
                                className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-md font-medium text-sm transition-colors shadow-sm"
                                disabled={!email} 
                            >
                                Mua ngay
                            </button>
                        </div>

                        <div className="flex justify-between pt-4 border-t border-gray-200 text-xs text-gray-500">
                            <span>Bảo hành: 12 tháng</span>
                            <span>Giao hàng: Miễn phí</span>
                        </div>

                        
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetail;