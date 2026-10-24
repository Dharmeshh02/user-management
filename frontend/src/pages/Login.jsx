import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../api";

function Login() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            await api.get("/sanctum/csrf-cookie");

            const response = await api.post("/api/login", {
                email: form.email,
                password: form.password,
            });

            const user = response.data.user;
            // console.log("USER:", user);
            // console.log("ROLE:", user.role);
            localStorage.setItem("user", JSON.stringify(user));

            navigate("/dashboard"); //dono role ke liye same route

        } catch (error) {
            console.log("Login Error:", error);
            // console.log("Error Response:", error.response?.data);
        }
    };

    return (
        <div className="container mt-5">

            <div className="row justify-content-center">

                <div className="col-md-5">

                    <div className="card shadow">

                        <div className="card-body p-4">

                            <h2 className="text-center mb-4">
                                Login
                            </h2>

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        className="form-control"
                                        placeholder="Email"
                                        value={form.email}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="mb-3">
                                    <label className="form-label">
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        className="form-control"
                                        placeholder="Password"
                                        value={form.password}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="text-center mb-3">
                                    Don't have an account?
                                    <a href="/register" className="ms-1">
                                        Register
                                    </a>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                >
                                    Login
                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;