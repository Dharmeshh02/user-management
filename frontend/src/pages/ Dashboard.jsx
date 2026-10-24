import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../api";
import Profile from "./Profile.jsx";
import Users from "./../components/Users.jsx";
import Categories from "./../components/Categories.jsx";
import Products from "./../components/Products.jsx";
import ProductList from "../components/ProductList.jsx";
import Orders from "../components/Orders.jsx";
import AdminOrders from "./../components/AdminOrders.jsx";

function Dashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [activeComponent, setActiveComponent] = useState("dashboard");

    useEffect(() => {

        api.get("/api/profile")
            .then((response) => {
                // console.log(response);
                setUser(response.data.user);
            })
            .catch((error) => {
                console.log(error);
            });

    }, []);

    const handleLogout = () => {

        const isAdmin = user?.role === "admin";

        if (isAdmin) {

            const confirmLogout = window.confirm(
                "Are you sure you want to logout?"
            );

            if (!confirmLogout) {
                return;
            }
        }

        api.post("/api/logout")
            .then(() => {
                navigate("/login");
            })
            .catch((error) => {
                console.log("Logout Error:", error);
            });
    };

    const handleCategories = () => {
        setActiveComponent("categories");
    };

    const handleDashboard = () => {
        setActiveComponent("dashboard");
    };

    const handleProfile = () => {

        if (user?.role === "admin" || user?.role === "customer") {
            setActiveComponent("profile");
        }

    };

    const handleUsers = () => {
        setActiveComponent("users");
    };
    const handleProducts = () => {
        setActiveComponent("products");
    };
    const handleProductList = () => {
        navigate("/productlist");
    };

    const handleOrders = () => {
        setActiveComponent("orders");
    };
    const handleAdminOrders = () => {
        setActiveComponent("orders");
    };

    if (!user) {

        return (
            <div className="container mt-5">
                <h4 className="text-primary">
                    Loading...
                </h4>
            </div>
        );

    }

    const isAdmin = user.role === "admin";

    return (
        <div className="min-vh-100 bg-light">

            {/* Common Navbar */}

            <nav
                className={
                    isAdmin
                        ? "navbar navbar-dark bg-dark px-4"
                        : "navbar navbar-dark bg-dark shadow-sm"
                }
            >

                <div
                    className={
                        isAdmin
                            ? "d-flex justify-content-between align-items-center w-100"
                            : "container"
                    }
                >

                    <span className="navbar-brand fw-bold mb-0">
                        {isAdmin
                            ? "Admin Panel"
                            : "User Management"}
                    </span>

                    <div className="d-flex align-items-center">
                        {/* Products - User only

                        {!isAdmin && (
                            <button
                                className="btn btn-outline-light btn-sm me-2"
                                onClick={handleProductList}
                            >
                                Products
                            </button>
                        )} */}

                        {/* Profile */}

                        <button
                            className="btn btn-outline-light btn-sm me-2"
                            onClick={handleProfile}
                        >
                            Profile
                        </button>

                        {/* Logout */}

                        <button
                            className="btn btn-danger btn-sm"
                            onClick={handleLogout}
                        >
                            Logout
                        </button>

                    </div>

                </div>

            </nav>


            {/* ADMIN DASHBOARD */}

            {isAdmin ? (

                <div className="container-fluid">

                    <div className="row">

                        {/* Sidebar */}

                        <div
                            className="col-md-3 col-lg-2 min-vh-100 p-3"
                            style={{
                                backgroundColor: "#1e293b"
                            }}
                        >

                            <h5 className="text-white mb-4">
                                Menu
                            </h5>

                            <button
                                onClick={handleDashboard}
                                className="btn w-100 text-start mb-2"
                                style={{
                                    backgroundColor: "#334155",
                                    color: "white"
                                }}
                            >
                                Dashboard
                            </button>

                            <button
                                onClick={handleCategories}
                                className="btn w-100 text-start mb-2"
                                style={{
                                    backgroundColor: "#334155",
                                    color: "white"
                                }}
                            >
                                Categories
                            </button>

                            <button
                                onClick={handleUsers}
                                className="btn w-100 text-start mb-2"
                                style={{
                                    backgroundColor: "#334155",
                                    color: "white"
                                }}
                            >
                                Users
                            </button>

                            <button
                                onClick={handleProducts}
                                className="btn w-100 text-start mb-2"
                                style={{
                                    backgroundColor: "#334155",
                                    color: "white"
                                }}
                            >
                                Products
                            </button>

                            {/* Orders */}

                            <button
                                onClick={handleAdminOrders}
                                className="btn w-100 text-start mb-2"
                                style={{
                                    backgroundColor: "#334155",
                                    color: "white"
                                }}
                            >
                                Orders
                            </button>

                        </div>

                        {/* Main Content */}

                        <div className="col-md-9 col-lg-10 p-4">

                            {/* Dashboard */}

                            {activeComponent === "dashboard" && (
                                <div className="text-center">
                                    <h1 className="mb-3">
                                        Admin Dashboard
                                    </h1>

                                    <p>
                                        Welcome {user.name}
                                    </p>
                                </div>
                            )}

                            {/* Categories */}

                            {activeComponent === "categories" && (
                                <Categories />
                            )}

                            {/* Users */}

                            {activeComponent === "users" && (
                                <Users />
                            )}

                            {/* Products */}

                            {activeComponent === "products" && (
                                <Products />
                            )}

                            {/* Orders */}

                            {activeComponent === "orders" && (
                                <AdminOrders />
                            )}

                            {/* Profile */}

                            {activeComponent === "profile" && (
                                <Profile
                                    isAdmin={user.role === "admin"}
                                    setUser={setUser}
                                    setActiveComponent={setActiveComponent}
                                />
                            )}

                        </div>

                    </div>

                </div>

            ) : (

                /* USER DASHBOARD */

                <div>

                    {/* Dashboard */}

                    {activeComponent === "dashboard" && (
                        <div className="min-vh-100 bg-light d-flex flex-column">

                            {/* Hero banner */}
                            <div className="bg-primary bg-gradient text-white text-center py-5 px-3 shadow">

                                <div className="py-4">

                                    <h1 className="display-5 fw-bold mb-2">
                                        Welcome <span className="text-warning">{user.name}</span>
                                    </h1>

                                    <p className="lead text-white-50 mb-0">
                                        What would you like to do today?
                                    </p>

                                </div>

                            </div>

                            {/* Content area */}
                            <div className="container-fluid flex-grow-1 px-4 px-md-5 py-5">

                                <h6 className="text-uppercase text-muted fw-semibold small mb-4">
                                    Quick Access
                                </h6>

                                <div className="row g-4">

                                    {/* Products */}
                                    <div className="col-12 col-md-6 col-xl-4">

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary border-2 rounded-4 w-100 text-start p-4 d-flex align-items-center shadow-sm"
                                            onClick={handleProductList}
                                        >

                                            <div className="bg-white rounded-3 p-3 me-3 fs-2 lh-1 shadow-sm">
                                                🛍️
                                            </div>

                                            <div className="flex-grow-1">

                                                <h4 className="fw-bold mb-1">
                                                    Products
                                                </h4>

                                                <p className="small opacity-75 mb-0">
                                                    View & Manage Products
                                                </p>

                                            </div>

                                            <span className="fs-2 ms-2">›</span>

                                        </button>

                                    </div>


                                    {/* My Orders */}
                                    <div className="col-12 col-md-6 col-xl-4">

                                        <button
                                            type="button"
                                            className="btn btn-outline-primary border-2 rounded-4 w-100 text-start p-4 d-flex align-items-center shadow-sm"
                                            onClick={handleOrders}
                                        >

                                            <div className="bg-white rounded-3 p-3 me-3 fs-2 lh-1 shadow-sm">
                                                📦
                                            </div>

                                            <div className="flex-grow-1">

                                                <h4 className="fw-bold mb-1">
                                                    My Orders
                                                </h4>

                                                <p className="small opacity-75 mb-0">
                                                    View Your Orders
                                                </p>

                                            </div>

                                            <span className="fs-2 ms-2">›</span>

                                        </button>

                                    </div>

                                </div>

                                <div className="row g-3 mt-2">

                                    {/* Role */}

                                </div>

                            </div>

                        </div>
                    )}


                    {/* Products */}

                    {activeComponent === "ProductList" && (
                        <ProductList />
                    )}


                    {/* Orders */}

                    {activeComponent === "orders" && (
                        <Orders />
                    )}

                </div>

            )}

        </div>
    );
}

export default Dashboard;