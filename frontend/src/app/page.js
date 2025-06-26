// src/app/page.js
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import useCart from "../hooks/useCart";
import { useUser } from "@clerk/nextjs";
import Link from "next/link";
import CustomPopup from "../components/CustomPopup";
import { createApiUrl, API_ENDPOINTS, API_BASE_URL } from "../config/api";

export default function HomePage() {
  const [items, setItems] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");

  // Popup states
  const [showAddToCartPopup, setShowAddToCartPopup] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);

  const { addToCart, isInCart } = useCart();
  const { user } = useUser();

  useEffect(() => {
    fetchItems();
    fetchCategories();
  }, []);

  const fetchItems = async () => {
    const res = await fetch(createApiUrl(API_ENDPOINTS.ITEMS));
    const data = await res.json();
    setItems(data);
    setFiltered(data);
  };

  const fetchCategories = async () => {
    const res = await fetch(createApiUrl(API_ENDPOINTS.CATEGORIES));
    const data = await res.json();
    setCategories(data);
  };

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.jpg"; // Fallback image

    // If imageUrl is already a full URL (starts with http:// or https://), use it as is
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    // If it's a relative path, prepend API_BASE_URL
    return `${API_BASE_URL}${imageUrl}`;
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearch(query);
    applyFilters(query, selectedCategory);
  };

  const handleCategoryChange = (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    applyFilters(search, cat);
  };

  const applyFilters = (query, categoryId) => {
    let result = items;

    if (categoryId !== "all") {
      result = result.filter((item) => item.category === categoryId);
    }

    if (query) {
      result = result.filter(
        (item) =>
          item.title.toLowerCase().includes(query) ||
          item.keywords.some((k) => k.toLowerCase().includes(query))
      );
    }

    setFiltered(result);
  };

  const handleRating = async (itemId, rating) => {
    try {
      const res = await fetch(
        createApiUrl(`${API_ENDPOINTS.ITEMS}/${itemId}/rate`),
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ rating }),
        }
      );

      if (res.ok) {
        const updatedItem = await res.json();
        setItems((prev) =>
          prev.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        setFiltered((prev) =>
          prev.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddToCartClick = (item) => {
    setSelectedItem(item);
    setQuantity(1);
    setShowAddToCartPopup(true);
  };

  const confirmAddToCart = () => {
    if (selectedItem && quantity > 0) {
      addToCart(selectedItem, quantity);
      setShowAddToCartPopup(false);
      setShowSuccessPopup(true);

      // Auto-close success popup after 2 seconds
      setTimeout(() => {
        setShowSuccessPopup(false);
      }, 2000);
    }
  };

  const closeAddToCartPopup = () => {
    setShowAddToCartPopup(false);
    setSelectedItem(null);
    setQuantity(1);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-4xl font-bold mb-6 text-purple-700">All Listings</h1>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search items..."
          value={search}
          onChange={handleSearch}
          className="flex-1 border-2 border-purple-300 px-4 py-2 rounded shadow-sm"
        />
        <select
          value={selectedCategory}
          onChange={handleCategoryChange}
          className="border-2 border-purple-300 px-4 py-2 rounded shadow-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {filtered.length === 0 ? (
        <p className="text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-xl shadow p-4 border border-pink-200 flex flex-col justify-between relative"
              style={{ minHeight: "460px" }}
            >
              {/* Already Added Tag */}
              {isInCart(item._id) && (
                <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center">
                  <span className="mr-1">✓</span>
                  Added
                </div>
              )}

              <Link href={`/item/${item._id}`}>
                <Image
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title || "Product image"}
                  width={400}
                  height={160}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                  style={{ objectFit: "cover" }}
                  unoptimized={true}
                />
              </Link>
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Link href={`/item/${item._id}`}>
                    <h2 className="text-xl font-semibold text-purple-800 hover:underline">
                      {item.title}
                    </h2>
                  </Link>
                  <p className="text-green-600 font-bold mt-1">
                    LKR {item.price}
                  </p>
                  <p className="text-sm text-gray-600 mt-1">
                    {item.description?.slice(0, 60)}...
                  </p>
                  <p className="text-xs text-pink-500 mt-1">
                    Tags: {item.keywords?.join(", ") || "No tags"}
                  </p>
                  <p className="text-yellow-500 text-sm mt-2">
                    ⭐ {item.rating?.toFixed(1) || "0.0"} ({item.ratedBy || 0}{" "}
                    ratings)
                  </p>
                  {user && (
                    <div className="mt-2 flex gap-1 text-xs text-purple-600">
                      {[1, 2, 3, 4, 5].map((num) => (
                        <button
                          key={num}
                          onClick={() => handleRating(item._id, num)}
                          className="hover:underline"
                        >
                          Rate {num}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  onClick={() => handleAddToCartClick(item)}
                  className="mt-4 w-full bg-green-500 text-white py-2 px-3 rounded-md hover:bg-green-600"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

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
        {selectedItem && (
          <div className="flex items-center gap-4">
            <Image
              src={getImageUrl(selectedItem.imageUrl)}
              alt={selectedItem.title || "Product image"}
              width={64}
              height={64}
              className="w-16 h-16 object-cover rounded"
              style={{ objectFit: "cover" }}
              unoptimized={true}
            />
            <div>
              <h3 className="font-semibold text-purple-800">
                {selectedItem.title}
              </h3>
              <p className="text-green-600 font-bold">
                LKR {selectedItem.price}
              </p>
            </div>
          </div>
        )}
      </CustomPopup>

      {/* Success Popup */}
      <CustomPopup
        isOpen={showSuccessPopup}
        onClose={() => setShowSuccessPopup(false)}
        title="Success!"
        onConfirm={() => setShowSuccessPopup(false)}
        confirmText="OK"
        hideButtons={true}
      >
        <div className="text-center">
          <div className="text-green-500 text-4xl mb-2">✓</div>
          <p className="text-gray-700">Item added to cart successfully!</p>
        </div>
      </CustomPopup>
    </div>
  );
}
