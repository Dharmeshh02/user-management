import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import AddToCartButton from "./AddToCartButton";
import { useCart } from "../context/CartContext.jsx";
import ProductNavbar from "./ProductNavbar.jsx";

function ProductList() {

    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    const [sort, setSort] = useState("");
    const [search, setSearch] = useState("");

    const [selectedProduct, setSelectedProduct] = useState(null);

    const [categories, setCategories] = useState([]);
    const [category, setCategory] = useState("");

    const [currentPage, setCurrentPage] = useState(1);
    const [lastPage, setLastPage] = useState(1);

    const { cartCount } = useCart();


    // Get Categories
    useEffect(() => {

        api.get("/api/user/categories")
            .then((response) => {

                setCategories(response.data.categories);
                // console.log(response)

            })
            .catch((error) => {

                console.log("Categories Error:", error);

            });

    }, []);


    // Reset page when filter/search/sort changes
    useEffect(() => {

        setCurrentPage(1);

    }, [sort, search, category]);


    // Get Products
    useEffect(() => {

        const timer = setTimeout(() => {

            api.get("/api/user/products", {
                params: {
                    sort: sort,
                    search: search,
                    category_id: category,
                    page: currentPage
                }
            })
                .then((response) => {

                    const pagination = response.data.products;

                    // console.log(response.data.products);

                    setProducts(pagination.data || []);

                    setCurrentPage(pagination.current_page || 1);

                    setLastPage(pagination.last_page || 1);

                })
                .catch((error) => {

                    console.log("Products Error:", error);

                    setProducts([]);

                });

        }, 300);

        return () => clearTimeout(timer);

    }, [sort, search, category, currentPage]);
    // Previous Page
    const handlePrevious = () => {

        if (currentPage > 1) {

            setCurrentPage(currentPage - 1);

        }

    };


    // Next Page
    const handleNext = () => {

        if (currentPage < lastPage) {

            setCurrentPage(currentPage + 1);

        }

    };


    return (

        <>

            {/*  NAVBAR  */}

            <ProductNavbar />


            {/*  PRODUCT SECTION  */}

            <div className="container-fluid py-4">

                <div className="row g-3">

                    {/*  SIDEBAR  */}

                    <div className="col-lg-2 col-md-3">

                        <div
                            className="bg-light rounded-3 p-3 h-100"
                            style={{
                                minHeight: "calc(100vh - 85px)"
                            }}
                        >

                            {/* Filter Header */}

                            <div className="mb-3">

                                <h6 className="fw-bold mb-0">
                                    🔎 Filters
                                </h6>

                                <small className="text-muted">
                                    Find products
                                </small>

                            </div>


                            <hr className="my-2" />


                            {/* Search */}

                            <div className="mb-4">

                                <label className="small fw-semibold mb-1">
                                    Search
                                </label>

                                <div className="input-group input-group-sm">

                                    <span className="input-group-text bg-white">
                                        🔍
                                    </span>

                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Search..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />

                                </div>

                            </div>


                            {/* Category */}

                            <div className="mb-4">

                                <label className="small fw-bold text-uppercase mb-2">
                                    Category
                                </label>


                                {/* All Categories */}

                                <div className="form-check mb-2">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="category"
                                        value=""
                                        checked={category === ""}
                                        onChange={() => setCategory("")}
                                    />

                                    <label className="form-check-label small">
                                        All Categories
                                    </label>

                                </div>


                                {/* Categories */}

                                {categories.map((item) => (

                                    <div
                                        className="form-check mb-2"
                                        key={item.id}
                                    >

                                        <input
                                            className="form-check-input"
                                            type="radio"
                                            name="category"
                                            value={item.id}
                                            checked={category == item.id}
                                            onChange={(e) =>
                                                setCategory(e.target.value)
                                            }
                                        />

                                        <label className="form-check-label small">
                                            {item.name}
                                        </label>

                                    </div>

                                ))}

                            </div>


                            {/* Price */}

                            <div className="mb-4">

                                <label className="small fw-bold text-uppercase mb-2">
                                    Price
                                </label>


                                <div className="form-check mb-2">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="price"
                                        value="price_asc"
                                        checked={sort === "price_asc"}
                                        onChange={(e) =>
                                            setSort(e.target.value)
                                        }
                                    />

                                    <label className="form-check-label small">
                                        Low to High
                                    </label>

                                </div>


                                <div className="form-check mb-2">

                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="price"
                                        value="price_desc"
                                        checked={sort === "price_desc"}
                                        onChange={(e) =>
                                            setSort(e.target.value)
                                        }
                                    />

                                    <label className="form-check-label small">
                                        High to Low
                                    </label>

                                </div>

                            </div>


                            {/* Clear */}

                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm w-100"
                                onClick={() => {
                                    setSearch("");
                                    setCategory("");
                                    setSort("");
                                }}
                            >
                                ✕ Clear All
                            </button>

                        </div>

                    </div>


                    {/*  PRODUCT  */}

                    <div className="col-lg-10 col-md-9">

                        {/* Product Header */}

                        <div className="d-flex justify-content-between align-items-center mb-4">

                            <div>

                                <h5 className="fw-bold mb-1">
                                    Products
                                </h5>

                                <small className="text-muted">
                                    Explore our latest products
                                </small>

                            </div>


                            {products.length > 0 && (

                                <span className="badge bg-primary rounded-pill px-3 py-2">
                                    {products.length} Products
                                </span>

                            )}

                        </div>


                        {/* Products */}

                        <div className="row g-4">

                            {products.length > 0 ? (

                                products.map((product) => (

                                    <div
                                        className="col-sm-6 col-xl-4"
                                        key={product.id}
                                    >

                                        <div
                                            className="card h-100 border-0 shadow-sm overflow-hidden"
                                            style={{
                                                borderRadius: "14px"
                                            }}
                                        >

                                            {/* Image */}

                                            <div
                                                className="position-relative bg-light"
                                                style={{
                                                    height: "230px"
                                                }}
                                            >

                                                {product.image ? (

                                                    <img
                                                        src={`http://localhost:8000/storage/${product.image}`}
                                                        className="w-100 h-100"
                                                        alt={product.name}
                                                        style={{
                                                            objectFit: "cover"
                                                        }}
                                                    />

                                                ) : (

                                                    <div className="h-100 d-flex align-items-center justify-content-center text-muted">

                                                        <div className="text-center">

                                                            <div
                                                                style={{
                                                                    fontSize: "40px"
                                                                }}
                                                            >
                                                                🖼️
                                                            </div>

                                                            <small>
                                                                No Image
                                                            </small>

                                                        </div>

                                                    </div>

                                                )}


                                                {/* Stock */}

                                                <div className="position-absolute top-0 end-0 m-2">

                                                    {product.stock > 0 ? (

                                                        <span className="badge bg-success rounded-pill px-2 py-1">
                                                            In Stock
                                                        </span>

                                                    ) : (

                                                        <span className="badge bg-danger rounded-pill px-2 py-1">
                                                            Out Of Stock
                                                        </span>

                                                    )}

                                                </div>

                                            </div>


                                            {/* Product Body */}

                                            <div className="card-body p-3 d-flex flex-column">

                                                <h6 className="fw-bold mb-2">
                                                    {product.name}
                                                </h6>


                                                <div className="mb-2">

                                                    <span className="badge bg-light text-dark border">
                                                        {product.category?.name ?? "Uncategorized"}
                                                    </span>

                                                </div>


                                                <h5 className="text-primary fw-bold mb-3">
                                                    ₹ {product.price}
                                                </h5>


                                                {/* Buttons */}

                                                <div className="d-flex gap-2 mt-auto">

                                                    <button
                                                        type="button"
                                                        className="btn btn-sm btn-outline-primary flex-fill"
                                                        onClick={() =>
                                                            navigate(`/product/${product.id}`)
                                                        }
                                                        style={{
                                                            borderRadius: "8px"
                                                        }}
                                                    >
                                                        View Details
                                                    </button>


                                                    <div className="flex-fill">

                                                        <AddToCartButton
                                                            product={product}
                                                        />

                                                    </div>

                                                </div>

                                            </div>

                                        </div>

                                    </div>

                                ))

                            ) : (

                                <div className="col-12">

                                    <div className="text-center py-5 bg-light rounded-4">

                                        <div
                                            style={{
                                                fontSize: "45px"
                                            }}
                                        >
                                            🔍
                                        </div>

                                        <h5 className="fw-bold mt-3">
                                            No Products Found
                                        </h5>

                                        <p className="text-muted mb-0">
                                            Try changing your search or filters.
                                        </p>

                                    </div>

                                </div>

                            )}

                        </div>


                        {/* Pagination */}

                        {lastPage > 1 && (

                            <div className="d-flex justify-content-center align-items-center mt-5 mb-4">

                                <button
                                    className="btn btn-sm btn-outline-secondary px-3"
                                    disabled={currentPage === 1}
                                    onClick={handlePrevious}
                                >
                                    ← Previous
                                </button>


                                <span className="mx-3 small fw-semibold">
                                    Page {currentPage} of {lastPage}
                                </span>


                                <button
                                    className="btn btn-sm btn-primary px-3"
                                    disabled={currentPage === lastPage}
                                    onClick={handleNext}
                                >
                                    Next →
                                </button>

                            </div>

                        )}

                    </div>

                </div>

            </div>
        </>

    );

}

export default ProductList;