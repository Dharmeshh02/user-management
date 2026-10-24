import React, { useEffect, useState } from "react";
import api from "./../api";

function Users() {

    const [users, setUsers] = useState([]);

    const [showModal, setShowModal] = useState(false);

    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "user",
    });

    const [errors, setErrors] = useState({
        name: "",
        email: "",
        phone: "",
        password: "",
        role: "",
    });

    const getUsers = () => {

        api.get("/api/admin/users")
            .then((response) => {
                setUsers(response.data.users);
            })
            .catch((error) => {
                console.log("Users Error:", error);
            });

    };

    useEffect(() => {
        getUsers();
    }, []);

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

    const validateForm = () => {

        let newErrors = {
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
        };

        if (!form.name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!form.email.trim()) {
            newErrors.email = "Email is required";
        }

        if (!form.phone.trim()) {
            newErrors.phone = "Phone is required";
        }

        // Password only required while adding user
        if (!editingId && !form.password.trim()) {
            newErrors.password = "Password is required";
        }

        if (!form.role) {
            newErrors.role = "Role is required";
        }

        setErrors(newErrors);

        return !Object.values(newErrors).some(
            (error) => error !== ""
        );
    };

    const handleSave = () => {

        if (!validateForm()) {
            return;
        }

        // Update User
        if (editingId) {

            api.put(`/api/admin/users/${editingId}`, {
                name: form.name,
                email: form.email,
                phone: form.phone,
                role: form.role,
            })
                .then((response) => {

                    // console.log(response.data);
                    setMessage("User Update successfully");

                    setShowModal(false);
                    setEditingId(null);

                    setForm({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        role: "user",
                    });

                    setErrors({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        role: "",
                    });

                    getUsers();

                })
                .catch((error) => {
                    console.log("Update User Error:", error);
                });

        } else {

            // Add User
            api.post("/api/admin/users", {
                name: form.name,
                email: form.email,
                phone: form.phone,
                password: form.password,
                role: form.role,
            })
                .then((response) => {

                    // console.log(response.data);
                    setMessage("User added successfully");
                    setShowModal(false);

                    setForm({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        role: "user",
                    });

                    setErrors({
                        name: "",
                        email: "",
                        phone: "",
                        password: "",
                        role: "",
                    });

                    getUsers();

                })
                .catch((error) => {
                    console.log("Add User Error:", error);
                });
        }
    };

    const handleEdit = (user) => {

        setEditingId(user.id);

        setForm({
            name: user.name,
            email: user.email,
            phone: user.phone || "",
            password: "",
            role: user.role,
        });

        setErrors({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
        });

        setShowModal(true);
    };

    const handleDelete = (id) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to delete this user?"
        );

        if (!confirmDelete) {
            return;
        }

        api.delete(`/api/admin/users/${id}`)
            .then((response) => {

                console.log(response.data);

                getUsers();

            })
            .catch((error) => {
                console.log("Delete User Error:", error);
            });
    };

    const handleAddUser = () => {

        setEditingId(null);

        setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "user",
        });

        setErrors({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
        });

        setShowModal(true);
    };

    const handleCloseModal = () => {

        setShowModal(false);
        setEditingId(null);

        setForm({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "user",
        });

        setErrors({
            name: "",
            email: "",
            phone: "",
            password: "",
            role: "",
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

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>Users</h2>

                <button
                    className="btn btn-primary"
                    onClick={handleAddUser}
                >
                    Add User
                </button>

            </div>

            {/* Users Table */}

            <div className="card">

                <div className="card-body">

                    <div className="table-responsive">

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Email</th>
                                    <th>Phone</th>
                                    <th>Role</th>
                                    <th>Actions</th>
                                </tr>

                            </thead>

                            <tbody>

                                {users.map((user) => (

                                    <tr key={user.id}>

                                        <td>{user.id}</td>

                                        <td>{user.name}</td>

                                        <td>{user.email}</td>

                                        <td>{user.phone}</td>

                                        <td>
                                            <span className="badge bg-primary">
                                                {user.role}
                                            </span>
                                        </td>

                                        <td>

                                            <button
                                                className="btn btn-sm btn-warning me-2"
                                                onClick={() => handleEdit(user)}
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(user.id)}
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

            {/* User Modal */}

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

                            {/* Modal Header */}

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    {editingId ? "Edit User" : "Add User"}
                                </h5>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>

                            </div>

                            {/* Modal Body */}

                            <div className="modal-body">

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
                                    />

                                    {errors.name && (
                                        <small className="text-danger">
                                            {errors.name}
                                        </small>
                                    )}

                                </div>

                                {/* Email */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        value={form.email}
                                        onChange={handleChange}
                                    />

                                    {errors.email && (
                                        <small className="text-danger">
                                            {errors.email}
                                        </small>
                                    )}

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
                                    />

                                    {errors.phone && (
                                        <small className="text-danger">
                                            {errors.phone}
                                        </small>
                                    )}

                                </div>

                                {/* Password */}

                                {!editingId && (

                                    <div className="mb-3">

                                        <label className="form-label">
                                            Password
                                        </label>

                                        <input
                                            type="password"
                                            name="password"
                                            className="form-control"
                                            value={form.password}
                                            onChange={handleChange}
                                        />

                                        {errors.password && (
                                            <small className="text-danger">
                                                {errors.password}
                                            </small>
                                        )}

                                    </div>

                                )}

                                {/* Role */}

                                <div className="mb-3">

                                    <label className="form-label">
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        className="form-control"
                                        value={form.role}
                                        onChange={handleChange}
                                    >

                                        <option value="user">
                                            User
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>

                                    </select>

                                    {errors.role && (
                                        <small className="text-danger">
                                            {errors.role}
                                        </small>
                                    )}

                                </div>

                            </div>

                            {/* Modal Footer */}

                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Close
                                </button>

                                <button
                                    type="button"
                                    className="btn btn-primary"
                                    onClick={handleSave}
                                >
                                    {editingId ? "Update" : "Save"}
                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default Users;