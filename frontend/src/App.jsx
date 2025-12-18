import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ScrollToTop from "./components/ScrollToTop";

// Pages
import Shop from "./pages/Shop";
import CategoryPage from "./pages/CategoryPage";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import OrderSuccess from "./pages/OrderSuccess";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerCare from "./pages/CustomerCare";

// Context
import { CartProvider } from "./context/CartContext";
import { AuthProvider, AuthContext } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = React.useContext(AuthContext);
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <ScrollToTop />

        <div className="min-h-screen flex flex-col">
          <Navbar />

          <main className="flex-1 pt-20">
            <Routes>
              <Route path="/" element={<Shop />} />

              <Route path="/category/:name" element={<CategoryPage />} />

              <Route path="/product/:id" element={<ProductDetails />} />

              {/* CUSTOMER CARE */}
              <Route path="/customer-care/:page" element={<CustomerCare />} />

              <Route path="/cart" element={<Cart />} />

              <Route
                path="/checkout"
                element={
                  <ProtectedRoute>
                    <Checkout />
                  </ProtectedRoute>
                }
              />

              <Route path="/order-success" element={<OrderSuccess />} />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
