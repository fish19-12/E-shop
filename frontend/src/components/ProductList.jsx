import ProductCard from "./ProductCard";

export default function ProductList({ products }) {
  return (
    <div className="flex overflow-x-auto space-x-4 py-4 scrollbar-hide px-2">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} />
      ))}
    </div>
  );
}
