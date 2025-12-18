import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "../services/api";
import ProductGrid from "../sections/ProductGrid";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category");

  const [newArrivals, setNewArrivals] = useState([]);
  const [otherProducts, setOtherProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        let data = res.data;

        // Filter by category if URL has one
        if (category) {
          data = data.filter(
            (p) => p.category?.name?.toLowerCase() === category.toLowerCase()
          );
        }

        // Separate new arrivals
        const newArrivals = data.filter(
          (p) => p.category?.name?.toLowerCase() === "new"
        );
        const others = data.filter(
          (p) => p.category?.name?.toLowerCase() !== "new"
        );

        setNewArrivals(newArrivals);
        setOtherProducts(others);
        setProducts(data); // still keep full array if needed
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [category]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {loading ? (
        <p className="text-center text-gray-500">Loading products...</p>
      ) : (
        <>
          {/* NEW ARRIVALS SECTION */}
          {newArrivals.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-pink-600">New Arrivals</h2>
              <ProductGrid products={newArrivals} />
            </div>
          )}

          {/* OTHER PRODUCTS SECTION */}
          {otherProducts.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-3xl font-bold">
                {category
                  ? `${
                      category.charAt(0).toUpperCase() + category.slice(1)
                    } Products`
                  : "Products"}
              </h2>
              <ProductGrid products={otherProducts} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
