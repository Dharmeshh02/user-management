import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./components/Home.jsx"
import Login from "./pages/Login";
// import AdminDashboard from "./pages/dashboards/AdminDashboard";
// import Categories from "./components/Categories.jsx";
import Dashboard from "./pages/ Dashboard.jsx";
import Profile from "./pages/Profile.jsx";
import ProtectedRoute from "./ProtectedRoute";
import ProductList from "./components/ProductList.jsx";
import ProductDetails from "./components/ProductDetails.jsx";
import Cart from "./components/Cart.jsx";
import Checkout from "./components/Checkout";
import OrderDetails from "./components/OrderDetails.jsx";
import AdminOrderDetails from "./components/AdminOrderDetails.jsx";


function App() {
    return (



        <Routes>
            <Route path="/" element={<Home />} />
            <Route
                path="/login"
                element={<Login />}
            />

            {/* <Route
                    path="/admin-dashboard"
                    element={
                        <ProtectedRoute role="admin">
                            <AdminDashboard />
                        </ProtectedRoute>
                    }
                /> */}

            <Route
                path="/dashboard"
                element={
                    <ProtectedRoute>
                        <Dashboard />
                    </ProtectedRoute>
                }
            />
            {/* <Route
                    path="/admin/categories"
                    element={
                        <ProtectedRoute role="admin">
                            <Categories />
                        </ProtectedRoute>
                    }
                /> */}

            <Route
                path="/profile"
                element={
                    <ProtectedRoute roles={["admin", "user"]}>
                        <Profile />
                    </ProtectedRoute>
                }
            />
            <Route path="/ProductList" element={<ProductList />} />
            <Route
                path="/product/:id"
                element={<ProductDetails />}
            />

            <Route
                path="/cart"
                element={<Cart />}
            />
            <Route
                path="/checkout"
                element={<Checkout />}
            />
            <Route
                path="/orders/:id"
                element={<OrderDetails />}

            />
            <Route
                path="/admin/orders/:id"
                element={<AdminOrderDetails />}
            />

        </Routes>




    )
}

export default App;