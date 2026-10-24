import React, { useState } from "react";
import "./Register.css";
function Register() {
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

    };

    return (
        <div className="register-page">

        
            <div className="register-card">

                <div className="register-header">
                    <h2>Register</h2>
                </div>

                <form onSubmit={handleSubmit}>

                    <div className="register-form-group">
                        <label>Name</label>

                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your name"
                            value={form.name}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Email</label>

                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Password</label>

                        <input
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="register-form-group">
                        <label>Confirm Password</label>

                        <input
                            type="password"
                            name="password_confirmation"
                            placeholder="Confirm your password"
                            value={form.password_confirmation}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        className="register-btn"
                    >
                        Register
                    </button>

                </form>

                <div className="login-link">
                    Already have an account?
                    <a href="/login"> Login</a>
                </div>

            </div>
         

        </div>

    );
}

export default Register;