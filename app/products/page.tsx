'use client'
import {useRouter, useSearchParams} from "next/navigation";
import {ChangeEvent, useEffect, useRef, useState} from "react";
import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import {Container, Row} from "react-bootstrap";

import ReactPaginate from "react-paginate";
import {CategoryVm} from "@/models/category/CategoryVm";
import categoryService from "@/services/category/categoryService";
import * as querystring from "node:querystring";
import productService from "@/services/product/productService";
import FilterProduct from "@/components/product/FilterProduct";

import { motion, AnimatePresence } from "framer-motion";

const CATEGORY_SLUG = 'categorySlug';



export default function ProductList() {
    const loadingCountRef = useRef(0);
    const router = useRouter();
    const searchParams = useSearchParams();
    const [products, setProducts] = useState<ProductPreviewVm[]>([]);
    const [totalPage, setTotalPage] = useState<number>(0);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [categories, setCategories] = useState<CategoryVm[]>([]);
    const [filters, setFilters] = useState<any>(null);
    const [categoryIdActive, setCategoryIdActive] = useState<number>(0);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const endPriceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const startPriceTimeoutRef = useRef<NodeJS.Timeout | null>(null);


    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const inputSearchRef = useRef<HTMLInputElement>(null);
    const [isShowLoading,setIsShowLoading] = useState<boolean>(false);
    const hasFilter = filters && Object.keys(filters).length > 0;



    const startLoading = () => {
        loadingCountRef.current++;
        setIsShowLoading(true);
    };

    const stopLoading = () => {
        loadingCountRef.current--;
        if (loadingCountRef.current <= 0) {
            loadingCountRef.current = 0;
            setIsShowLoading(false);
        }
    };


    useEffect(() => {
        startLoading();
        categoryService.getCategories()
            .then((responseCategories) => {
                let categoryId: number = 0;
                if (Array.from(searchParams.entries()).length > 0 && searchParams.get(CATEGORY_SLUG)) {
                    const categorySlugValue: string = searchParams.get(CATEGORY_SLUG) as string;
                    categoryId = responseCategories.find(cate => cate.slug == categorySlugValue)?.id !;

                }
                if (categoryId){
                    setCategoryIdActive(categoryId);
                }
                setCategories(responseCategories);
            })
            .finally(stopLoading)
    }, []);



    useEffect(() => {
        const paramsObj: Record<string, string> = {}
        if (Array.from(searchParams.entries()).length > 0) {
            for (const [key, value] of searchParams.entries()) {
                paramsObj[key] = value;
            }
        }
        setFilters(paramsObj);
    }, [searchParams.toString()])



    useEffect(() => {
        if (filters == null) {
            return;
        }

        let predicates = querystring.stringify({...filters, pageIndex: pageIndex});
        startLoading()
        productService.getProductByMultiParams(predicates)
            .then(responseProductsPagingVm => {
                setProducts(responseProductsPagingVm.productPreviewsPayload);
                setTotalPage(responseProductsPagingVm.totalPages);
                 setIsShowLoading(false)
            })
            .finally(stopLoading)


    }, [filters])


    const updateFilter = (key: string, value: string | number) => {

        const currentValue = searchParams.get(key);
        if (currentValue && currentValue == value) {
            return;
        }
        pushParamsToRouter(key, value)
        setPageIndex(0)

    }
    const pushParamsToRouter = (key: string, value: string | number) => {
        const params = new URLSearchParams(searchParams.toString())
        params.set(key, String(value))
        router.push(`?${params.toString()}`)
    }


    const removeFilter = (key:string)=>{
        const params = new URLSearchParams(searchParams.toString())
        params.delete(key)
        router.push(`?${params.toString()}`)

    }






    const changePage = ({selected}: any) => {
        setPageIndex(selected);
        pushParamsToRouter("pageIndex", selected)
    }


    const handleFilterPrice = (key:string , price: number)=>{
        updateFilter(key,price)
    }

    console.log(filters)

    const handleClearFilter = ()=>{
        setPageIndex(0)
        router.push("/products")
        setCategoryIdActive(0)
    }








    return (
        <Container className="mt-16">
            {/*{isShowLoading && <Loader></Loader>}*/}
            <div className="mb-4">
                <h3 className="text-4xl font-bold text-gray-900">Product Overview</h3>
            </div>

            {/* Tabs */}
            <div className="flex items-center justify-between border-b pb-4 mb-8">
                <div className="flex space-x-8">

                    <button
                        onClick={() => {
                            setCategoryIdActive(0);
                            removeFilter(CATEGORY_SLUG)
                        }}
                        className={`pb-2 border-b-2 transition-all duration-200 ${categoryIdActive === 0
                            ? 'text-red-800 font-medium border-red-500'
                            : 'text-gray-500 border-transparent hover:text-black hover:border-gray-300'
                        }`}
                    >
                        ALL
                    </button>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            onClick={() => {
                                setCategoryIdActive(cat.id);
                                updateFilter(CATEGORY_SLUG, cat.slug)
                            }}
                            className={`pb-2 border-b-2 transition-all duration-200 ${categoryIdActive === cat.id
                                ? 'text-red-800 font-medium border-red-500'
                                : 'text-gray-500 border-transparent hover:text-black hover:border-gray-300'
                            }`}
                        >
                            {cat.name}
                        </button>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex space-x-3">
                    <button
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className={`flex items-center border px-4 py-2 rounded text-sm transition
    ${hasFilter
                            ? "bg-red-100 border-red-500 text-red-700"
                            : "hover:bg-gray-100"}
  `}
                    >
                        <span className="material-icons mr-1 text-base">filter_list</span>
                        Filter
                        {hasFilter && (
                            <span className="ml-2 w-2 h-2 bg-red-500 rounded-full"></span>
                        )}
                    </button>

                    <button
                        onClick={handleClearFilter}
                        className="flex items-center border px-4 py-2 rounded hover:bg-gray-100 text-sm">
                        <span className="material-icons mr-1 text-base">clear filter</span>

                    </button>
                </div>
            </div>

            <div
                className={`transition-all duration-300 ease-in-out overflow-hidden ${
                    isFilterOpen ? 'max-h-[100px]' : 'max-h-0'
                }`}
            >
                <div className="bg-gray-50 p-4">
                    <div className="flex items-center">
                        <input
                            onChange={(e) => {
                                const value = e.target.value;

                                if (searchTimeoutRef.current) {
                                    clearTimeout(searchTimeoutRef.current);
                                }

                                searchTimeoutRef.current = setTimeout(() => {
                                    if (value.trim() === "") {
                                        removeFilter("productName");
                                    } else {
                                        updateFilter("productName", value);
                                    }
                                }, 500);
                            }}
                            ref={inputSearchRef}
                            type="text"
                            placeholder="Search products..."
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button className="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                        >
                            Search
                        </button>
                    </div>
                </div>
            </div>


            <FilterProduct
                handleFilterPrice={handleFilterPrice}
                isShow={isFilterOpen}
                removeFilter={removeFilter}
            ></FilterProduct>

            <div className="row isotope-grid gap-y-8 mt-8">
                <AnimatePresence>
                    {products.map(product => (
                        <motion.div
                            key={product.id}
                            layout
                            initial={{opacity: 0, y: 20}}
                            animate={{opacity: 1, y: 0}}
                            exit={{opacity: 0, y: -20}}
                            transition={{duration: 0.5, ease: "easeOut"}}
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
                                    <a
                                        href={`/products/${product.slug}`}
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
                                            href=""
                                            className="block text-gray-700 font-medium hover:text-fuchsia-500 transition"
                                        >
                                            {product.name}
                                        </a>
                                        <span className="text-gray-900 font-semibold transition">
                ${product.price.toFixed(2)}
              </span>
                                    </div>

                                    <button className="text-gray-400 hover:text-red-500 transition">

                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>




            {totalPage > 1 && (
                <div className="mt-6">
                    <ReactPaginate
                        forcePage={pageIndex}
                        previousLabel={"←"}
                        nextLabel={"→"}
                        pageCount={totalPage}
                        onPageChange={changePage}
                        containerClassName="flex justify-center items-center space-x-2 mt-8"
                        pageClassName="px-3 py-1 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition"
                        activeClassName="!bg-black !text-white border-black"
                        previousClassName="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100"
                        nextClassName="px-3 py-1 border border-gray-300 rounded-md text-gray-500 hover:bg-gray-100"
                        disabledClassName="opacity-50 cursor-not-allowed"
                    />

                </div>
            )}
        </Container>


    );


}