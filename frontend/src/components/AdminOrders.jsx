import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";

function AdminOrders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {

        api.get("/api/admin/orders")
            .then((response) => {

                console.log("Admin Orders:", response.data);

                setOrders(response.data.orders);

                setLoading(false);
            })
            .catch((error) => {

                console.log("Admin Orders Error:", error);

                setLoading(false);
            });

    }, []);

    if (loading) {
        return <div className="text-center mt-4">Loading...</div>;
    }

    return (
        <div className="container mt-4">

            <h3 className="mb-4">
                All Orders
            </h3>

            {orders.length === 0 ? (

                <div className="alert alert-info">
                    No orders found.
                </div>

            ) : (

                orders.map((order) => (

                    <div className="card mb-4" key={order.id}>

                        <div className="card-body">

                            <h5>
                                Order #{order.order_number}
                            </h5>

                            <p>
                                Customer: {order.user?.name}
                            </p>

                            <p>
                                Status: {order.status}
                            </p>

                            <p>
                                Total: ₹{order.grand_total}
                            </p>

                            <hr />

                            <h6>Items</h6>

                            {order.orderItems?.map((item) => (

                                <div
                                    key={item.id}
                                    className="d-flex justify-content-between mb-2"
                                >

                                    <span>
                                        {item.product?.name}
                                    </span>

                                    <span>
                                        Qty: {item.quantity}
                                    </span>

                                    <span>
                                        ₹{item.price}
                                    </span>

                                </div>

                            ))}

                            <hr />

                            <button
                                className="btn btn-primary"
                                onClick={() =>
                                    navigate(`/admin/orders/${order.id}`)
                                }
                            >
                                View Details
                            </button>

                        </div>

                    </div>

                ))

            )}

        </div>
    );
}

export default AdminOrders;