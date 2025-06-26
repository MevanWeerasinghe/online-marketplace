// src/app/item/[id]/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import useCart from "../../../hooks/useCart";
import CustomPopup from "../../../components/CustomPopup";
import { createApiUrl, API_ENDPOINTS, API_BASE_URL } from "../../../config/api";

export default function ItemProfilePage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart, isInCart } = useCart();
  const [item, setItem] = useState(null);

  // Popup states
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.jpg";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl}`;
  };

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await fetch(createApiUrl(`${API_ENDPOINTS.ITEMS}/${id}`));
        const data = await res.json();
        setItem(data);
      } catch (err) {
        console.error("Error fetching item:", err);
      }
    };

    if (id) fetchItem();
  }, [id]);

  const handleAddToCartClick = () => {
    setQuantity(1);
    setShowAddToCartPopup(true);
  };

  const confirmAddToCart = () => {
    if (item && quantity > 0) {
      addToCart(item, quantity);
      setShowAddToCartPopup(false);
      setShowSuccessPopup(true);

      // Auto-close success popup and navigate to home after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
        router.push("/");
      }, 2000);
    }
  };

  const closeAddToCartPopup = () => {
    setShowAddToCartPopup(false);
    setQuantity(1);
  };

  if (!item) {
    return <p className="text-center text-purple-600 mt-10">Loading item...</p>;
  }

  return (
    <div className="max-w-3xl mx-auto p-6 mt-6 bg-white rounded-lg shadow border border-purple-200 relative">
      {/* Already Added Tag */}
      {isInCart(item._id) && (
        <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-2 rounded-full text-sm font-semibold flex items-center">
          <span className="mr-1">✓</span>
          Already in Cart
        </div>
      )}

      <Image
        src={getImageUrl(item.imageUrl)}
        alt={item.title || "Product image"}
        width={800}
        height={288}
        className="w-full h-72 object-cover rounded-lg mb-4"
        style={{ objectFit: "cover" }}
        unoptimized={true}
      />
      <h1 className="text-3xl font-bold text-purple-800 mb-2">{item.title}</h1>
      <p className="text-green-600 text-xl font-semibold mb-2">
        LKR {item.price}
      </p>
      <p className="text-gray-700 mb-4">{item.description}</p>

      <p className="text-sm text-pink-500 mb-2">
        Tags: {item.keywords?.join(", ") || "No tags"}
      </p>

      <p className="text-yellow-500 text-md mb-4">
        ⭐ {item.rating?.toFixed(1) || "0.0"} ({item.ratedBy || 0} ratings)
      </p>

      <button
        onClick={handleAddToCartClick}
        className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
      >
        Add to Cart
      </button>

      {/* Add to Cart Popup */}
      <CustomPopup
        isOpen={showAddToCartPopup}
        onClose={closeAddToCartPopup}
        title="Add to Cart"
        onConfirm={confirmAddToCart}
        confirmText="Add to Cart"
        showInput={true}
        inputLabel="Quantity:"
        inputValue={quantity}
        onInputChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
        inputType="number"
        inputMin={1}
        inputMax={50}
      >
        <div className="flex items-center gap-4">
          <Image
            src={getImageUrl(item.imageUrl)}
            alt={item.title || "Product image"}
            width={64}
            height={64}
            className="w-16 h-16 object-cover rounded"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
          <div>
            <h3 className="font-semibold text-purple-800">{item.title}</h3>
            <p className="text-green-600 font-bold">LKR {item.price}</p>
          </div>
        </div>
      </CustomPopup>

      {/* Success Popup */}
      <CustomPopup
        isOpen={showSuccessPopup}
        onClose={() => {
          setShowSuccessPopup(false);
          router.push("/");
        }}
        title="Success!"
        onConfirm={() => {
          setShowSuccessPopup(false);
          router.push("/");
        }}
        confirmText="Go to Home"
      >
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-2">✓</div>
          <p className="text-gray-700">Item added to cart successfully!</p>
          <p className="text-sm text-gray-500 mt-2">
            Redirecting to home page...
          </p>
        </div>
      </CustomPopup>
    </div>
  );
}
