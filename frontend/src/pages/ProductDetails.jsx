import { useEffect, useState, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

export default function ProductDetail() {
  const { id } = useParams();
  const { addToCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSize, setSelectedSize] = useState("");

  // Fetch product using Axios and environment variable
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        setProduct(res.data);
      } catch (err) {
        console.error("Failed to fetch product:", err);
      }
    };
    fetchProduct();
  }, [id]);

  // Force scroll to top when product loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [product]);

  if (!product)
    return <div className="p-10 text-center text-gray-500">Loading...</div>;

  const handleAddToCart = () => {
    if (!selectedColor || !selectedSize) {
      alert("Please select color and size.");
      return;
    }

    addToCart({
      ...product,
      color: selectedColor,
      size: selectedSize,
      images: product.images, // keep original array
    });

    alert("Product added to cart!");
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-10">
      {/* LEFT: PRODUCT IMAGES */}
      <div>
        <img
          src={product.images?.[0]}
          alt={product.title}
          className="w-full h-96 object-cover rounded-xl shadow-lg"
        />

        {product.images?.length > 1 && (
          <div className="flex gap-3 mt-3">
            {product.images.map((img, i) => (
              <img
                key={i}
                src={img}
                alt="thumb"
                className="w-20 h-20 object-cover rounded-lg border hover:scale-105 transition"
              />
            ))}
          </div>
        )}
      </div>

      {/* RIGHT: PRODUCT INFO */}
      <div className="flex flex-col">
        <h1 className="text-4xl font-extrabold text-gray-900">
          {product.title}
        </h1>
        <p className="text-gray-500 mt-2 capitalize">{product.category}</p>

        <p className="text-2xl mt-4 font-bold text-pink-600">
          ${product.price.toFixed(2)}
        </p>

        <p className="mt-4 text-gray-700 leading-relaxed">
          {product.description}
        </p>

        {/* SIZE SELECTOR */}
        {product.sizes?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Size</h3>
            <div className="flex gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    selectedSize === size
                      ? "bg-pink-500 text-white border-pink-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* COLOR SELECTOR */}
        {product.colors?.length > 0 && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold mb-2">Color</h3>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`px-4 py-2 rounded-lg border transition ${
                    selectedColor === color
                      ? "bg-purple-500 text-white border-purple-500"
                      : "bg-white text-gray-700 border-gray-300"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ADD TO CART BUTTON */}
        <button
          onClick={() => {
            if (!user) {
              alert("Please login to add this product to your cart!");
              navigate("/login");
              return;
            }
            handleAddToCart();
          }}
          className={`mt-8 w-full py-3 rounded-xl font-semibold shadow-lg transition transform ${
            user
              ? "bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:scale-105"
              : "bg-gray-300 text-gray-700 hover:bg-gray-400"
          }`}
        >
          {user ? "Add To Cart" : "Please login to add to cart"}
        </button>
      </div>
    </div>
  );
}
