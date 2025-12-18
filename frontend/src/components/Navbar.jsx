import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { CartContext } from "../context/CartContext";

import logo from "../assets/logo.jpg";

import {
  ShoppingBagIcon,
  UserCircleIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";

export default function Navbar() {
  const { user } = useContext(AuthContext);
  const { cart } = useContext(CartContext);

  const location = useLocation();
  const [open, setOpen] = useState(false);

  const count = cart.reduce((s, i) => s + i.qty, 0);

  const activePath = location.pathname;

  const links = [
    { name: "Shop", path: "/" },
    { name: "Women", path: "/category/women" },
    { name: "Men", path: "/category/men" },
    { name: "Shoes", path: "/category/shoes" },
    { name: "New Arrivals", path: "/category/new" },
  ];

  return (
    <nav className="fixed top-0 left-0 w-full z-50 bg-white/60 backdrop-blur-xl border-b border-black/5 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* LOGO */}
        <Link to="/" className="flex items-center gap-4 group">
          <img
            src={logo}
            alt="Logo"
            className="w-12 h-12 object-cover rounded-xl shadow-lg transition"
          />
          <span className="text-[30px] font-bold font-serif uppercase bg-gradient-to-r from-[#b08d57] via-[#d7c59a] to-[#b08d57] bg-clip-text text-transparent">
            Fisho-Fashion
          </span>
        </Link>

        {/* DESKTOP MENU */}
        <div className="hidden md:flex space-x-10 text-sm font-semibold">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              className={`relative group ${
                activePath === link.path ? "text-pink-600" : "text-gray-800"
              }`}
            >
              {link.name}
              <span className="absolute left-0 -bottom-1 h-[2px] w-0 bg-gradient-to-r from-pink-500 to-purple-500 group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </div>

        {/* RIGHT AREA */}
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/cart" className="relative hover:scale-110 transition">
            <ShoppingBagIcon className="w-7 h-7 text-gray-900" />
            {count > 0 && (
              <span className="absolute -top-2 -right-3 text-[11px] bg-gradient-to-r from-pink-500 to-purple-500 text-white px-2 py-0.5 rounded-full">
                {count}
              </span>
            )}
          </Link>

          {user ? (
            <Link to="/profile" className="hover:scale-110 transition">
              <UserCircleIcon className="w-8 h-8 text-gray-900" />
            </Link>
          ) : (
            <>
              <Link className="font-medium text-gray-700" to="/login">
                Login
              </Link>
              <Link className="font-medium text-gray-700" to="/register">
                Register
              </Link>
            </>
          )}
        </div>

        {/* MOBILE BUTTON */}
        <button
          onClick={() => setOpen(!open)}
          className="text-gray-700 md:hidden"
        >
          {open ? (
            <XMarkIcon className="w-7 h-7" />
          ) : (
            <Bars3Icon className="w-7 h-7" />
          )}
        </button>
      </div>

      {/* MOBILE MENU */}
      {open && (
        <div className="md:hidden bg-white/50 backdrop-blur-xl px-6 py-5 space-y-5 border-t border-black/5">
          {links.map((link) => (
            <Link
              key={link.name}
              to={link.path}
              onClick={() => setOpen(false)}
              className={`block text-lg font-semibold ${
                activePath === link.path ? "text-pink-500" : "text-gray-700"
              }`}
            >
              {link.name}
            </Link>
          ))}

          <Link
            to="/cart"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 text-gray-700"
          >
            <ShoppingBagIcon className="w-6 h-6" />
            Cart ({count})
          </Link>
        </div>
      )}
    </nav>
  );
}
