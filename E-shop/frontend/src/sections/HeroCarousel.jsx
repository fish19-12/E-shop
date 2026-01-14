import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import hero1 from "../assets/hero1.jpg";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";

const slides = [
  {
    id: 1,
    title: "Spring Collection for Women",
    subtitle: "Fresh styles and colors just for you",
    img: hero1,
    link: "/?category=women",
  },
  {
    id: 2,
    title: "Men's Classic Wear",
    subtitle: "Elevate your wardrobe with style",
    img: hero2,
    link: "/?category/men",
  },
  {
    id: 3,
    title: "New Arrivals",
    subtitle: "Discover the latest fashion trends",
    img: hero3,
    link: "/?category=new",
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () =>
    setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  useEffect(() => {
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full h-[300px] sm:h-[360px] md:h-[420px] rounded-2xl overflow-hidden shadow-lg">
      {slides.map((slide, idx) => (
        <a
          key={slide.id}
          href={slide.link}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out
            ${idx === current ? "opacity-100 z-20" : "opacity-0 z-0"}
          `}
        >
          {/* Background Image */}
          <div
            className={`absolute inset-0 bg-cover bg-center transform transition-transform duration-[6000ms] 
              ${idx === current ? "scale-105" : "scale-100"} hover:scale-110`}
            style={{ backgroundImage: `url(${slide.img})` }}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-black/30 to-transparent" />

          {/* Text Overlay */}
          <div className="absolute inset-0 flex flex-col justify-center px-6 sm:px-14 md:px-20">
            <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-6 rounded-lg inline-block">
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-wide text-white mb-2">
                {slide.title}
              </h1>
              <p className="text-sm sm:text-md text-gray-200 mb-4">
                {slide.subtitle}
              </p>
              <button className="px-4 py-1 sm:px-5 sm:py-2 border border-white text-white font-medium text-sm sm:text-md rounded-full shadow-sm hover:bg-white hover:text-black transition">
                Shop Now
              </button>
            </div>
          </div>
        </a>
      ))}

      {/* Navigation Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 sm:gap-3">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`w-3 h-3 sm:w-4 sm:h-4 rounded-full transition-all duration-300
              ${
                current === idx
                  ? "bg-white scale-125"
                  : "bg-gray-400/70 scale-100"
              }`}
          />
        ))}
      </div>

      {/* Navigation Arrows */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 text-white p-2 rounded-full hover:bg-black/50 transition"
      >
        <ChevronRight size={20} />
      </button>
    </div>
  );
}
