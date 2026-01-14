import { useState } from "react";

export default function FAQ() {
  const [open, setOpen] = useState(null);

  const faqs = [
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 2–5 business days depending on your location.",
    },
    {
      q: "Can I return an item?",
      a: "Yes, you can return items within 7 days if unused.",
    },
    {
      q: "Do you offer cash on delivery?",
      a: "Yes, COD is available in most areas.",
    },
    {
      q: "How do I contact support?",
      a: "You can contact us anytime via email or phone.",
    },
  ];

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">Frequently Asked Questions</h1>

      <div className="space-y-3">
        {faqs.map((item, index) => (
          <div
            key={index}
            className="border rounded-xl p-4 cursor-pointer bg-white shadow-sm"
            onClick={() => setOpen(open === index ? null : index)}
          >
            <div className="flex justify-between items-center">
              <h2 className="font-semibold">{item.q}</h2>
              <span>{open === index ? "−" : "+"}</span>
            </div>

            <div
              className={`transition-all overflow-hidden ${
                open === index ? "max-h-40 mt-2" : "max-h-0"
              }`}
            >
              <p className="text-gray-700">{item.a}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
