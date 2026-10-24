import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function AdminOrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("");

    // Get order details
    useEffect(() => {

        const getOrderDetails = async () => {

            try {

                const response = await api.get(
                    `/api/admin/orders/${id}`
                );

                setOrder(response.data.order);
                setStatus(response.data.order.status);

            } catch (error) {

                console.error(error);

            } finally {

                setLoading(false);

            }

        };

        getOrderDetails();

    }, [id]);


    // Update order status
    const handleStatusUpdate = async () => {

        try {

            const response = await api.patch(
                `/api/admin/orders/${id}/status`,
                {
                    status: status
                }
            );

            setOrder(response.data.order);

            alert("Order status updated successfully");

        } catch (error) {

            console.error(error);

            alert("Failed to update order status");

        }

    };


    if (loading) {
        return (
            <div className="container mt-4">
                <h4>Loading...</h4>
            </div>
        );
    }


    if (!order) {
        return (
            <div className="container mt-4">
                <div className="alert alert-danger">
                    Order not found.
                </div>
            </div>
        );
    }


    return (
        <div className="container mt-4">

            <h3 className="mb-4">
                Order Details
            </h3>


            {/* Order Information */}

            <div className="card mb-4">

                <div className="card-body">

                    <h5>
                        Order #{order.id}
                    </h5>

                    <p>
                        <strong>Date:</strong>{" "}
                        {new Date(order.created_at).toLocaleDateString()}
                    </p>

                    <p>
                        <strong>Name:</strong>{" "}
                        {order.name}
                    </p>

                    <p>
                        <strong>Phone:</strong>{" "}
                        {order.phone}
                    </p>

                    <p>
                        <strong>Address:</strong>{" "}
                        {order.address}
                    </p>

                    <p>
                        <strong>City:</strong>{" "}
                        {order.city}
                    </p>

                    <p>
                        <strong>State:</strong>{" "}
                        {order.state}
                    </p>

                    <p>
                        <strong>Pincode:</strong>{" "}
                        {order.pincode}
                    </p>

                </div>

            </div>


            {/* Products */}

            <div className="card mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Order Items
                    </h5>

                    {order.order_items?.map((item) => (

                        <div
                            key={item.id}
                            className="border-bottom py-3"
                        >

                            <h6>
                                {item.product?.name}
                            </h6>

                            <p className="mb-1">
                                Quantity: {item.quantity}
                            </p>

                            <p className="mb-0">
                                Price: ₹{item.price}
                            </p>

                        </div>

                    ))}

                </div>

            </div>


            {/* Order Summary */}

            <div className="card mb-4">

                <div className="card-body">

                    <h5>
                        Order Summary
                    </h5>

                    <p>
                        Subtotal: ₹{order.subtotal}
                    </p>

                    <p>
                        Shipping: ₹{order.shipping}
                    </p>

                    <h5>
                        Total: ₹{order.grand_total}
                    </h5>

                </div>

            </div>


            {/* Status */}

            <div className="card">

                <div className="card-body">

                    <h5 className="mb-3">
                        Order Status
                    </h5>

                    <select
                        className="form-select mb-3"
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                    >

                        <option value="pending">
                            Pending
                        </option>

                        <option value="confirmed">
                            Confirmed
                        </option>

                        <option value="shipped">
                            Shipped
                        </option>

                        <option value="delivered">
                            Delivered
                        </option>

                        <option value="cancelled">
                            Cancelled
                        </option>

                    </select>


                    <button
                        className="btn btn-primary"
                        onClick={handleStatusUpdate}
                    >
                        Update Status
                    </button>

                </div>

            </div>

        </div>
    );
}

export default AdminOrderDetails;