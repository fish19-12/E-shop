import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import { Link, useNavigate } from "react-router-dom";

export default function Cart() {
  const { cart, addToCart, decreaseQty, removeItem, total } =
    useContext(CartContext);

  const navigate = useNavigate();

  if (cart.length === 0)
    return (
      <div className="p-6 text-center mt-28">
        <h2 className="text-2xl font-semibold mb-4">Your Cart is Empty</h2>
        <Link to="/" className="text-blue-600 underline text-lg">
          Continue Shopping
        </Link>
      </div>
    );

  return (
    <div className="max-w-5xl mx-auto p-6 mt-28 grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* LEFT SIDE — ITEMS */}
      <div className="lg:col-span-2 bg-white p-4 rounded-xl shadow">
        <h2 className="text-2xl font-semibold border-b pb-3 mb-4">
          Shopping Cart
        </h2>

        {cart.map((item) => (
          <div key={item._id} className="flex gap-4 border-b py-4">
            {/* PRODUCT IMAGE */}
            <img
              src={item.image}
              className="w-28 h-28 object-cover rounded-lg"
            />

            {/* INFO */}
            <div className="flex-1">
              <h3 className="text-lg font-medium">{item.name}</h3>
              <p className="text-gray-600">${item.price}</p>

              {/* BUTTONS */}
              <div className="flex items-center gap-3 mt-3">
                <button
                  onClick={() => decreaseQty(item._id)}
                  className="border px-3 py-1 rounded"
                >
                  –
                </button>

                <span className="text-lg">{item.qty}</span>

                <button
                  onClick={() => addToCart(item)}
                  className="border px-3 py-1 rounded"
                >
                  +
                </button>

                <button
                  onClick={() => removeItem(item._id)}
                  className="text-red-500 ml-3"
                >
                  Remove
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* RIGHT SIDE — SUMMARY */}
      <div className="bg-white p-6 rounded-xl shadow h-fit">
        <h3 className="text-xl font-semibold mb-3">Order Summary</h3>

        <p className="text-lg mb-4">
          Total: <span className="font-bold">${total.toFixed(2)}</span>
        </p>

        <button
          onClick={() => navigate("/checkout")}
          className="
            w-full bg-yellow-500 hover:bg-yellow-600 
            text-black font-medium py-3 rounded-lg
          "
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
