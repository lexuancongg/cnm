import {FC} from "react";
import Star from "@/components/rating/star/star";
type Props = {
    productName: string,
    averageStar: number,
    totalRating : number
}
const ProductTitle : FC<Props> = (
    {
        totalRating,
        averageStar,
        productName
    }
)=>{
    return (
        <div className="flex items-center justify-between border-b pb-4 mb-4">
            <div>
                <h4 className="text-xl font-semibold text-gray-800">{productName}</h4>
                <div className="flex items-center space-x-2 mt-1">
                    <Star star={averageStar}/>
                    <span className="text-sm  text-gray-500">({totalRating}) đánh giá</span>
                </div>
            </div>

            <span className="cursor-pointer hover:scale-110 transition-transform">
        <i className="bi bi-bag-heart fs-3 text-red-500"></i>
      </span>
        </div>
    )


}
export default ProductTitle;