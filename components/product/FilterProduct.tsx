import { FC } from "react"

type Props = {
    isShow: boolean,
    handleFilterPrice: (key:string, price: number)=>void,
    removeFilter : (key:string) =>void

}

const FilterProduct: FC<Props> = ({ isShow , handleFilterPrice , removeFilter}) => {
    return (
        <div
            className={`transition-all duration-300 ease-in-out overflow-hidden ${
                isShow ? "max-h-[200px]" : "max-h-0"
            }`}
        >
            <div className="bg-gray-50 p-4 grid grid-cols-2 gap-4">

                {/* Start Price */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        Start Price
                    </label>
                    <input
                        type="number"
                        placeholder="Min price"
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-black"
                        onChange={(e) => {
                            const startPrice = Number(e.target.value)
                            if(startPrice) {
                                handleFilterPrice("startPrice", startPrice)
                                return
                            }
                            removeFilter("startPrice")
                        }}
                    />
                </div>

                {/* End Price */}
                <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">
                        End Price
                    </label>
                    <input
                        type="number"
                        placeholder="Max price"
                        className="w-full border border-gray-300 rounded p-2 text-sm outline-none focus:border-black"
                        onChange={(e) => {
                            const value = e.target.value;
                            if (value === "") {
                                removeFilter("endPrice");
                            } else {
                                handleFilterPrice("endPrice", Number(value));
                            }

                        }}
                    />
                </div>

            </div>
        </div>
    )
}

export default FilterProduct
