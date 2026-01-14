'use client'
import {FC, useEffect, useState} from "react";
import { Container } from "react-bootstrap";
import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import productService from "@/services/product/productService";
import ReactPaginate from "react-paginate";
import { CategoryVm } from "@/models/category/CategoryVm";
import categoryService from "@/services/category/categoryService";
import {useRouter} from "next/navigation";

//PASS

const ProductOverview = () => {
    const router = useRouter();

    const [activeTab, setActiveTab] = useState("All");

    const [categories, setCategories] = useState<CategoryVm[]>([])

    const [products, setProducts] = useState<ProductPreviewVm[]>([]);
    const [pageIndex,setPageIndex] = useState<number>(0);
    const [totalPages, setTotalPages] = useState<number>(0);

    useEffect(() => {
        productService.getFeaturedProductsPaging(pageIndex)
            .then((res)=>{
                setProducts(res.productPreviewsPayload)
                setTotalPages(res.totalPages)
            })
            .catch((error)=>{
                console.log(error)
            })
    }, [pageIndex]);

    useEffect(() => {
        categoryService.getCategories()
            .then((res)=>{
                setCategories(res);
            })
            .catch((error)=>{

            })
    }, []);




    const handleChangePageIndex = ({selected}:{selected:number})=>{
        setPageIndex(selected);
    }

    return (
        <Container className=" mt-16  ">
            <div className="mb-4">
                <h3 className="text-4xl font-bold text-gray-900">Product Overview</h3>
            </div>

            <div className="flex items-center justify-between border-b pb-4 mb-8">
                <div className="flex space-x-8">
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => setActiveTab(cat.name)}
                            className={`pb-2 border-b-2 transition-all duration-200 ${activeTab == cat.name
                                ? "text-black font-medium border-red-500"
                                : "text-gray-500 border-transparent hover:text-black hover:border-gray-300"
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>


                {/*<div className="flex space-x-3">*/}
                {/*    <button className="flex items-center border px-4 py-2 rounded hover:bg-gray-100 text-sm">*/}
                {/*        <span className="material-icons mr-1 text-base">filter_list</span>*/}
                {/*        Filter*/}
                {/*    </button>*/}
                {/*    <button className="flex items-center border px-4 py-2 rounded hover:bg-gray-100 text-sm">*/}
                {/*        <span className="material-icons mr-1 text-base">search</span>*/}
                {/*        Search*/}
                {/*    </button>*/}
                {/*</div>*/}
            </div>

            {/* Products grid */}
            <div className="row isotope-grid gap-y-8">
                {products.map((product) => (
                    <div
                        onClick={()=>{
                            router.push(`/products/${product.slug}`)
                        }}
                        key={product.id}
                        className="col-sm-6 col-md-4 col-lg-3 p-b-35 isotope-item"
                    >
                        <div className="block2 group">
                            {/* Ảnh + overlay */}
                            <div className="relative overflow-hidden rounded-md">
                                <img
                                    src={product.avatarUrl}
                                    alt={product.name}
                                    className="w-full h-auto transition-transform duration-300 group-hover:scale-105"
                                />

                                {/* Overlay Quick View */}
                                <a
                                    href="#"
                                    className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition duration-300"
                                >
                                    <span className="text-white text-sm font-medium bg-red-500 px-4 py-2 rounded">
                                        Quick View
                                    </span>
                                </a>
                            </div>

                            {/* Info */}
                            <div className="mt-3 flex justify-between items-center">
                                <div>
                                    <a
                                        href="product-detail.html"
                                        className="block text-gray-700 font-medium hover:text-fuchsia-500 transition"
                                    >
                                        {product.name}
                                    </a>
                                    <span className="text-gray-900 font-semibold transition">
                                        ${product.price.toFixed(2)}
                                    </span>
                                </div>


                                <button className="text-gray-400 hover:text-red-500 transition">
                                    ♥
                                </button>
                            </div>
                        </div>
                    </div>
                ))}

            </div>

            <div className="flex justify-center mt-10">
                <a
                    href="/products"
                    className="px-6 py-2 text-sm font-medium text-black bg-gray-300 rounded hover:!text-white hover:!bg-black transition"
                >
                    Load More
                </a>
            </div>

            {totalPages > 1 && (
                <div className="mt-6">
                    <ReactPaginate
                        forcePage={pageIndex}
                        previousLabel={"←"}
                        nextLabel={"→"}
                        pageCount={totalPages}
                        onPageChange={handleChangePageIndex}

                        containerClassName="flex justify-center items-center space-x-2 mt-8"

                        pageClassName="border border-gray-300 rounded-md hover:bg-gray-100 transition"

                        pageLinkClassName="flex w-full h-full px-3 py-1 items-center justify-center cursor-pointer text-gray-700"

                        activeClassName="!bg-black !text-white border-black"
                        activeLinkClassName="!text-white"

                        previousClassName="border border-gray-300 rounded-md hover:bg-gray-100"
                        previousLinkClassName="flex w-full h-full px-3 py-1 items-center justify-center cursor-pointer text-gray-500"

                        nextClassName="border border-gray-300 rounded-md hover:bg-gray-100"
                        nextLinkClassName="flex w-full h-full px-3 py-1 items-center justify-center cursor-pointer text-gray-500"

                        disabledClassName="opacity-50 cursor-not-allowed"
                        disabledLinkClassName="cursor-not-allowed"
                    />


                </div>
            )}


        </Container>


    );
};

export default ProductOverview;