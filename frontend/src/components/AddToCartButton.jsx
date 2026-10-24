import React from "react";
import { useCart } from "../context/CartContext";

function AddToCartButton({ product }) {

    const { addToCart } = useCart();

    const handleAddToCart = async () => {

        try {

            await addToCart(product);

            alert("Product added to cart");

        } catch (err) {
            console.log("error", err)

            // console.log("STATUS:", error.response?.status);

            // console.log(
            //     "RESPONSE:",
            //     error.response?.data
            // );

            // console.log(
            //     "VALIDATION ERRORS:",
            //     error.response?.data?.errors
            // );
        }
    };


    return (
        <button
            className="btn btn-primary w-100"
            onClick={handleAddToCart}
        >
            Add To Cart
        </button>
    );
}

export default AddToCartButton;