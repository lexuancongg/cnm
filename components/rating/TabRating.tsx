import {FC, use, useState} from "react";
import {Tab} from "react-bootstrap";
import FormPostRating from "@/components/rating/FormPostRating";
import ListRating from "@/components/rating/ListRating";
import {RatingVm} from "@/models/rating/RatingVm";

type Props = {
    totalRating: number,
    handleCreateRating: () => void,
    ratings:RatingVm[],
    handlePageChange: ({selected}: any)=> void,
    totalPageRating:number

}
const TabRating: FC<Props> = (
    {
        totalRating,
        handleCreateRating,
        ratings,
        handlePageChange,
        totalPageRating

    }
) => {


    return (
        <Tab eventKey="Reviews" title={`Reviews (${totalRating})`} style={{minHeight: '200px'}}>
            <div>
                <div
                    style={{
                        borderBottom: '1px solid lightgray',
                        marginBottom: 30,
                    }}
                >
                    <FormPostRating
                        handleCreateRating={handleCreateRating}
                    />
                </div>
                <div>
                    <ListRating
                        totalRating={totalRating}
                        ratings={ratings}
                        handlePageChange={handlePageChange}
                        totalPage={totalRating}

                    />
                </div>
            </div>
        </Tab>
    )
}
export default TabRating