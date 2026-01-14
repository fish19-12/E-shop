import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import ProductCard from "../components/ProductCard";

export default function CategoryPage() {
  const { name } = useParams(); // women, men, shoes, new
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  const categoryMap = {
    women: "Women",
    men: "Men",
    shoes: "Shoes",
    new: "New Arrivals",
  };

  const categoryTitle = categoryMap[name] || "Shop";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data;

        const filtered = data.filter(
          (p) => p.category.toLowerCase() === categoryTitle.toLowerCase()
        );

        setProducts(filtered);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [name]);

  return (
    <div className="max-w-7xl mx-auto px-4 mt-32 pb-20">
      <h1 className="text-4xl font-bold text-gray-900 text-center mb-8">
        {categoryTitle}
      </h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading...</p>
      ) : products.length === 0 ? (
        <p className="text-center text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}
