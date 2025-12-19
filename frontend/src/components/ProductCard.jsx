import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);
  const [wishlistHovered, setWishlistHovered] = useState(false);

  const rating = product.rating || 4;

  const mainImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : null);

  const hoverImage =
    product.images && product.images.length > 1 ? product.images[1] : mainImage;

  const badge = product.isNew
    ? "NEW"
    : product.isSale
    ? "SALE"
    : product.isHot
    ? "HOT"
    : null;

  return (
    <div
      className="
        group relative bg-white rounded-3xl overflow-hidden shadow-md
        hover:shadow-xl transition-all duration-300 border border-gray-100
        flex-shrink-0 w-64 sm:w-auto mx-2
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* PRODUCT IMAGE */}
      <Link to={`/product/${product._id}`} className="relative block">
        <img
          src={hovered ? hoverImage : mainImage}
          alt={product.title || product.name}
          className="w-full h-64 object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
        />

        {/* Badge */}
        {badge && (
          <span
            className={`
              absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow-lg
              ${badge === "NEW" ? "bg-pink-500 text-white" : ""}
              ${badge === "SALE" ? "bg-red-500 text-white" : ""}
              ${badge === "HOT" ? "bg-yellow-400 text-black" : ""}
            `}
          >
            {badge}
          </span>
        )}

        {/* Wishlist */}
        <button
          onMouseEnter={() => setWishlistHovered(true)}
          onMouseLeave={() => setWishlistHovered(false)}
          className={`
            absolute top-3 right-3 p-2 rounded-full transition-transform
            ${
              wishlistHovered
                ? "scale-125 bg-pink-500 text-white"
                : "bg-gray-800/30 text-white"
            }
          `}
        >
          <Heart size={18} />
        </button>
      </Link>

      {/* PRODUCT INFO */}
      <div className="mt-4 px-4 pb-5 flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-lg font-semibold text-gray-800 hover:text-pink-600 transition">
            {product.title || product.name}
          </h3>
        </Link>

        <p className="text-gray-500 text-sm capitalize mt-1">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center mt-2 space-x-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className={`text-sm ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
        </div>

        {/* Price */}
        <div className="mt-3 flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="text-xl font-bold text-gray-900">
                {product.discountPrice.toFixed(2)} Br
              </span>
              <span className="text-gray-400 line-through text-sm">
                {product.price.toFixed(2)} Br
              </span>
            </>
          ) : (
            <span className="text-xl font-bold text-gray-900">
              {product.price.toFixed(2)} Br
            </span>
          )}
        </div>

        {/* View Details */}
        <Link
          to={`/product/${product._id}`}
          className="
            mt-4 inline-flex items-center justify-center w-full py-2
            bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium
            rounded-xl transition transform hover:scale-105 shadow-md
          "
        >
          <Eye size={16} className="mr-2" /> View Details
        </Link>
      </div>

      {/* Cart Icon */}
      <Link
        to={`/product/${product._id}`}
        className="
          absolute bottom-4 right-4 p-3
          bg-gradient-to-r from-pink-500 to-purple-500 text-white
          rounded-full shadow-lg hover:scale-110 transition-all duration-300
        "
      >
        <ShoppingCart size={20} />
      </Link>
    </div>
  );
}
