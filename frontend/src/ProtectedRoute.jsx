import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import api from "./api";

function ProtectedRoute({ children, role }) {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        api.get("/api/profile")
            .then((response) => {
                setUser(response.data.user);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    if (role && user.role !== role) {
        // user wrong role wale page par aa gaya hai, to usko uske role ke correct dashboard par bhej do.
        return <Navigate to="/dashboard" />;
    }

    return children;
}

export default ProtectedRoute;