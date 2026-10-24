import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import api from "../api";

function Checkout() {

    const navigate = useNavigate();
    const { getCartCount } = useCart();
    // console.log(getCartCount);

    // Cart
    const [cartItems, setCartItems] = useState([]);

    // Delivery Form
    const [form, setForm] = useState({
        name: "",
        phone: "",
        address: "",
        city: "",
        state: "",
        country: "",
        pincode: "",
    });

    // Payment
    const [paymentMethod, setPaymentMethod] = useState("cod");

    // Loading
    const [loading, setLoading] = useState(true);

    // Place Order Loading
    const [placingOrder, setPlacingOrder] = useState(false);


    // GET CART 

    useEffect(() => {

        api.get("/api/user/cart")
            .then((response) => {

                console.log("Cart Response:", response.data);

                setCartItems(response.data.cart || []);
                // console.log(response.data.cart)
                // console.log(response)


            })
            .catch((error) => {

                console.log("Cart Error:", error);

            })
            .finally(() => {

                setLoading(false);

            });

    }, []);


    // HANDLE INPUT 

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value
        });

    };


    // CALCULATE SUBTOTAL 

    const subtotal = cartItems.reduce(
        (total, item) => {

            return total +
                Number(item.product.price) *
                Number(item.quantity);

        },
        0
    );


    // Shipping

    const shipping = 100;


    // Grand Total

    const grandTotal = subtotal + shipping;


    // PLACE ORDER 

    const handlePlaceOrder = async (e) => {

        e.preventDefault();

        try {

            setPlacingOrder(true);

            const response = await api.post(
                "/api/user/orders",
                {
                    name: form.name,
                    phone: form.phone,
                    address: form.address,
                    city: form.city,
                    state: form.state,
                    country: form.country,
                    pincode: form.pincode,
                    payment_method: paymentMethod
                }
            );

            // console.log(response.data.cart)
            // console.log(response)
            // console.log("Cart count refreshed");
            alert("Order placed successfully!");

            await getCartCount();// update conunt ke liye
            // Go to Product List
            navigate("/ProductList");


        } catch (error) {

            console.log(
                "Order Error:",
                error
            );


            // Validation errors
            if (error.response?.data?.errors) {

                console.log(
                    "Validation Errors:",
                    error.response.data.errors
                );

            }


            alert(
                error.response?.data?.message ||
                "Unable to place order"
            );


        } finally {

            setPlacingOrder(false);

        }

    };


    //  LOADING 

    if (loading) {

        return (

            <div className="container py-5 text-center">

                <h5>
                    Loading checkout...
                </h5>

            </div>

        );

    }


    // EMPTY CART 

    if (cartItems.length === 0) {

        return (

            <div className="container py-5">

                <div className="text-center py-5">

                    <h3 className="fw-bold">
                        Your cart is empty
                    </h3>

                    <p className="text-muted">
                        Add some products before checkout.
                    </p>

                    <button
                        className="btn btn-primary"
                        onClick={() => navigate("/ProductList")}
                    >
                        Continue Shopping
                    </button>

                </div>

            </div>

        );

    }


    return (

        <div className="container py-5">


            {/* HEADING*/}

            <div className="text-center mb-5">

                <h2 className="fw-bold">
                    Checkout
                </h2>

                <p className="text-muted">
                    Complete your order
                </p>

            </div>


            <div className="row g-4">


                {/*DELIVERY ADDRESS  */}

                <div className="col-lg-7">

                    <div className="card border-0 shadow-sm">

                        <div className="card-body p-4">

                            <h4 className="fw-bold mb-4">
                                Delivery Address
                            </h4>


                            <form onSubmit={handlePlaceOrder}>


                                {/* Name */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Enter your name"
                                    />

                                </div>


                                {/* Phone */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        name="phone"
                                        className="form-control"
                                        value={form.phone}
                                        onChange={handleChange}
                                        placeholder="Enter phone number"
                                    />

                                </div>


                                {/* Address */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        className="form-control"
                                        rows="3"
                                        value={form.address}
                                        onChange={handleChange}
                                        placeholder="Enter delivery address"
                                    ></textarea>

                                </div>


                                {/* City + State */}

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            City
                                        </label>

                                        <input
                                            type="text"
                                            name="city"
                                            className="form-control"
                                            value={form.city}
                                            onChange={handleChange}
                                            placeholder="Enter city"
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            State
                                        </label>

                                        <input
                                            type="text"
                                            name="state"
                                            className="form-control"
                                            value={form.state}
                                            onChange={handleChange}
                                            placeholder="Enter state"
                                        />

                                    </div>

                                </div>


                                {/* Country + Pincode */}

                                <div className="row">

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Country
                                        </label>

                                        <input
                                            type="text"
                                            name="country"
                                            className="form-control"
                                            value={form.country}
                                            onChange={handleChange}
                                            placeholder="Enter country"
                                        />

                                    </div>


                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">
                                            Pincode
                                        </label>

                                        <input
                                            type="text"
                                            name="pincode"
                                            className="form-control"
                                            value={form.pincode}
                                            onChange={handleChange}
                                            placeholder="Enter pincode"
                                        />

                                    </div>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>


                {/* ORDER SUMMARY  */}

                <div className="col-lg-5">
                    <div className="card">
                        <div className="card-body">

                            <h4>Order Summary</h4>

                            {cartItems.map((item) => (
                                <div
                                    key={item.id}
                                    className="d-flex justify-content-between mb-3"
                                >
                                    <div>
                                        <h6>{item.product.name}</h6>
                                        <small>Qty: {item.quantity}</small>
                                    </div>

                                    <span>
                                        ₹{(
                                            Number(item.product.price) *
                                            Number(item.quantity)
                                        )}
                                    </span>
                                </div>
                            ))}

                            <hr />

                            <div className="d-flex justify-content-between">
                                <span>Subtotal</span>
                                <span>₹{subtotal}</span>
                            </div>

                            <div className="d-flex justify-content-between mb-3">
                                <span>Shipping</span>
                                <span>₹{shipping}</span>
                            </div>

                            <hr />

                            <div className="d-flex justify-content-between mb-4">
                                <strong>Grand Total</strong>
                                <strong>₹{grandTotal}</strong>
                            </div>

                            <h6>Payment Method</h6>

                            <div className="form-check mb-4">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payment_method"
                                    value="cod"
                                    checked={paymentMethod === "cod"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <label className="form-check-label">
                                    Cash on Delivery
                                </label>
                            </div>

                            <div className="form-check">
                                <input
                                    className="form-check-input"
                                    type="radio"
                                    name="payment_method"
                                    value="online"
                                    checked={paymentMethod === "online"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />

                                <label className="form-check-label">
                                    Online Payment
                                </label>
                            </div>

                            <button
                                type="button"
                                className="btn btn-primary w-100"
                                onClick={handlePlaceOrder}
                            // disabled={placingOrder}
                            >
                                {placingOrder ? "Placing Order..." : "Place Order"}
                            </button>

                        </div>
                    </div>
                </div>

            </div>

        </div>

    );

}

export default Checkout;
