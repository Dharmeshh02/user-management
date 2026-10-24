import React, { useEffect, useState } from "react";
import api from "./../api";

function Categories() {

    const [categories, setCategories] = useState([]);

    const [showModal, setShowModal] = useState(false);
    const [message, setMessage] = useState("");


    const [form, setForm] = useState({
        name: "",
        description: "",
    });

    const [editId, setEditId] = useState(null);

    const [errors, setErrors] = useState({
        name: "",
        description: "",
    });

    useEffect(() => {

        fetchCategories();

    }, []);

    // api calling
    const fetchCategories = () => {

        api.get("/api/admin/categories")
            .then((response) => {
                setCategories(response.data.categories);
            })
            .catch((error) => {

                console.log("Fetch Error:", error);

            });
    };

    // input change
    const handleChange = (e) => {

        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    // add Categories + validation
    const handleAddCategory = () => {

        let newErrors = {
            name: "",
            description: "",
        };

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);

        if (newErrors.name || newErrors.description) {
            return;
        }

        api.post("/api/admin/categories", {
            name: form.name,
            description: form.description,
        })
            .then((response) => {

                setMessage(
                    response.data.message || "Category added successfully"
                );

                fetchCategories();

                setForm({
                    name: "",
                    description: "",
                });

                setErrors({
                    name: "",
                    description: "",
                });

                setShowModal(false);
            })
            .catch((error) => {

                console.log("Add Error:", error);

            });
    };

    // edit Categories + validation
    const handleEditCategory = () => {

        let newErrors = {
            name: "",
            description: "",
        };

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.description.trim()) {
            newErrors.description = "Description is required";
        }

        setErrors(newErrors);

        if (newErrors.name || newErrors.description) {
            return;
        }

        api.put(`/api/admin/categories/${editId}`, {
            name: form.name,
            description: form.description,
        })
            .then((response) => {
                setMessage(
                    response.data.message || "Upadte Category successfully"
                );

                // console.log(response.data);

                fetchCategories();

                setForm({
                    name: "",
                    description: "",
                });

                setEditId(null);

                setErrors({
                    name: "",
                    description: "",
                });

                setShowModal(false);
            })
            .catch((error) => {

                console.log("Update Error:", error);

            });
    };

    // Delete Categories
    const handleDeleteCategory = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this category?"
        );

        if (!confirmDelete) {
            return;
        }

        api.delete(`/api/admin/categories/${id}`)
            .then((response) => {

                console.log(response.data);

                fetchCategories();

            })
            .catch((error) => {

                console.log("Delete Error:", error);

            });
    };

    // StatusToggle Categories
    const handleStatusToggle = (category) => {
        api.put(`/api/admin/categories/${category.id}/status`)
            .then((response) => {
                console.log(response.data);
                fetchCategories();
            })
            .catch((error) => {
                console.log("Status Update Error:", error);
                // console.log(error.response?.data);
            });
    };

    return (
        <div className="container-fluid mt-4">
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

            <div className="d-flex justify-content-between align-items-center mb-3">

                <h3>Categories</h3>

                <button
                    className="btn btn-primary"
                    onClick={() => {

                        // setEditId(null);

                        // setForm({
                        //     name: "",
                        //     description: "",
                        // });

                        // setErrors({
                        //     name: "",
                        //     description: "",
                        // });

                        setShowModal(true);
                    }}
                >
                    Add Category
                </button>

            </div>

            <div className="card">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Description</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {categories.map((category) => (

                                    <tr key={category.id} >

                                        <td>{category.id}</td>

                                        <td>{category.name}</td>

                                        <td>{category.description}</td>

                                        <td>

                                            {category.status ? (
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
                                                onClick={() => {

                                                    setEditId(category.id);

                                                    setForm({
                                                        ...form,
                                                        name: category.name,
                                                        description: category.description,
                                                    });

                                                    // setErrors({
                                                    //     name: "",
                                                    //     description: "",
                                                    // });

                                                    setShowModal(true);
                                                }}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger me-2"
                                                onClick={() =>
                                                    handleDeleteCategory(category.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                            <button
                                                className={`btn btn-sm ${category.status
                                                    ? "btn-danger" // true 1
                                                    : "btn-success" // false 0
                                                    }`}
                                                onClick={() =>
                                                    handleStatusToggle(category)
                                                }
                                            >
                                                {category.status
                                                    ? "Deactivate"
                                                    : "Activate"}
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* Add Category Modal */}

            {showModal && (

                <div
                    className="modal show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    {editId
                                        ? "Edit Category"
                                        : "Add Category"}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setShowModal(false)}
                                ></button>

                            </div>

                            <div className="modal-body">

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
                                    />

                                    {errors.name && (
                                        <small className="text-danger">
                                            {errors.name}
                                        </small>
                                    )}

                                </div>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Description
                                    </label>

                                    <textarea
                                        name="description"
                                        className="form-control"
                                        value={form.description}
                                        onChange={handleChange}
                                    ></textarea>

                                    {errors.description && (
                                        <small className="text-danger">
                                            {errors.description}
                                        </small>
                                    )}

                                </div>

                            </div>

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>

                                {editId ? (

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleEditCategory}
                                    >
                                        Update
                                    </button>


                                ) : (

                                    <button
                                        type="button"
                                        className="btn btn-primary"
                                        onClick={handleAddCategory}
                                    >
                                        Save
                                    </button>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Categories;