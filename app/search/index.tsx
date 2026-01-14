'use client'
// giao dien tìm kiếm trên header
import {useEffect, useState} from "react";
import {SearchParam} from "@/models/search/SearchParams";
import {ProductPreviewVm} from "@/models/product/ProductPreviewVm";
import {useSearchParams} from "next/navigation";
import searchService from "@/services/search/SearchService";
import {NavigationPathModel} from "@/models/Navigation/NavigationPathModel";



const SearchPage = ()=>{
    const [searchParams , setSearchParams] = useState<SearchParam>({
        keyword:''
    })
    const [products,setProducts] = useState<ProductPreviewVm[]>([]);
    const [totalElement,setTotalElement] = useState<number>(1);
    const [pageIndex, setPageIndex] = useState<number>(0);
    const [totalPage,setTotalPage] = useState<number>(1);


    const useParams = useSearchParams();
    useEffect(() => {
        const queryParams : SearchParam = {
            keyword: useParams.get("keyword") || ''
        }
        setSearchParams(queryParams);

    }, [useParams]);

    useEffect(() => {
        searchService.searchProduct(searchParams)
            .then((responseProductsPaging)=>{
                setProducts(responseProductsPaging.productPreviewsPayload)
                setPageIndex(responseProductsPaging.pageIndex)
                setTotalElement(responseProductsPaging.totalElements);
                setTotalPage(responseProductsPaging.totalPages);
            })

    }, [searchParams]);


    return (

    )


}
export default SearchPage;