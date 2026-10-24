import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
// import ProductNavbar from "./ProductNavbar";
import ProductNavbar from "./ProductNavbar.jsx";

import api from "../api";

function ProductDetails() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [product, setProduct] = useState(null);


    useEffect(() => {

        api.get(`/api/user/products/${id}`)
            .then((response) => {

                setProduct(response.data.product);

            })
            .catch((error) => {

                console.log("Product Details Error:", error);

            });

    }, [id]);

    // const handleAddToCart = () => {

    //     api.post("/api/user/cart/items", {
    //         product_id: product.id,
    //         quantity: 1
    //     })
    //         .then((response) => {

    //             // console.log("Cart Response:", response.data);

    //             alert("Product added to cart");
    //             navigate("/Cart");

    //         })
    //         .catch((error) => {

    //             console.log("Cart Error:", error);

    //             if (error.response) {
    //                 alert(error.response.data.message);
    //             }

    //         });
    // };
    if (!product) {
        return <div className="container mt-4">Loading...</div>;
    }

    return (

        <>

            <div className="min-vh-100 d-flex flex-column bg-whie">

                {/* Header */}
                <div className="">

                    <ProductNavbar />

                    <button
                        type="button"
                        className="btn-close btn-close-white"
                        aria-label="Close"
                        onClick={() => navigate("/dashboard")}
                    ></button>

                </div>

                {/* Content */}

                <div className="container px-3 px-md-4 py-3 py-md-4">

                    <div className="card border-0 shadow-sm rounded-4">

                        <div className="card-body p-3 p-md-4">

                            {/* Name and price */}

                            <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-3">

                                <div>

                                    <p className="text-uppercase text-muted fw-semibold small mb-1">
                                        Product
                                    </p>

                                    <h2 className="fw-bold mb-0">
                                        {product.name}
                                    </h2>

                                </div>


                                <div className="text-md-end">

                                    <p className="text-muted small mb-0">
                                        Price
                                    </p>

                                    <h3 className="fw-bold text-success mb-0">
                                        ₹ {product.price}
                                    </h3>

                                </div>

                            </div>


                            <hr className="my-3" />


                            {/* Info tiles */}

                            <div className="row g-3">

                                <div className="col-12 col-md-6 col-xl-4">

                                    <div className="bg-light border rounded-3 p-3 h-100">

                                        <p className="text-muted small mb-1">
                                            SKU
                                        </p>

                                        <p className="fw-semibold mb-0">
                                            {product.sku}
                                        </p>

                                    </div>

                                </div>


                                <div className="col-12 col-md-6 col-xl-4">

                                    <div className="bg-light border rounded-3 p-3 h-100">

                                        <p className="text-muted small mb-1">
                                            Category ID
                                        </p>

                                        <p className="fw-semibold mb-0">
                                            {product.category_id}
                                        </p>

                                    </div>

                                </div>


                                <div className="col-12 col-md-6 col-xl-4">

                                    <div className="bg-light border rounded-3 p-3 h-100">

                                        <p className="text-muted small mb-2">
                                            Stock
                                        </p>

                                        {product.stock > 0 ? (

                                            <span className="badge rounded-pill bg-success px-3 py-2">
                                                {product.stock} In Stock
                                            </span>

                                        ) : (

                                            <span className="badge rounded-pill bg-danger px-3 py-2">
                                                Out of Stock
                                            </span>

                                        )}

                                    </div>

                                </div>

                            </div>

                        </div>


                        {/* Action */}

                        <div className="card-footer bg-white border-0 px-3 px-md-4 pb-3 pt-0">

                            <div className="d-grid d-sm-block">

                                {product.stock > 0 ? (

                                    <AddToCartButton product={product} />

                                ) : (

                                    <button
                                        type="button"
                                        className="btn btn-secondary px-4"
                                        disabled
                                    >
                                        Out of Stock
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>



            </div>
        </>
    );
}

export default ProductDetails;