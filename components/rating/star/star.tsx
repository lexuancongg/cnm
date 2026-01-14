import {FC} from "react";
// lỗi vì thư viện là js thuần còn đây dùng ts => fix trong tsconfig
import StarRatings from 'react-star-ratings';


type Props = {
    star: number
}

const Star:FC<Props> = ({star})=>{
    return (
        <StarRatings
            feedback={star}
            starRatedColor="#fb6e2e"
            numberOfStars={5}
            starDimension="18px"
            starSpacing="0"
            name="feedback-header"
        />
    )
}
export default Star;