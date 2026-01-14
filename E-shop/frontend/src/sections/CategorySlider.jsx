import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "../components/ProductCard";

export default function CategorySlider({ products }) {
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  // Smooth arrow scroll
  const scroll = (direction) => {
    const container = sliderRef.current;
    if (!container) return;

    const amount = container.offsetWidth * 0.85;
    container.scrollBy({
      left: direction === "left" ? -amount : amount,
      behavior: "smooth",
    });
  };

  // Mouse + Touch drag scroll
  const startDrag = (e) => {
    isDragging.current = true;
    startX.current = e.pageX || e.touches[0].pageX;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const duringDrag = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX || e.touches[0].pageX;
    const walk = (x - startX.current) * 1.2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const stopDrag = () => {
    isDragging.current = false;
  };

  return (
    <div className="relative select-none">
      {/* LEFT ARROW (desktop only) */}
      <button
        onClick={() => scroll("left")}
        className="
          hidden md:flex absolute left-2 top-1/2 -translate-y-1/2 z-10
          bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-full
          border border-gray-200 hover:bg-gray-100 transition
        "
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      {/* SLIDER */}
      <div
        ref={sliderRef}
        onMouseDown={startDrag}
        onMouseMove={duringDrag}
        onMouseUp={stopDrag}
        onMouseLeave={stopDrag}
        onTouchStart={startDrag}
        onTouchMove={duringDrag}
        onTouchEnd={stopDrag}
        className="
          overflow-x-auto scrollbar-hide
          flex gap-5 px-4 py-4 snap-x snap-mandatory
          cursor-grab active:cursor-grabbing
        "
        style={{ scrollBehavior: "smooth" }}
      >
        {products.map((product) => (
          <div
            key={product._id}
            className="snap-start flex-none w-[200px] md:w-[250px]"
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      {/* RIGHT ARROW (desktop only) */}
      <button
        onClick={() => scroll("right")}
        className="
          hidden md:flex absolute right-2 top-1/2 -translate-y-1/2 z-10
          bg-white/90 backdrop-blur-md shadow-lg p-3 rounded-full
          border border-gray-200 hover:bg-gray-100 transition
        "
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
}
