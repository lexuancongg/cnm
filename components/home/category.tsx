'use client'
import {NextPage} from "next";
import {useEffect, useState} from "react";
import {CategoryVm} from "@/models/category/CategoryVm";
import {Container} from "react-bootstrap";
import categoryService from "@/services/category/categoryService";
import {useRouter} from "next/navigation";
import LoadImageSafe from "../common/loadImageSafe";

const categoriesDemo: CategoryVm[] = [
    {
        id: 1,
        name: "Woment",
        slug: "electronics",

        imageCategory : {
            id : 1,
            url : "https://preview.colorlib.com/theme/cozastore/images/banner-01.jpg",
        
        }
    },
    {
        id: 2,
        name: "Men",
        slug: "fashion",
       imageCategory : {
            id : 2,
            url : "https://preview.colorlib.com/theme/cozastore/images/banner-02.jpg",
        
        }
    },
    {
        id: 3,
        name: "Kids",
        slug: "fashion",
        imageCategory : {
            id : 3,
            url : "https://preview.colorlib.com/theme/cozastore/images/banner-03.jpg",
        
        }
    },
    {
        id: 4,
        name: "Fashion",
        slug: "fashion",
        imageCategory : {
            id : 4,
            url : "https://preview.colorlib.com/theme/cozastore/images/banner-04.jpg",
        
        }
    }
]


// PASS
const Category: NextPage = () => {

    const [current, setCurrent] = useState(0);
    const router = useRouter();
    const [categories, setCategories] = useState<CategoryVm[]>([]);

    const next = () => {
        if (current < categories.length - 3) {
            setCurrent(current + 1);
        }
    };
    const prev = () => {
        if (current > 0) setCurrent(current - 1);
    };


    const handleClickCategoryCard = (slug: string) => {
        router.push(`/products?categorySlug=${slug}`)

    }
    useEffect(() => {
        categoryService.getCategories()
            .then((resCategories) => {
            
                setCategories(resCategories);
            })
            .catch((error) => {
                console.log(error)
            })

    }, []);


    return (
        <Container className="mt-5 relative overflow-hidden  ">
            <div
                className="flex transition-transform duration-500 ease-out"
                style={{
                    transform: `translateX(calc(-${current * (100 / 3)}% - ${current * (1 / 3)}rem))`,
                    gap: "1rem",
                }}
            >
                {categories.map((category) => (
                    <div
                        onClick={() => handleClickCategoryCard(category.slug)}
                        key={category.id}
                        className="flex-none relative overflow-hidden cursor-pointer group rounded-xl border border-gray-300 "
                        style={{
                            width: "calc((100% - 2rem) / 3)",
                            aspectRatio: "4/3",
                        }}
                    >
                        <LoadImageSafe
                            src={category.imageCategory?.url!}
                            alt={category.name}
                            className="w-full h-full object-cover"
                        />

                        <div
                            className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none"></div>

                        <div

                            className="absolute inset-0 flex flex-col justify-between p-6"
                        >
                            <div className="flex flex-col space-y-1">
                                <span
                                    className="text-black text-2xl font-bold transition-all group-hover:-translate-y-1 group-hover:text-yellow-400">
                                    {category.name}
                                </span>
                                <span
                                    className="text-black-100 text-xs transition-all group-hover:-translate-y-1 group-hover:text-yellow-300">
                                    Spring 2018
                                </span>
                            </div>
                            <div
                                className="text-white font-semibold transition-all group-hover:-translate-y-1 group-hover:text-white">
                                Shop Now
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <button
                onClick={prev}
                className="absolute top-1/2 left-0 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
                ‹
            </button>
            <button
                onClick={next}
                className="absolute top-1/2 right-0 -translate-y-1/2 bg-black/50 text-white px-3 py-2 rounded-full"
            >
                ›
            </button>
        </Container>

    )
}
export default Category;
