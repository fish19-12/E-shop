 import { Link } from "react-router-dom";
import { Heart, Eye, ShoppingCart } from "lucide-react";
import { useState } from "react";

export default function ProductCard({ product }) {
  const [hovered, setHovered] = useState(false);

  const rating = product.rating || 4;

  const mainImage =
    product.image ||
    (product.images && product.images.length > 0 ? product.images[0] : "");

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
        group relative bg-white rounded-3xl overflow-hidden
        border border-gray-100 shadow-sm hover:shadow-xl
        transition-all duration-300
      "
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* IMAGE */}
      <Link to={`/product/${product._id}`} className="relative block">
        <img
          src={hovered ? hoverImage : mainImage}
          alt={product.title || product.name}
          className="
            w-full aspect-[3/4] object-cover
            transition-transform duration-500
            group-hover:scale-105
          "
        />

        {/* Badge */}
        {badge && (
          <span
            className={`
              absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full
              shadow-md
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
          className="
            absolute top-3 right-3 p-2 rounded-full
            bg-gray-800/40 text-white
            hover:bg-pink-500 transition
          "
        >
          <Heart size={16} />
        </button>
      </Link>

      {/* INFO */}
      <div className="p-4 flex flex-col">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-sm sm:text-base font-semibold text-gray-800 line-clamp-2">
            {product.title || product.name}
          </h3>
        </Link>

        <p className="text-xs sm:text-sm text-gray-500 capitalize mt-1">
          {product.category}
        </p>

        {/* Rating */}
        <div className="flex items-center mt-2 space-x-1">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <span
                key={i}
                className={`text-xs ${
                  i < rating ? "text-yellow-400" : "text-gray-300"
                }`}
              >
                ★
              </span>
            ))}
        </div>

        {/* Price */}
        <div className="mt-2 flex items-center space-x-2">
          {product.discountPrice ? (
            <>
              <span className="text-base sm:text-lg font-bold text-gray-900">
                {product.discountPrice.toFixed(2)} Br
              </span>
              <span className="text-xs sm:text-sm text-gray-400 line-through">
                {product.price.toFixed(2)} Br
              </span>
            </>
          ) : (
            <span className="text-base sm:text-lg font-bold text-gray-900">
              {product.price.toFixed(2)} Br
            </span>
          )}
        </div>

        {/* ACTIONS */}
        <div className="mt-4 flex gap-2">
          {/* View Details */}
          <Link
            to={`/product/${product._id}`}
            className="
              flex-1 inline-flex items-center justify-center py-2
              bg-gradient-to-r from-pink-500 to-purple-500
              text-white text-sm font-medium rounded-xl
              hover:scale-[1.02] transition
            "
          >
            <Eye size={14} className="mr-2" />
            View Details
          </Link>

          {/* Cart */}
          <Link
            to={`/product/${product._id}`}
            className="
              p-2 rounded-xl bg-gray-100 text-gray-700
              hover:bg-gray-900 hover:text-white
              transition
            "
          >
            <ShoppingCart size={18} />
          </Link>
        </div>
      </div>
    </div>
  );
}

