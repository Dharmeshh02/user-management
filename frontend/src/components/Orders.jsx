import React, { useEffect, useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";
import ProductNavbar from "./ProductNavbar.jsx";

function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getOrders();
    }, []);

    const getOrders = () => {

        api.get("/api/user/orders")
            .then((response) => {

                setOrders(response.data.orders);
                console.log(response.data.orders)

            })
            .catch((error) => {

                console.log("Error fetching orders:", error);

            })
            .finally(() => {

                setLoading(false);

            });
    };

    if (loading) {
        return (
            <div className="container mt-4">
                <h3>Loading Orders...</h3>
            </div>
        );
    }

    return (
        <div className="container-fluid min-vh-100 bg-white p-0">

            {/* NAVBAR */}
            <ProductNavbar />

            {/* ORDERS */}
            <div className="px-4 py-4">

                <h3 className="mb-4 fw-bold">
                    My Orders
                </h3>

                {orders.length === 0 ? (

                    <div className="alert alert-info">
                        No orders found.
                    </div>

                ) : (

                    orders.map((order) => (

                        <div
                            className="card mb-3 border-0 shadow-sm"
                            key={order.id}
                            style={{ borderRadius: "12px" }}
                        >

                            <div className="card-body p-4">

                                <div className="row align-items-center">

                                    {/* Order Info */}
                                    <div className="col-md-8">

                                        <div className="d-flex align-items-center mb-3">

                                            <div
                                                className="bg-light rounded-circle d-flex align-items-center justify-content-center me-3"
                                                style={{
                                                    width: "45px",
                                                    height: "45px"
                                                }}
                                            >
                                                📦
                                            </div>

                                            <div>

                                                <h6 className="fw-bold mb-1">
                                                    Order #{order.id}
                                                </h6>

                                                <small className="text-muted">
                                                    Placed on {order.created_at}
                                                </small>

                                            </div>

                                        </div>


                                        <div className="d-flex gap-4">

                                            <div>
                                                <small className="text-muted d-block">
                                                    Total Amount
                                                </small>

                                                <span className="fw-bold">
                                                    ₹{order.grand_total}
                                                </span>
                                            </div>


                                            <div>
                                                <small className="text-muted d-block">
                                                    Status
                                                </small>

                                                <span className="badge bg-success rounded-pill">
                                                    {order.status}
                                                </span>
                                            </div>

                                        </div>

                                    </div>


                                    {/* View Details */}
                                    <div className="col-md-4 text-md-end mt-3 mt-md-0">

                                        <button
                                            className="btn btn-outline-primary px-4 rounded-pill fw-semibold"
                                            onClick={() =>
                                                navigate(`/orders/${order.id}`)
                                            }
                                        >
                                            View Details →
                                        </button>

                                    </div>

                                </div>

                            </div>

                        </div>

                    ))

                )}

            </div>

        </div>
    );
}

export default Orders;