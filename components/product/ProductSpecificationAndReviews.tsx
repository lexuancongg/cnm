import { FC } from "react";
import { Tab, Tabs } from "react-bootstrap";
import { ProductDetailVm } from "@/models/product/productDetailVm";
import { RatingVm } from "@/models/rating/RatingVm";
import FormPostRating from "@/components/rating/FormPostRating";
import ListRating from "@/components/rating/ListRating";
import { FiledRatingForm } from "@/models/rating/FiledRatingForm";

type Props = {
    productDetail: ProductDetailVm;
    totalRating: number;
    handleCreateRating: (data: FiledRatingForm, star: number) => void;
    handlePageChange: ({ selected }: any) => void;
    ratings: RatingVm[];
    totalPageRating: number;
};

const ProductSpecificationAndReviews: FC<Props> = ({
                                                       productDetail,
                                                       totalRating,
                                                       handleCreateRating,
                                                       handlePageChange,
                                                       ratings,
                                                       totalPageRating,
                                                   }) => {
    return (
        <div className="max-w-6xl mx-auto mt-10">
            <Tabs
                defaultActiveKey="Specification"
                id="product-detail-tab"
                className="border-b border-gray-200"
            >
                {/* SPEC */}
                <Tab
                    eventKey="Specification"
                    title={<span className="text-sm font-medium">Mô tả sản phẩm</span>}
                >
                    <div className="bg-white p-6 rounded-b-lg shadow-sm">
                        <div
                            className="prose max-w-none text-gray-700"
                            dangerouslySetInnerHTML={{
                                __html: productDetail.specifications,
                            }}
                        />
                    </div>
                </Tab>

                {/* REVIEW */}
                <Tab
                    eventKey="Reviews"
                    title={
                        <span className="text-sm font-medium">
              Đánh giá ({totalRating})
            </span>
                    }
                >
                    <div className="bg-white p-6 rounded-b-lg shadow-sm space-y-8">
                        {/* Form */}
                        <div className="border-b border-gray-200 pb-6">
                            <FormPostRating handleCreateRating={handleCreateRating} />
                        </div>

                        {/* List */}
                        <ListRating
                            totalRating={totalRating}
                            ratings={ratings}
                            handlePageChange={handlePageChange}
                            totalPage={totalPageRating}
                        />
                    </div>
                </Tab>
            </Tabs>
        </div>
    );
};

export default ProductSpecificationAndReviews;
