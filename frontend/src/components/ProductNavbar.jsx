import React from 'react'
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";


function ProductNavbar() {

    const navigate = useNavigate();
    const { cartCount } = useCart();

    return (
        <div className="w-100">

            <nav
                className="navbar bg-white sticky-top s"
                style={{
                    minHeight: "70px",
                    width: "100%",
                    zIndex: 1030
                }}
            >

                <div className="container-fluid px-4">

                    {/* Logo */}

                    <button
                        type="button"
                        className="btn btn-link navbar-brand fw-bold text-primary text-decoration-none mb-0"
                        onClick={() => navigate("/ProductList")}
                        style={{
                            fontSize: "24px"
                        }}
                    >
                        🛍 MyShop
                    </button>


                    {/* Cart */}

                    <button
                        type="button"
                        className="btn btn-outline-primary rounded-pill px-4 fw-semibold"
                        onClick={() => navigate("/cart")}
                    >

                        🛒 Cart

                        {cartCount > 0 && (

                            <span className="badge bg-danger rounded-pill ms-2">
                                {cartCount}
                            </span>

                        )}

                    </button>

                </div>

            </nav>

        </div>
    )
}

export default ProductNavbar