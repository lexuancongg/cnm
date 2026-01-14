'use client'
import {NextPage} from "next";
import {useProductDetailContext} from "@/context/productDetailContext";
import {useEffect, useState} from "react";
import {RatingVm} from "@/models/rating/RatingVm";
import {Container} from "react-bootstrap";
import ProductDetail from "@/components/product/productDetail";
import ProductSpecificationAndReviews from "@/components/product/ProductSpecificationAndReviews";
import ratingService from "@/services/rating/RatingService";
import {FiledRatingForm} from "@/models/rating/FiledRatingForm";
import {RatingPost} from "@/models/rating/RatingPost";
import {toast} from "react-toastify";


const pageSize = 10;
const ProductDetailPage :NextPage =   ()=>{
   const productDetailContextValue = useProductDetailContext();
   if (!productDetailContextValue) {
       return ;
   }
   const {productDetail}= productDetailContextValue;


   const productId = productDetail.id;
   const  handleCreateRating = (data : FiledRatingForm , star: number)=>{
       const content = data.content;
       const ratingPost : RatingPost = {
           star:star,
           productId:productId,
           content,
           productName:productDetail.name
       }
       ratingService.createRating(ratingPost)
           .then(()=>{
               toast.success("thank you for your feedback")
                ratingService.getAverageStarByProductId(productId)
                    .then(responseAvgStar=>{
                        setAverageStar(responseAvgStar);
                    })
                ratingService.getRatingsByProductId(productId , pageIndexRating , pageSize)
                    .then((responseRatingPaging)=>{
                        setRatings(responseRatingPaging.ratingPayload);
                        setTotalPageRating(responseRatingPaging.totalPages)
                        setTotalRating(responseRatingPaging.totalElements)

                    })
           })
           .catch( async (error)=>{
               const data = await error.json();
               toast.error(data.detail)
           })
   }

    const [ratings , setRatings] = useState<RatingVm[]>([]);
    const [averageStar, setAverageStar] = useState<number>(4.6);
    const [totalRating, setTotalRating] = useState<number>(0);
    const [totalPageRating, setTotalPageRating] = useState<number>(1);
    const [pageIndexRating, setPageIndexRating] = useState<number>(0);

    useEffect(() => {
        ratingService.getAverageStarByProductId(productId)
            .then(responseAvgStar=>{
                setAverageStar(responseAvgStar);
            })
    }, []);

    useEffect(() => {
        ratingService.getRatingsByProductId(productId , pageIndexRating , pageSize)
            .then((responseRatingPaging)=>{
                setRatings(responseRatingPaging.ratingPayload);
                setTotalPageRating(responseRatingPaging.totalPages)
                setTotalRating(responseRatingPaging.totalElements)

            })
    }, [pageIndexRating, productId]);


    const handlePageChange = ({selected}: any)=>{
        setPageIndexRating(selected)
    }


    return (
        <Container>
            <ProductDetail
                productDetail={productDetail}
                averageStar={averageStar}
                totalRating={totalRating}>
            </ProductDetail>





            <ProductSpecificationAndReviews
                productDetail={productDetail}
                totalRating={totalRating}
                handleCreateRating={handleCreateRating}
                totalPageRating={totalPageRating}
                ratings={ratings}
                handlePageChange={handlePageChange}


            >



            </ProductSpecificationAndReviews>


        </Container>
    )
}
export default ProductDetailPage;