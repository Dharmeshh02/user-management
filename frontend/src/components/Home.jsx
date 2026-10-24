import React from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    return (
        <div className="min-vh-100 bg-light">

            {/* Navbar */}
            <nav
                className="navbar navbar-expand-lg"
                style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
                }}
            >
                <div className="container">

                    {/* Logo */}
                    <span
                        className="navbar-brand fw-bold"
                        style={{ color: "#2563eb" }}
                    >
                        User Management
                    </span>

                    {/* Login Button */}
                    <button
                        onClick={() => navigate("/login")}
                        className="btn px-4"
                        style={{
                            backgroundColor: "#2563eb",
                            color: "#ffffff"
                        }}
                    >
                        Login
                    </button>

                </div>
            </nav>

            {/* Hero Section */}
            <div className="container">

                <div
                    className="row justify-content-center align-items-center text-center"
                    style={{ minHeight: "80vh" }}
                >

                    <div className="col-md-8">

                        <h1
                            className="fw-bold mb-3"
                            style={{ color: "#1e3a8a" }}
                        >
                            Welcome to User Management
                        </h1>

                        <p
                            className="lead mb-4"
                            style={{ color: "#64748b" }}
                        >
                            Manage users easily and securely from one place.
                        </p>

                        <button
                            onClick={() => navigate("/login")}
                            className="btn btn-lg px-5"
                            style={{
                                backgroundColor: "#2563eb",
                                color: "#ffffff"
                            }}
                        >
                            Get Started
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Home;