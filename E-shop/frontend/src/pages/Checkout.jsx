import React, { useContext, useState } from "react";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Checkout() {
  const { cart, total, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);

  const [paymentMethod, setPaymentMethod] = useState("cash"); // default COD

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    address: "",
    city: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const goToPayment = () => {
    if (!form.fullName || !form.phone || !form.address || !form.city) {
      alert("Please fill all shipping fields.");
      return;
    }
    setStep(2);
  };

  const handlePayment = async () => {
    setLoading(true);

    try {
      if (!user?._id) {
        alert("You must be logged in to place an order.");
        setLoading(false);
        return;
      }

      // Map cart items
      const orderItems = cart.map((item) => ({
        product: item._id,
        qty: item.qty,
        color: item.color,
        size: item.size,
      }));

      // Prepare data for backend
      const orderData = {
        userId: user._id,
        items: orderItems,
        total,
        shipping: form,
        paymentMethod,
      };

      const res = await api.post("/payment/init", orderData, {
        headers: { Authorization: `Bearer ${user?.token}` },
      });

      if (res.data.success) {
        // COD or demo payment: success
        clearCart();
        navigate("/order-success");
      } else if (res.data.checkout_url) {
        // Redirect for online payment (future)
        window.location.href = res.data.checkout_url;
      } else {
        alert(res.data.message || "Payment error. Please try again.");
      }
    } catch (err) {
      console.error("Payment error:", err.response?.data || err);
      alert("Payment error. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="mt-28 max-w-7xl mx-auto p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* LEFT CARD */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg lg:col-span-2 transition-all duration-300 hover:shadow-2xl">
        {step === 1 && (
          <>
            <h2 className="text-3xl font-bold mb-6 text-gray-800">
              Shipping Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={form.fullName}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                className="border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                name="address"
                placeholder="Region / Address"
                value={form.address}
                onChange={handleChange}
                className="md:col-span-2 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-500"
              />
              <input
                type="text"
                name="city"
                placeholder="City"
                value={form.city}
                onChange={handleChange}
                className="md:col-span-2 border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-pink-500"
              />
            </div>

            <button
              onClick={goToPayment}
              className="mt-6 w-full bg-pink-600 hover:bg-pink-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              Continue to Payment
            </button>
          </>
        )}

        {step === 2 && (
          <>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Payment Method
            </h2>

            <p className="text-gray-500 mb-4">Choose how you want to pay:</p>

            <div className="space-y-4">
              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-not-allowed bg-gray-50 text-gray-400">
                <input type="radio" name="payment" value="chapa" disabled />
                <span className="font-medium">Chapa Payment (Coming Soon)</span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="telebirr"
                  checked={paymentMethod === "telebirr"}
                  onChange={() => setPaymentMethod("telebirr")}
                />
                <span className="font-medium">Telebirr Payment</span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cbe"
                  checked={paymentMethod === "cbe"}
                  onChange={() => setPaymentMethod("cbe")}
                />
                <span className="font-medium">CBE Birr Transfer</span>
              </label>

              <label className="flex items-center gap-3 border rounded-xl p-4 cursor-pointer hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cash"
                  checked={paymentMethod === "cash"}
                  onChange={() => setPaymentMethod("cash")}
                />
                <span className="font-medium">Cash on Delivery</span>
              </label>
            </div>

            <button
              onClick={handlePayment}
              disabled={loading}
              className="mt-6 w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-xl text-lg font-semibold transition"
            >
              {loading ? "Processing..." : "Complete Payment"}
            </button>
          </>
        )}
      </div>

      {/* RIGHT CARD - SUMMARY */}
      <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-lg transition-all duration-300 hover:shadow-2xl">
        <h3 className="text-2xl font-bold mb-6 text-gray-800">Order Summary</h3>

        {cart.map((item) => (
          <div
            key={`${item._id}-${item.color}-${item.size}`}
            className="flex gap-4 border-b pb-4 mb-4"
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-20 h-20 object-cover rounded-xl shadow"
            />
            <div className="flex-1">
              <p className="font-semibold text-gray-800">{item.name}</p>
              <p className="text-sm text-gray-500">
                {item.color} • {item.size}
              </p>
              <p className="text-sm text-gray-500">Qty: {item.qty}</p>
            </div>
            <p className="font-semibold">
              ${(item.price * item.qty).toFixed(2)}
            </p>
          </div>
        ))}

        <p className="text-xl font-bold mt-4 text-gray-800">
          Total: ${total.toFixed(2)}
        </p>
      </div>
    </div>
  );
}
