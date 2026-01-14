import { Link } from "react-router-dom";
import { FaInstagram, FaTiktok, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#f7f5f2] mt-28 border-t border-[#d5c7b2]">
      {/* TOP GRID */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-12">
        {/* BRAND */}
        <div className="space-y-5">
          <h2
            className="text-[36px] font-extrabold uppercase tracking-[0.22em]
            bg-gradient-to-r from-[#af8d55] via-[#d9c6a3] to-[#af8d55]
            bg-clip-text text-transparent drop-shadow-[0_1px_1px_rgba(0,0,0,0.15)]"
          >
            Fisho-Fashion
          </h2>
          <p className="text-gray-700 leading-relaxed text-[15px]">
            A premium destination for modern luxury fashion. Crafted with
            elegance, designed for confidence.
          </p>

          {/* SOCIAL ICONS */}
          <div className="flex items-center gap-5 mt-4">
            <a
              href="#"
              className="text-gray-700 hover:text-black transition-transform hover:scale-110"
            >
              <FaInstagram size={24} />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black transition-transform hover:scale-110"
            >
              <FaTiktok size={24} />
            </a>
            <a
              href="#"
              className="text-gray-700 hover:text-black transition-transform hover:scale-110"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </div>

        {/* SHOP CATEGORIES */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 tracking-wide text-[#3b3b3b] relative inline-block group">
            Shop
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
          </h3>
          <ul className="space-y-3">
            <li>
              <Link
                to="/category/women"
                className="hover:text-pink-600 transition-colors font-medium"
              >
                Women
              </Link>
            </li>
            <li>
              <Link
                to="/category/men"
                className="hover:text-blue-600 transition-colors font-medium"
              >
                Men
              </Link>
            </li>
            <li>
              <Link
                to="/category/shoes"
                className="hover:text-purple-600 transition-colors font-medium"
              >
                Shoes
              </Link>
            </li>
            <li>
              <Link
                to="/category/new"
                className="hover:text-pink-400 transition-colors font-medium"
              >
                New Arrivals
              </Link>
            </li>
          </ul>
        </div>

        {/* CUSTOMER CARE */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 tracking-wide text-[#3b3b3b] relative inline-block group">
            Customer Care
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>
              <Link
                to="/customer-care/help"
                className="hover:text-pink-600 transition font-medium"
              >
                Help Center
              </Link>
            </li>
            <li>
              <Link
                to="/customer-care/shipping"
                className="hover:text-blue-600 transition font-medium"
              >
                Shipping & Delivery
              </Link>
            </li>
            <li>
              <Link
                to="/customer-care/returns"
                className="hover:text-purple-600 transition font-medium"
              >
                Returns & Refunds
              </Link>
            </li>
            <li>
              <Link
                to="/customer-care/track"
                className="hover:text-pink-400 transition font-medium"
              >
                Track Your Order
              </Link>
            </li>
            <li>
              <Link
                to="/customer-care/faq"
                className="hover:text-pink-400 transition font-medium"
              >
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* STORE INFO */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 tracking-wide text-[#3b3b3b] relative inline-block group">
            Store Info
            <span className="absolute left-0 -bottom-1 w-0 h-[2px] bg-pink-500 transition-all group-hover:w-full"></span>
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li>Addis Ababa, Ethiopia</li>
            <li>Phone: +251 919458210</li>
            <li>Email: fisehalidetu12@gmail.com</li>
            <li>Mon – Sat: 9AM – 8PM</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-[#d5c7b2] py-6 text-center text-gray-700 text-sm tracking-wide bg-[#f7f5f2]">
        © {new Date().getFullYear()}
        <span className="mx-1 font-semibold text-gray-900">Fisho-Fashion</span>
        All Rights Reserved.
      </div>
    </footer>
  );
}
