import { useEffect, useState } from "react";
import HeroCarousel from "../sections/HeroCarousel";
import api from "../services/api";
import CategorySlider from "../sections/CategorySlider"; // desktop grid slider
import ProductList from "../components/ProductList"; // mobile horizontal
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Shop() {
  const [loading, setLoading] = useState(true);
  const [productsByCategory, setProductsByCategory] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  const location = useLocation();
  const navigate = useNavigate();

  // --------------------- Categories order ---------------------
  const categoriesOrder = [
    { key: "New Arrivals", label: "🔥 NEW ARRIVALS" },
    { key: "Women", label: "✨ WOMEN'S COLLECTION" },
    { key: "Men", label: "👔 MEN'S COLLECTION" },
    { key: "Shoes", label: "👟 SHOES" },
  ];

  // --------------------- Handle JWT from Google login ---------------------
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      // Save token to localStorage
      localStorage.setItem("authToken", token);

      // Remove token from URL
      navigate("/shop", { replace: true });
    }
  }, [location, navigate]);

  // --------------------- Fetch products ---------------------
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data;
        setAllProducts(data);

        const grouped = {};
        categoriesOrder.forEach((cat) => {
          grouped[cat.key] = data.filter((p) => p.category === cat.key);
        });

        setProductsByCategory(grouped);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // --------------------- Search suggestions ---------------------
  useEffect(() => {
    if (!searchQuery) {
      setSuggestions([]);
      return;
    }
    const filtered = allProducts
      .filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
    setSuggestions(filtered);
  }, [searchQuery, allProducts]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <p className="text-gray-500 text-lg">Loading products...</p>
      </div>
    );
  }

  // --------------------- Render ---------------------
  return (
    <div className="space-y-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <HeroCarousel />

      {/* Search Bar */}
      <div className="flex justify-center mt-10 relative">
        <div className="relative w-full max-w-xl">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-3 pl-4 pr-12 rounded-full shadow-lg border border-gray-200 focus:ring-2 focus:ring-pink-500 focus:outline-none text-gray-700 placeholder-gray-400 transition"
          />
          <MagnifyingGlassIcon className="absolute right-3 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />

          {suggestions.length > 0 && (
            <div className="absolute z-50 w-full bg-white shadow-xl rounded-xl mt-2 overflow-hidden animate-fadeIn">
              {suggestions.map((p) => (
                <Link
                  key={p._id}
                  to={`/product/${p._id}`}
                  className="block px-4 py-3 hover:bg-pink-50 transition flex justify-between items-center"
                  onClick={() => setSearchQuery("")}
                >
                  <span className="font-medium text-gray-800">
                    {p.title.length > 30
                      ? p.title.slice(0, 30) + "..."
                      : p.title}
                  </span>
                  <span className="text-sm text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                    {p.category}
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Products by Category */}
      {categoriesOrder.map((cat) => {
        const products =
          searchQuery.length > 0
            ? allProducts.filter(
                (p) =>
                  p.category === cat.key &&
                  p.title.toLowerCase().includes(searchQuery.toLowerCase())
              )
            : productsByCategory[cat.key];

        if (!products || products.length === 0) return null;

        return (
          <section key={cat.key} className="space-y-6">
            <div className="text-center space-y-2">
              <h2 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
                {cat.label}
              </h2>
              <div className="w-24 h-1 mx-auto bg-gradient-to-r from-pink-500 to-purple-500 rounded-full"></div>
            </div>

            {/* MOBILE HORIZONTAL SCROLL */}
            <div className="block md:hidden">
              <ProductList products={products} />
            </div>

            {/* DESKTOP GRID / SLIDER */}
            <div className="hidden md:block">
              <CategorySlider products={products} />
            </div>
          </section>
        );
      })}
    </div>
  );
}
