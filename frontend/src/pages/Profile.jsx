import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./../api";

function Profile() {

    const navigate = useNavigate();

    const [photo, setPhoto] = useState(null); //new photo jo user dega store karne ke liye
    const [photoPreview, setPhotoPreview] = useState(null); //selected photo ka screen par preview dikhane ke liye
    const [message, setMessage] = useState("");

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [gender, setGender] = useState("");
    const [profilePhoto, setProfilePhoto] = useState("");
    const [errors, setErrors] = useState({
        name: "",
        phone: ""
    });

    function validateForm() {

        const newErrors = {};

        if (!name.trim()) {
            newErrors.name = "Name is required";
        }

        if (!phone.trim()) {
            newErrors.phone = "Phone is required";
        } else if (phone.trim().length !== 10) {
            newErrors.phone = "Enter 10-digit phone number";
        }

        setErrors(newErrors);

        if (newErrors.name || newErrors.phone) {
            return false;
        }

        return true;
    }


    useEffect(() => {

        api.get("/api/profile")
            .then(function (response) {

                const user = response.data.user;

                setName(user.name || "");
                setEmail(user.email || "");
                setPhone(user.phone || "");
                setGender(user.gender || "");
                setProfilePhoto(user.profile_photo || "");

            })
            .catch(function (error) {

                console.log(error);

            });

    }, []);

    function handlePhotoChange(e) {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setPhoto(file);  // db me bhejne ke liye img ki state (handleSubmit)

        setPhotoPreview(URL.createObjectURL(file)); // preview dikhane ke liye img ka  
        // console.log(URL)
    }

    function handleSubmit(e) {

        e.preventDefault();

        const isValid = validateForm();

        if (!isValid) {
            return;
        }

        const formData = new FormData();

        formData.append("name", name);
        formData.append("email", email);
        formData.append("phone", phone);
        formData.append("gender", gender);
        formData.append("_method", "PUT");// 

        if (photo) {
            formData.append("profile_photo", photo);
        }

        api.post("/api/profile", formData)
            .then(function (response) {

                setMessage(
                    response.data.message || "Profile updated successfully"
                );

                // setTimeout(function () {
                //     navigate("/dashboard");
                // }, 1000);

            })
            .catch(function (error) {

                console.log(error);

            });
    }

    return (
        <div className="container mt-4 mt-md-5 mb-5">

            <div className="row justify-content-center">

                <div className="col-12 col-sm-10 col-md-8 col-lg-6">

                    <div className="card border-0 shadow-sm">

                        {/* Header */}
                        <div
                            className="px-3 px-md-4 py-3"
                            style={{ backgroundColor: "#1e293b" }}
                        >
                            <h5 className="text-white mb-0">
                                Edit Profile
                            </h5>

                            <p className="text-white-50 mb-0 small">
                                Update your personal information
                            </p>
                        </div>

                        <div className="card-body p-3 p-md-4">
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

                            <form onSubmit={handleSubmit}>

                                {/* Photo */}
                                <div className="text-center mb-4">

                                    <div
                                        style={{
                                            position: "relative",
                                            display: "inline-block"
                                        }}
                                    >

                                        {photoPreview || profilePhoto ? (
                                            <img
                                                src={
                                                    photoPreview || "http://localhost:8000/storage/" + profilePhoto
                                                }
                                                alt="Profile"
                                                className="rounded-circle border"
                                                style={{
                                                    width: "110px",
                                                    height: "110px",
                                                    objectFit: "cover"
                                                }}
                                            />
                                        ) : (
                                            <div
                                                className="rounded-circle border d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: "110px",
                                                    height: "110px",
                                                    background: "#f1f5f9",
                                                    fontSize: "40px"
                                                }}
                                            >
                                                👤
                                            </div>
                                        )}

                                        <label
                                            htmlFor="photoUpload"
                                            style={{
                                                position: "absolute",
                                                bottom: "0",
                                                right: "0",
                                                background: "#1e293b",
                                                width: "34px",
                                                height: "34px",
                                                borderRadius: "50%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                cursor: "pointer",
                                                border: "3px solid white"
                                            }}
                                        >
                                            📷
                                        </label>

                                        <input
                                            id="photoUpload"
                                            type="file"
                                            onChange={handlePhotoChange}
                                            style={{ display: "none" }}
                                        />

                                    </div>

                                </div>

                                {/* Name */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Name
                                    </label>

                                    <input
                                        type="text"
                                        className={
                                            errors.name
                                                ? "form-control is-invalid"
                                                : "form-control"
                                        }
                                        value={name}
                                        onChange={function (e) {
                                            setName(e.target.value);
                                        }}
                                        placeholder="Enter your full name"
                                    />

                                    {errors.name && (
                                        <div className="invalid-feedback">
                                            {errors.name}
                                        </div>
                                    )}

                                </div>

                                {/* Email */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        readOnly
                                    />

                                </div>

                                {/* Phone */}
                                <div className="mb-3">

                                    <label className="form-label">
                                        Phone
                                    </label>

                                    <input
                                        type="text"
                                        className="form-control"
                                        value={phone}
                                        onChange={function (e) {
                                            setPhone(e.target.value);
                                        }}
                                        placeholder="10-digit number"
                                        maxLength={10}
                                    />

                                    {errors.phone && (
                                        <div className="text-danger">
                                            {errors.phone}
                                        </div>
                                    )}


                                </div>

                                {/* Gender */}
                                <div className="mb-4">

                                    <label className="form-label">
                                        Gender
                                    </label>

                                    <select
                                        className="form-select"
                                        value={gender}
                                        onChange={function (e) {
                                            setGender(e.target.value);
                                        }}
                                    >
                                        <option value="">
                                            Select
                                        </option>

                                        <option value="male">
                                            Male
                                        </option>

                                        <option value="female">
                                            Female
                                        </option>

                                        <option value="other">
                                            Other
                                        </option>

                                    </select>

                                </div>

                                {/* Buttons */}
                                <div className="d-flex flex-column flex-sm-row gap-2">

                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                    >
                                        Update Profile
                                    </button>

                                </div>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Profile;
