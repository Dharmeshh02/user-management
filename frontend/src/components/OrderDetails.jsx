import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";

function OrderDetails() {

    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        api.get(`/api/user/orders/${id}`) // with order id
            .then((response) => {

                // console.log("FULL RESPONSE:", response.data);
                // console.log("ORDER:", response.data.order);
                // console.log("ORDER ITEMS:",response.data.order.order_items);
                // console.log("ORDER KEYS:",Object.keys(response.data.order));

                setOrder(response.data.order);

            })
            .catch((error) => {

                console.log("Error fetching order:", error);

            })
            .finally(() => {

                setLoading(false);

            });

    }, [id]);


    const cancelOrder = () => {

        api.patch(`/api/user/orders/${id}/cancel`)
            .then((response) => {

                console.log(
                    "Cancel Response:",
                    response.data
                );

                setOrder(response.data.order);

            })
            .catch((error) => {

                console.log(
                    "Error cancelling order:",
                    error
                );

            });

    };


    if (loading) {

        return (
            <div className="container mt-4">
                <h3>Loading Order Details...</h3>
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

        <div className="container mt-4 mb-5">


            {/* Header */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h3 className="mb-1">
                        Order Details
                    </h3>

                    <small className="text-muted">
                        Order #{order.id}
                    </small>

                </div>


                {order.status === "pending" && (

                    <button
                        className="btn btn-outline-danger"
                        onClick={cancelOrder}
                    >
                        Cancel Order
                    </button>

                )}

            </div>



            {/* Order Information */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Order Information
                    </h5>


                    <div className="row">


                        <div className="col-md-3 mb-3">

                            <small className="text-muted d-block">
                                Order ID
                            </small>

                            <strong>
                                #{order.id}
                            </strong>

                        </div>


                        <div className="col-md-3 mb-3">

                            <small className="text-muted d-block">
                                Date
                            </small>

                            <strong>
                                {order.created_at}
                            </strong>

                        </div>


                        <div className="col-md-3 mb-3">

                            <small className="text-muted d-block">
                                Payment Method
                            </small>

                            <strong>
                                {order.payment_method}
                            </strong>

                        </div>


                        <div className="col-md-3 mb-3">

                            <small className="text-muted d-block">
                                Status
                            </small>

                            <span
                                className={`badge ${order.status === "pending"
                                    ? "bg-warning text-dark"
                                    : order.status === "cancelled"
                                        ? "bg-danger"
                                        : "bg-success"
                                    }`}
                            >
                                {order.status}
                            </span>

                        </div>


                    </div>

                </div>

            </div>



            {/* Delivery Address */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Delivery Address
                    </h5>


                    <div className="border rounded p-3">

                        <h6 className="mb-2">
                            {order.name}
                        </h6>


                        <p className="mb-1 text-muted">
                            {order.phone}
                        </p>


                        <p className="mb-1">
                            {order.address}, {order.city}
                        </p>


                        <p className="mb-0">
                            {order.state}, {order.country} - {order.pincode}
                        </p>

                    </div>

                </div>

            </div>



            {/* Order Items */}

            <div className="card shadow-sm border-0 mb-4">

                <div className="card-body">

                    <h5 className="mb-3">
                        Order Items
                    </h5>


                    {(order.order_items || []).map((item) => (

                        <div
                            className="border rounded p-3 mb-3"
                            key={item.id}
                        >

                            <div className="d-flex justify-content-between align-items-center">


                                <div>

                                    <h6 className="mb-2">
                                        {item.product.name}
                                    </h6>


                                    <p className="mb-1 text-muted">
                                        Quantity: {item.quantity}
                                    </p>


                                    <p className="mb-0 text-muted">
                                        Price: ₹{item.price}
                                    </p>

                                </div>


                                <div className="text-end">

                                    <small className="text-muted d-block">
                                        Total
                                    </small>


                                    <strong>
                                        ₹{item.total}
                                    </strong>

                                </div>


                            </div>

                        </div>

                    ))}

                </div>

            </div>



            {/* Order Summary */}

            <div className="card shadow-sm border-0">

                <div className="card-body">

                    <h5 className="mb-3">
                        Order Summary
                    </h5>


                    <div className="d-flex justify-content-between mb-2">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{order.subtotal}
                        </span>

                    </div>


                    <div className="d-flex justify-content-between mb-3">

                        <span>
                            Shipping
                        </span>

                        <span>
                            ₹{order.shipping}
                        </span>

                    </div>


                    <hr />


                    <div className="d-flex justify-content-between">

                        <strong>
                            Grand Total
                        </strong>

                        <strong className="fs-5">
                            ₹{order.grand_total}
                        </strong>

                    </div>

                </div>

            </div>


        </div>

    );
}

export default OrderDetails;
