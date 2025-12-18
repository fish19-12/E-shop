import { useParams, Link } from "react-router-dom";
import {
  FaQuestionCircle,
  FaShippingFast,
  FaUndoAlt,
  FaSearch,
  FaInfoCircle,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import logo from "../assets/logo.jpg";

const pagesContent = {
  about: {
    title: "About Fisho-Fashion",
    icon: <FaInfoCircle size={40} className="text-rose-500" />,
    sections: [
      {
        heading: "Who We Are",
        text: "Fisho-Fashion is a modern Ethiopian fashion brand delivering trendy, premium, and affordable clothing for men and women.",
      },
      {
        heading: "Our Mission",
        text: "To bring international-level fashion experience directly to your phone.",
      },
      {
        heading: "Why Customers Love Us",
        text: "Stylish collections, reliable shipping, responsive support, and great pricing.",
      },
    ],
  },

  help: {
    title: "Help Center",
    icon: <FaQuestionCircle size={40} className="text-pink-500" />,
    sections: [
      {
        heading: "Guides",
        text: "Step-by-step guides for shopping, payments, delivery options, and account management.",
      },
      {
        heading: "Support",
        text: "Need help? Contact our customer support team for personalized assistance.",
      },
      {
        heading: "Resources",
        text: "Explore helpful articles and tutorials to improve your shopping experience.",
      },
    ],
  },

  faq: {
    title: "FAQ – Frequently Asked Questions",
    icon: <FaQuestionCircle size={40} className="text-rose-500" />,
    isFAQ: true, // 🚀 Special indicator so we render FAQ
  },

  shipping: {
    title: "Shipping & Delivery",
    icon: <FaShippingFast size={40} className="text-blue-500" />,
    sections: [
      {
        heading: "Delivery Options",
        text: "We offer express and standard shipping to all regions of Ethiopia.",
      },
      {
        heading: "Shipping Time",
        text: "Delivery takes 2–5 business days depending on your location.",
      },
      {
        heading: "Shipping Costs",
        text: "Costs are calculated at checkout based on location.",
      },
    ],
  },

  returns: {
    title: "Returns & Refunds",
    icon: <FaUndoAlt size={40} className="text-purple-500" />,
    sections: [
      {
        heading: "Return Policy",
        text: "You can return items within 14 days if they meet our criteria.",
      },
      {
        heading: "Refunds",
        text: "Refunds are processed within 3-5 business days.",
      },
      {
        heading: "How to Return",
        text: "Complete the return request in your account settings.",
      },
    ],
  },

  track: {
    title: "Track Your Order",
    icon: <FaSearch size={40} className="text-pink-400" />,
    sections: [
      {
        heading: "Order Tracking",
        text: "Enter your order ID to check your shipment status.",
      },
      {
        heading: "Notifications",
        text: "Receive updates via SMS or email.",
      },
      {
        heading: "Support",
        text: "Contact support if tracking does not update.",
      },
    ],
  },
};

export default function CustomerCare() {
  const { page } = useParams();
  const currentPage = pagesContent[page] || pagesContent.about;

  // FAQ state
  const [openFAQ, setOpenFAQ] = useState(null);

  const faqItems = [
    {
      q: "How long does delivery take?",
      a: "Delivery usually takes 2–5 business days depending on your region.",
    },
    {
      q: "Can I return an item?",
      a: "Yes, within 14 days if unused and in original packaging.",
    },
    {
      q: "Do you offer Cash on Delivery?",
      a: "Yes, COD is available in most major cities.",
    },
    {
      q: "How do I contact customer support?",
      a: "You can reach us through our Contact page or social media.",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-6 py-20 flex flex-col md:flex-row gap-16">
      {/* LEFT SIDEBAR */}
      <motion.div
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="md:w-1/4 space-y-6"
      >
        <div className="flex items-center gap-3 mb-8">
          <img
            src={logo}
            alt="Fisho-Fashion Logo"
            className="w-16 h-16 object-cover rounded-2xl shadow-lg"
          />
          <h2 className="text-3xl font-bold text-gray-900">Customer Care</h2>
        </div>

        <nav className="space-y-3">
          {Object.keys(pagesContent).map((key) => (
            <Link
              key={key}
              to={`/customer-care/${key}`}
              className={`block px-4 py-3 rounded-2xl text-lg font-medium transition-all duration-300 shadow-sm
                ${
                  key === page
                    ? "bg-rose-500 text-white shadow-xl scale-[1.02]"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
            >
              {pagesContent[key].title}
            </Link>
          ))}
        </nav>
      </motion.div>

      {/* RIGHT SIDE CONTENT */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="md:w-3/4"
      >
        <div className="flex items-center gap-4 mb-10">
          {currentPage.icon}
          <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
            {currentPage.title}
          </h1>
        </div>

        {/* If page is FAQ → render FAQ dropdown UI */}
        {currentPage.isFAQ ? (
          <div className="space-y-6">
            {faqItems.map((item, index) => (
              <div
                key={index}
                className="bg-white p-6 rounded-3xl shadow-lg cursor-pointer border hover:shadow-xl transition"
                onClick={() => setOpenFAQ(openFAQ === index ? null : index)}
              >
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">{item.q}</h2>
                  <span className="text-2xl">
                    {openFAQ === index ? "−" : "+"}
                  </span>
                </div>

                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={
                    openFAQ === index
                      ? { height: "auto", opacity: 1 }
                      : { height: 0, opacity: 0 }
                  }
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden"
                >
                  <p className="text-gray-600 mt-3 text-lg leading-relaxed">
                    {item.a}
                  </p>
                </motion.div>
              </div>
            ))}
          </div>
        ) : (
          /* Standard sections for other pages */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {currentPage.sections?.map((section, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className="bg-white p-8 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100"
              >
                <h2 className="text-2xl font-bold text-gray-800 mb-3">
                  {section.heading}
                </h2>
                <p className="text-gray-600 leading-relaxed text-lg">
                  {section.text}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
}
