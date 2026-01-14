import { FC } from "react";
import { RatingVm } from "@/models/rating/RatingVm";
import Star from "@/components/rating/star/star";
import ReactPaginate from "react-paginate";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

type Props = {
    ratings: RatingVm[];
    totalRating: number;
    totalPage: number;
    handlePageChange: ({ selected }: any) => void;
};

const ListRating: FC<Props> = ({
                                   ratings,
                                   totalRating,
                                   totalPage,
                                   handlePageChange,
                               }) => {
    if (totalRating === 0) {
        return (
            <div className="text-center text-gray-500 py-10">
                Chưa có đánh giá nào 😢
            </div>
        );
    }



    return (
        <div className="space-y-6">
            {/* LIST */}
            {ratings.map(rating => {
                const fullName =
                    rating.firstName || rating.lastName
                        ? `${rating.firstName ?? ""} ${rating.lastName ?? ""}`
                        : "Anonymous";

                return (
                    <div
                        key={rating.id}
                        className="border border-gray-200 rounded-lg p-4 bg-white"
                    >
                        {/* HEADER */}
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                <p className="font-medium text-gray-900">{fullName}</p>
                                <Star star={rating.startNumber} />
                            </div>
                            <span className="text-xs text-gray-400">
                {dayjs(rating.createAt).fromNow()}
              </span>
                        </div>

                        {/* CONTENT */}
                        <p className="text-sm text-gray-700 leading-relaxed">
                            {rating.content}
                        </p>
                    </div>
                );
            })}

            {/* PAGINATION */}
            {totalPage > 1 && (
                <div className="flex justify-center pt-4">
                    <ReactPaginate
                        previousLabel="‹"
                        nextLabel="›"
                        pageCount={totalPage}
                        onPageChange={handlePageChange}
                        containerClassName="flex items-center gap-2"
                        pageClassName="px-3 py-1 border rounded text-sm text-gray-600 hover:bg-gray-100"
                        activeClassName="!bg-blue-500 !text-white"
                        previousClassName="px-3 py-1 border rounded hover:bg-gray-100"
                        nextClassName="px-3 py-1 border rounded hover:bg-gray-100"
                        disabledClassName="opacity-50 cursor-not-allowed"
                    />
                </div>
            )}
        </div>
    );
};

export default ListRating;
