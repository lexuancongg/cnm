import {FC} from "react";
import {CartItemDetailVm} from "@/models/cart/CartItemDetailVm";
import LoadImageSafe from "@/components/common/loadImageSafe";
import Link from "next/link";
import {formatPrice} from "@/utils/formatPrice";


interface CartItemProps {
    item: CartItemDetailVm;
    isLoading: boolean;
    isSelected: boolean;
    handleSelectCartItemChange: (productId: number) => void;
    handleDecreaseQuantity: (productId: number) => void;
    handleIncreaseQuantity: (productId: number) => void;
    handleCartItemQuantityOnBlur: (
        productId: number,
        event: React.FocusEvent<HTMLInputElement>
    ) => void;
    handleCartItemQuantityKeyDown: (
        productId: number,
        event: React.KeyboardEvent<HTMLInputElement>
    ) => void;
    handleShowModelConfirmDelete: (productId: number) => void;
}

const CartItem: FC<CartItemProps> = ({
                                         item,
                                         isLoading,
                                         isSelected,
                                         handleSelectCartItemChange,
                                         handleDecreaseQuantity,
                                         handleIncreaseQuantity,
                                         handleCartItemQuantityOnBlur,
                                         handleCartItemQuantityKeyDown,
                                         handleShowModelConfirmDelete,
                                     }) => {
    return (
        <tr key={item.productId}>
            <td>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleSelectCartItemChange(item.productId)}
                />
            </td>
            <td className="cart__product__item d-flex align-items-center">
                <div className="h-100 me-3">
                    <Link href={`/redirect?productId=${item.productId}`}>
                        <img
                            src={item.avatarUrl}
                            alt={item.productName}
                            style={{width: '80px', height: '80px', objectFit: 'cover'}}
                        />
                    </Link>
                </div>
                <div>
                    <Link href={`/redirect?productId=${item.productId}`}>
                        <h6>{item.productName}</h6>
                    </Link>
                    {/* Hiển thị options */}
                    {item.productOptions.map((opt) => (
                        <div key={opt.id} style={{fontSize: '0.9rem', color: '#555'}}>
                            {opt.optionName}: {opt.value}
                        </div>
                    ))}
                </div>
            </td>
            <td className="cart__price">{item.price}€</td>
            <td className="cart__quantity">
                <div className="flex items-center border border-gray-300 rounded-md overflow-hidden w-fit">
                    <button onClick={() => handleDecreaseQuantity(item.productId)} disabled={isLoading}>-</button>
                    <input
                        type="number"
                        defaultValue={item.quantity}
                        onBlur={(e) => handleCartItemQuantityOnBlur(item.productId, e)}
                        onKeyDown={(e) => handleCartItemQuantityKeyDown(item.productId, e)}
                        disabled={isLoading}
                        style={{width: '50px', textAlign: 'center'}}
                    />
                    <button onClick={() => handleIncreaseQuantity(item.productId)} disabled={isLoading}>+</button>
                </div>
            </td>
            <td className="cart__total">{item.price * item.quantity}€</td>
            <td className="cart__close">
                <button onClick={() => handleShowModelConfirmDelete(item.productId)}>
                    <i className="bi bi-x-lg"></i>
                </button>
            </td>
        </tr>
    );
};

export default CartItem;
