import { FC, useState } from "react";
import { useForm } from "react-hook-form";
import StarRatings from "react-star-ratings";

import { FiledRatingForm } from "@/models/rating/FiledRatingForm";

type Props = {
    handleCreateRating: (data: FiledRatingForm , star: number) => void;
};

const FormPostRating: FC<Props> = ({ handleCreateRating }) => {
    const [contentRating, setContentRating] = useState<string>("");
    const [ratingStar, setRatingStar] = useState<number>(5);



    const { formState: { errors }, register, handleSubmit, setValue } = useForm<FiledRatingForm>({
        defaultValues: {  content: "" }
    });

    const onRatingChange = (newRating: number) => {
        setRatingStar(newRating);
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 max-w-md mx-auto">
            <h4 className="text-lg font-semibold text-gray-900 mb-6 text-center">Add a review</h4>

            <form onSubmit={handleSubmit((data)=> handleCreateRating(data , ratingStar))} className="space-y-6">
                {/* Rating Section */}
                <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">Your rating:</label>
                    <div className="flex items-center">
                        <StarRatings
                            rating={ratingStar}
                            starRatedColor="#FFBF00"
                            numberOfStars={5}
                            starDimension="20px"
                            starSpacing="2px"
                            changeRating={onRatingChange}
                            className="flex"
                        />
                        <span className="ml-2 text-sm text-gray-500">({ratingStar}/5)</span>
                    </div>
                </div>

                {/* Content Textarea */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Your review
                    </label>
                    <textarea
                        {...register("content", {
                            required: "Content review is required.",
                            maxLength: { value: 500, message: "Review must be less than 500 characters." }
                        })}
                        onChange={(event) => setContentRating(event.target.value)}

                        placeholder="Share your thoughts... (e.g., Great product, fast delivery!)"
                        className="w-full min-h-[120px] rounded-lg border border-gray-300 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-vertical px-4 py-3 text-sm text-gray-900 placeholder-gray-400 transition-colors"
                        rows={4}
                    />
                    {errors.content && (
                        <p className="mt-1 text-sm text-red-600">{errors.content.message}</p>
                    )}
                </div>

                {/* Submit Button */}
                <div className="flex justify-end">
                    <button
                        type="submit"
                        className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!contentRating.trim() || errors.content}
                    >
                        Post Review
                    </button>
                </div>
            </form>
        </div>
    );
};

export default FormPostRating;