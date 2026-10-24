import React from "react";
function CartSummary({
    subtotal,
    clearCart,
    proceedToCheckout
}) {

    return (

        <div className="border-top pt-3">

            {/* Subtotal */}

            <div className="d-flex justify-content-end">

                <h5>

                    Subtotal:

                    <span className="ms-2 text-success">

                        ₹ {subtotal}

                    </span>

                </h5>

            </div>


            {/* Buttons */}

            <div className="d-flex justify-content-end mt-3">

                {/* Clear Cart */}

                <button
                    type="button"
                    className="btn btn-danger me-2"
                    onClick={clearCart}
                >
                    Clear Cart
                </button>


                {/* Checkout */}

                <button
                    type="button"
                    className="btn btn-success"
                    onClick={proceedToCheckout}
                >
                    Proceed to Checkout
                </button>

            </div>

        </div>

    );
}

export default CartSummary;