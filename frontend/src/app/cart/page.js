// src/app/cart/page.js
"use client";

import Image from "next/image";
import useCart from "../../hooks/useCart";
import { useRouter } from "next/navigation";
import { API_BASE_URL } from "../../config/api";

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  } = useCart();
  const router = useRouter();

  // Helper function to get the correct image URL
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/placeholder.jpg";

    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }

    return `${API_BASE_URL}${imageUrl}`;
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(itemId);
    } else {
      updateQuantity(itemId, newQuantity);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-6">
      <h1 className="text-3xl font-bold mb-6 text-purple-700">Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="mb-4 text-purple-700">
            <p className="text-lg font-semibold">
              {getTotalItems()} item{getTotalItems() !== 1 ? "s" : ""} in your
              cart
            </p>
          </div>

          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item._id}
                className="flex flex-col md:flex-row gap-4 items-center border p-4 rounded-lg shadow bg-white border-purple-100"
              >
                <Image
                  src={getImageUrl(item.imageUrl)}
                  alt={item.title || "Cart item"}
                  width={112}
                  height={112}
                  className="w-28 h-28 object-cover rounded"
                  style={{ objectFit: "cover" }}
                  unoptimized={true}
                />
                <div className="flex-1 text-center md:text-left">
                  <h2 className="text-lg font-semibold text-purple-800">
                    {item.title}
                  </h2>
                  <p className="text-green-600 font-bold">LKR {item.price}</p>
                  <p className="text-sm text-gray-600">
                    Subtotal: LKR {(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <label className="text-sm font-medium text-gray-700">
                    Qty:
                  </label>
                  <div className="flex items-center border border-gray-300 rounded">
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity - 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) =>
                        handleQuantityChange(
                          item._id,
                          parseInt(e.target.value) || 1
                        )
                      }
                      className="w-16 text-center py-1 border-0 focus:outline-none"
                      min="1"
                    />
                    <button
                      onClick={() =>
                        handleQuantityChange(item._id, item.quantity + 1)
                      }
                      className="px-2 py-1 hover:bg-gray-100 text-gray-600"
                    >
                      +
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => removeFromCart(item._id)}
                  className="text-red-500 font-medium hover:underline"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          <div className="mt-8 border-t pt-4 text-right">
            <p className="text-xl font-semibold text-purple-700 mb-4">
              Total:{" "}
              <span className="text-green-700">
                LKR {getTotalPrice().toFixed(2)}
              </span>
            </p>
            <button
              onClick={() => {
                alert("Mock payment completed!");
                clearCart();
                router.push("/");
              }}
              className="bg-green-500 text-white px-6 py-2 rounded-md hover:bg-green-600 transition"
            >
              Checkout (No Payment)
            </button>
          </div>
        </>
      )}
    </div>
  );
}
