import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import { useCart } from "../context/CartContext";
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import ProductNavbar from "./ProductNavbar.jsx";



function Cart() {

    const navigate = useNavigate();

    const { getCartCount } = useCart();

    const [cartItems, setCartItems] = useState([]);


    // Get Cart

    const getCart = () => {

        api.get("/api/user/cart")
            .then((response) => {

                // console.log("Cart:", response.data);

                setCartItems(response.data.cart);

            })
            .catch((error) => {

                console.log("Cart Error:", error);

            });

    };


    useEffect(() => {

        getCart();

    }, []);


    // Increase Quantity

    const increaseQuantity = (itemId) => {

        setCartItems((items) =>

            items.map((item) => {

                if (item.id === itemId) {

                    return {
                        ...item,
                        quantity: item.quantity + 1
                    };

                }

                return item;

            })

        );

    };


    // Decrease Quantity

    const decreaseQuantity = (itemId) => {

        setCartItems((items) =>

            items.map((item) => {

                if (item.id === itemId) {

                    return {
                        ...item,
                        quantity: Math.max(
                            1,
                            item.quantity - 1
                        )
                    };

                }

                return item;

            })

        );

    };


    // Update Quantity

    const updateQuantity = (itemId) => {

        const item = cartItems.find(
            (item) => item.id === itemId
        );

        if (!item) {
            return;
        }


        api.put(`/api/user/cart/items/${itemId}`, {
            quantity: item.quantity
        })
            .then((response) => {

                // console.log(
                //     "Quantity Updated:",
                //     response.data
                // );

                alert(
                    "Quantity updated successfully"
                );

                getCart();

            })
            .catch((error) => {

                console.log(
                    "Update Quantity Error:",
                    error
                );

                if (error.response) {

                    alert(
                        error.response.data.message ||
                        "Unable to update quantity"
                    );

                }

            });

    };


    // Remove Product

    const removeProduct = (itemId) => {

        api.delete(`/api/user/cart/items/${itemId}`)
            .then((response) => {

                console.log(
                    "Product Removed:",
                    response.data
                );

                // Update cart list
                getCart();

                // Update navbar cart count
                getCartCount();

            })
            .catch((error) => {

                console.log(
                    "Remove Product Error:",
                    error
                );

            });

    };


    // Clear Cart

    const clearCart = () => {

        api.delete("/api/user/cart")
            .then((response) => {

                console.log(
                    "Cart Cleared:",
                    response.data
                );

                alert(
                    "Cart cleared successfully"
                );

                // Empty cart page
                setCartItems([]);

                // Update navbar cart count
                getCartCount();

            })
            .catch((error) => {

                console.log(
                    "Clear Cart Error:",
                    error
                );

            });

    };


    // Subtotal

    const subtotal = cartItems.reduce(
        (total, item) =>
            total + item.product.price * item.quantity,
        0
    );

    // Proceed To Checkout

    const proceedToCheckout = () => {
        navigate("/checkout");
    };


    return (


        <div className="container py-4">
            {/*  NAVBAR  */}
            <div>
                <ProductNavbar />
            </div>
            {/* Page Heading */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Shopping Cart
                    </h2>

                    <p className="text-muted mb-0">
                        Review your items before checkout
                    </p>

                </div>


                {cartItems.length > 0 && (

                    <span className="badge bg-primary rounded-pill px-3 py-2">

                        {cartItems.length} Items

                    </span>

                )}

            </div>


            {cartItems.length > 0 ? (

                <div className="row g-4">

                    {/* Cart Items */}

                    <div className="col-lg-8">

                        <div className="card border-0 shadow-sm">

                            <div className="card-header bg-white border-0 py-3">

                                <h5 className="fw-bold mb-0">
                                    Cart Items
                                </h5>

                            </div>


                            <div className="card-body p-0">

                                <div className="table-responsive">

                                    <table className="table align-middle mb-0">

                                        <thead className="table-light">

                                            <tr>

                                                <th className="ps-4">
                                                    Product
                                                </th>

                                                <th>
                                                    Price
                                                </th>

                                                <th className="text-center">
                                                    Quantity
                                                </th>

                                                <th className="text-end pe-4">
                                                    Total
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {cartItems.map((item) => (

                                                <CartItem
                                                    key={item.id}
                                                    item={item}
                                                    increaseQuantity={increaseQuantity}
                                                    decreaseQuantity={decreaseQuantity}
                                                    updateQuantity={updateQuantity}
                                                    removeProduct={removeProduct}
                                                />

                                            ))}

                                        </tbody>

                                    </table>

                                </div>

                            </div>

                        </div>

                    </div>


                    {/* Cart Summary */}

                    <div className="col-lg-4">

                        <div
                            className="card border-0 shadow-sm"
                            style={{
                                position: "sticky",
                                top: "90px"
                            }}
                        >

                            <div className="card-body p-4">

                                <h5 className="fw-bold mb-4">
                                    Order Summary
                                </h5>


                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Subtotal
                                    </span>

                                    <span className="fw-semibold">
                                        ₹{subtotal}
                                    </span>

                                </div>


                                <div className="d-flex justify-content-between mb-3">

                                    <span className="text-muted">
                                        Delivery
                                    </span>

                                    <span className="text-success fw-semibold">
                                        Free
                                    </span>

                                </div>


                                <hr />


                                <div className="d-flex justify-content-between mb-4">

                                    <span className="fw-bold">
                                        Total
                                    </span>

                                    <span className="fw-bold fs-5 text-primary">
                                        ₹{subtotal}
                                    </span>

                                </div>


                                <CartSummary
                                    subtotal={subtotal}
                                    clearCart={clearCart}
                                    proceedToCheckout={proceedToCheckout}
                                />

                            </div>

                        </div>

                    </div>

                </div>

            ) : (

                /* Empty Cart */

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <div
                            className="rounded-circle bg-light d-flex align-items-center justify-content-center mx-auto mb-4"
                            style={{
                                width: "90px",
                                height: "90px",
                                fontSize: "40px"
                            }}
                        >
                            🛒
                        </div>


                        <h4 className="fw-bold mb-2">
                            Your Cart is Empty
                        </h4>


                        <p className="text-muted mb-4">
                            Looks like you haven't added anything to your cart yet.
                        </p>


                        <button
                            type="button"
                            className="btn btn-primary px-4"
                            onClick={() => navigate("/ProductList")}
                        >
                            Continue Shopping
                        </button>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Cart;