import React, { useEffect, useState } from "react";
import api from "./../api";

function Products() {

    const [products, setProducts] = useState([]);
    const [message, setMessage] = useState("");

    const [showModal, setShowModal] = useState(false);
    const [editingId, setEditingId] = useState(null);



    const [form, setForm] = useState({
        name: "",
        sku: "",
        category_id: "",
        price: "",
        stock: "",
        image: null,
    });

    const [errors, setErrors] = useState({
        name: "",
        sku: "",
        category_id: "",
        price: "",
        stock: "",
    });

    const validateForm = () => {

        const newErrors = {
            name: "",
            sku: "",
            category_id: "",
            price: "",
            stock: "",
        };

        if (!form.name.trim()) {
            newErrors.name = "Product name is required";
        }

        if (!form.sku.trim()) {
            newErrors.sku = "SKU is required";
        }

        if (!form.category_id) {
            newErrors.category_id = "Category is required";
        }

        if (!form.price) {
            newErrors.price = "Price is required";
        } else if (Number(form.price) <= 0) {
            newErrors.price = "Price must be greater than 0";
        }

        if (form.stock === "") {
            newErrors.stock = "Stock is required";
        } else if (Number(form.stock) < 0) {
            newErrors.stock = "Stock cannot be negative";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(
            (error) => error !== ""
        );
    };


    // Get Products

    const getProducts = () => {

        api.get("/api/admin/products")
            .then((response) => {

                setProducts(response.data.products);

            })
            .catch((error) => {

                console.log("Products Error:", error);

            });

    };


    useEffect(() => {

        getProducts();

    }, []);


    // Handle Input Change

    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });

        setErrors({
            ...errors,
            [e.target.name]: "",
        });

    };

    //  Update Product + add Product
    const handleSave = () => {

        if (!validateForm()) {
            return;
        }

        const formData = new FormData();

        formData.append("name", form.name);
        formData.append("sku", form.sku);
        formData.append("category_id", form.category_id);
        formData.append("price", form.price);
        formData.append("stock", form.stock);
        formData.append("_method", "PUT");

        if (form.image) {
            formData.append("image", form.image);
        }
        if (editingId) {

            api.post(`/api/admin/products/${editingId}`, formData)
                .then((response) => {

                    setMessage("Product updated successfully");
                    // console.log(response.data)
                    setShowModal(false);
                    setEditingId(null);

                    setForm({
                        name: "",
                        sku: "",
                        category_id: "",
                        price: "",
                        stock: "",
                        image: null,
                    });

                    getProducts();

                })
                .catch((error) => {

                    console.log("Update Product Error:", error);
                    console.log(error.response?.data);

                });

        } else {
            //Add Product
            api.post("/api/admin/products", formData)
                .then((response) => {

                    // console.log(response.data);

                    setMessage("Product added successfully");
                    setShowModal(false);

                    setForm({
                        name: "",
                        sku: "",
                        category_id: "",
                        price: "",
                        stock: "",
                        image: null,
                    });

                    getProducts();

                })
                .catch((error) => {

                    console.log("Create Product Error:", error);
                    console.log(error.response?.data);

                });
        }
    };

    const handleAddProduct = () => {

        setEditingId(null);

        setForm({
            name: "",
            sku: "",
            category_id: "",
            price: "",
            stock: "",
        });

        setErrors({
            name: "",
            sku: "",
            category_id: "",
            price: "",
            stock: "",
        });

        setShowModal(true);

    };



    // Close Modal
    const handleCloseModal = () => {

        setShowModal(false);
        setEditingId(null);

        setForm({
            name: "",
            sku: "",
            category_id: "",
            price: "",
            stock: "",
        });

    };


    // Edit Product
    const handleEdit = (product) => {

        setEditingId(product.id);

        setForm({
            name: product.name,
            sku: product.sku,
            category_id: product.category_id,
            price: product.price,
            stock: product.stock,
        });

        setShowModal(true);

    };


    // Delete Product
    const handleDelete = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmDelete) {
            return;
        }

        api.delete(`/api/admin/products/${id}`)
            .then((response) => {

                console.log(response.data);

                getProducts();

            })
            .catch((error) => {

                console.log("Delete Product Error:", error);

            });

    };


    // Status Toggle
    const handleStatusToggle = (product) => {
        api.patch(`/api/admin/products/${product.id}/status`)
            .then((response) => {
                // console.log(response.data);
                getProducts();
            })
            .catch((error) => {
                console.log("Status Update Error:", error);
            });
    };


    return (

        <div>
            {message && (
                <div
                    className="alert alert-success alert-dismissible fade show shadow-sm"
                    style={{
                        position: "fixed",
                        top: "20px",
                        right: "20px",
                        zIndex: 9999,
                        minWidth: "280px"
                    }}
                >
                    {message}

                    <button
                        type="button"
                        className="btn-close"
                        onClick={function () {
                            setMessage("");
                        }}
                    ></button>
                </div>
            )}

            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>
                    Product Management
                </h3>

                <button
                    className="btn btn-primary"
                    onClick={handleAddProduct}
                >
                    + Add Product
                </button>

            </div>



            {/* Products Table */}

            <div className="table-responsive">

                <table className="table table-bordered table-hover">

                    <thead className="table-light">

                        <tr>

                            <th>ID</th>
                            <th>Image</th>
                            <th>Name</th>
                            <th>SKU</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Status</th>
                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {products.map((product) => (

                            <tr key={product.id}>

                                <td>
                                    {product.id}
                                </td>

                                {/* Image */}
                                <td>

                                    {product.image ? (

                                        <img
                                            src={`http://localhost:8000/storage/${product.image}`}
                                            alt={product.name}
                                            style={{
                                                width: "50px",
                                                height: "50px",
                                                objectFit: "cover"
                                            }}
                                            className="rounded"
                                        />

                                    ) : (

                                        <span>
                                            No Image
                                        </span>

                                    )}

                                </td>

                                <td>
                                    {product.name}
                                </td>

                                <td>
                                    {product.sku}
                                </td>

                                <td>
                                    {product.category
                                        ? product.category.name
                                        : product.category_id}
                                </td>

                                <td>
                                    ₹{product.price}
                                </td>

                                <td>
                                    {product.stock}
                                </td>

                                <td>

                                    {product.status ? (

                                        <span className="badge bg-success">
                                            Active
                                        </span>

                                    ) : (

                                        <span className="badge bg-danger">
                                            Inactive
                                        </span>

                                    )}

                                </td>

                                <td>

                                    <button
                                        className="btn btn-sm btn-warning me-2"
                                        onClick={() => handleEdit(product)}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        className="btn btn-sm btn-danger me-2"
                                        onClick={() => handleDelete(product.id)}
                                    >
                                        Delete
                                    </button>

                                    <button
                                        className={
                                            product.status
                                                ? "btn btn-sm btn-success"
                                                : "btn btn-sm btn-secondary"
                                        }
                                        onClick={() => handleStatusToggle(product)}
                                    >
                                        {product.status ? "Active" : "Inactive"}
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>


                </table>

            </div>


            {/* Add / Edit Product Modal */}

            {showModal && (

                <div
                    className="modal d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">


                            {/* Header */}

                            <div className="modal-header">

                                <h5 className="modal-title">

                                    {editingId
                                        ? "Edit Product"
                                        : "Add Product"}

                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>

                            </div>


                            {/* Body */}

                            <div className="modal-body">


                                {/* Product Name */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Product Name
                                    </label>

                                    <input
                                        type="text"
                                        name="name"
                                        className="form-control"
                                        value={form.name}
                                        onChange={handleChange}
                                    />

                                    {errors.name && (

                                        <div className="text-danger">
                                            {errors.name}
                                        </div>

                                    )}

                                </div>


                                {/* SKU */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        SKU
                                    </label>

                                    <input
                                        type="text"
                                        name="sku"
                                        className="form-control"
                                        value={form.sku}
                                        onChange={handleChange}
                                    />

                                    {errors.sku && (

                                        <div className="text-danger">
                                            {errors.sku}
                                        </div>

                                    )}

                                </div>


                                {/* Category */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Category
                                    </label>

                                    <select
                                        name="category_id"
                                        className="form-select"
                                        value={form.category_id}
                                        onChange={handleChange}
                                    >

                                        <option value="">
                                            Select Category
                                        </option>

                                        <option value="1">
                                            Mobile
                                        </option>

                                        <option value="2">
                                            Laptop
                                        </option>

                                    </select>

                                    {errors.category_id && (

                                        <div className="text-danger">
                                            {errors.category_id}
                                        </div>

                                    )}

                                </div>


                                {/* Price */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Price
                                    </label>

                                    <input
                                        type="number"
                                        name="price"
                                        className="form-control"
                                        value={form.price}
                                        onChange={handleChange}
                                    />

                                    {errors.price && (

                                        <div className="text-danger">
                                            {errors.price}
                                        </div>

                                    )}

                                </div>


                                {/* Stock */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Stock
                                    </label>

                                    <input
                                        type="number"
                                        name="stock"
                                        className="form-control"
                                        value={form.stock}
                                        onChange={handleChange}
                                    />

                                    {errors.stock && (

                                        <div className="text-danger">
                                            {errors.stock}
                                        </div>

                                    )}

                                </div>


                                {/* Image */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Product Image
                                    </label>

                                    <input
                                        type="file"
                                        className="form-control"
                                        onChange={(e) =>
                                            setForm({
                                                ...form,
                                                image: e.target.files[0]
                                            })
                                        }
                                    />

                                </div>

                            </div>


                            {/* Footer */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >

                                    {editingId
                                        ? "Update Product"
                                        : "Add Product"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>

    );

}

export default Products;