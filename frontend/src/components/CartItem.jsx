import React from "react";

function CartItem({
    item,
    increaseQuantity,
    decreaseQuantity,
    updateQuantity,
    removeProduct
}) {

    return (

        <tr>

            {/* Product */}

            <td>

                <div className="fw-semibold">
                    {item.product.name}
                </div>

            </td>


            {/* Price */}

            <td>
                ₹ {item.product.price}
            </td>


            {/* Quantity */}

            <td className="text-center">

                <div className="d-flex justify-content-center align-items-center gap-2">

                    {/* Decrease */}

                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            decreaseQuantity(item.id)
                        }
                        disabled={item.quantity <= 1}
                    >
                        -
                    </button>


                    {/* Quantity */}

                    <span className="fw-semibold px-2">
                        {item.quantity}
                    </span>


                    {/* Increase */}

                    <button
                        type="button"
                        className="btn btn-outline-secondary btn-sm"
                        onClick={() =>
                            increaseQuantity(item.id)
                        }
                    >
                        +
                    </button>

                </div>


                {/* Update */}

                <button
                    type="button"
                    className="btn btn-primary btn-sm mt-2"
                    onClick={() =>
                        updateQuantity(item.id)
                    }
                >
                    Update Quantity
                </button>


                {/* Remove */}

                <button
                    type="button"
                    className="btn btn-danger btn-sm mt-2 ms-2"
                    onClick={() => removeProduct(item.id)}
                >
                    Remove
                </button>

            </td>


            {/* Total */}

            <td className="text-end fw-semibold">

                ₹{" "}

                {item.product.price * item.quantity}

            </td>

        </tr>

    );
}

export default CartItem;