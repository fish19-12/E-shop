import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import confetti from "canvas-confetti";

export default function OrderSuccess() {
  const { clearCart } = useContext(CartContext);

  // Fire confetti + clear cart (just in case)
  useEffect(() => {
    confetti({
      particleCount: 180,
      spread: 100,
      origin: { y: 0.6 },
    });

    clearCart();
  }, []);

  // Estimated delivery date
  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6">
      {/* SUCCESS ICON */}
      <div
        className="mb-6 bg-green-100 w-28 h-28 rounded-full flex items-center justify-center shadow 
                      animate-[bounce_1s_ease-in-out]"
      >
        <svg
          className="w-16 h-16 text-green-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={3}
            d="M5 13l4 4L19 7"
          />
        </svg>
      </div>

      {/* TITLE */}
      <h1 className="text-3xl md:text-4xl font-extrabold text-green-600 mb-2 text-center">
        Order Placed Successfully!
      </h1>

      <p className="text-gray-700 text-center mb-6 max-w-md">
        Thank you for shopping with us. Your order is confirmed and will be
        processed shortly.
      </p>

      {/* ORDER SUMMARY CARD */}
      <div
        className="bg-white w-full max-w-xl rounded-2xl shadow-lg p-6 mb-8 border border-gray-200 
                      transition hover:shadow-2xl"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">
          Order Summary
        </h2>

        {/* Payment Method */}
        <p className="mb-4 text-gray-700">
          <span className="font-semibold">Payment Method:</span> Cash on
          Delivery
        </p>

        {/* Estimated Delivery */}
        <p className="mb-6 text-gray-600">
          Estimated delivery:{" "}
          <strong>{estimatedDelivery.toDateString()}</strong>
        </p>

        <div className="flex justify-between text-lg font-bold text-gray-900">
          <span>Total Paid:</span>
          <span>$0.00 (Pay on Delivery)</span>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="flex flex-col gap-4 w-full max-w-xl">
        <Link
          to="/"
          className="bg-pink-600 hover:bg-pink-700 text-white font-semibold py-3 rounded-xl text-center 
                     shadow transition"
        >
          Continue Shopping
        </Link>

        <Link
          to="/profile/orders"
          className="bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 rounded-xl text-center
                     shadow transition"
        >
          View My Orders
        </Link>
      </div>
    </div>
  );
}
