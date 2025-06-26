// src/app/sell/page.js
"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createApiUrl, API_ENDPOINTS } from "../../config/api";

export default function SellPage() {
  const { user } = useUser();
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: "",
    price: "",
    description: "",
    keywords: "",
    category: "",
  });
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      const res = await fetch(createApiUrl(API_ENDPOINTS.CATEGORIES));
      const data = await res.json();
      setCategories(data);
    };
    fetchCategories();
  }, []);

  // Since AuthWrapper ensures user is authenticated, we don't need the check here
  // But we can add a loading state while user data loads
  if (!user) {
    return (
      <div className="text-center text-purple-700 mt-10 text-lg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700 mx-auto mb-4"></div>
        Loading...
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      // Create preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    try {
      const imgForm = new FormData();
      imgForm.append("image", image);

      const imgRes = await fetch(createApiUrl(API_ENDPOINTS.UPLOAD), {
        method: "POST",
        body: imgForm,
      });

      const { imageUrl } = await imgRes.json();

      const res = await fetch(createApiUrl(API_ENDPOINTS.ITEMS), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          keywords: formData.keywords.split(",").map((k) => k.trim()),
          imageUrl,
          userId: user.id,
        }),
      });

      if (res.ok) {
        alert("Item listed successfully!");
        router.push("/");
      } else {
        alert("Error listing item");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to upload item");
    } finally {
      setUploading(false);
      // Clean up the preview URL
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
        setImagePreview(null);
      }
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow mt-8 border border-purple-200">
      <h2 className="text-2xl font-bold mb-6 text-pink-600">
        List an Item for Sale
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="title"
          placeholder="Item Title"
          value={formData.title}
          onChange={handleChange}
          required
          className="w-full border-2 border-purple-300 px-4 py-2 rounded"
        />
        <input
          type="number"
          name="price"
          placeholder="Price (LKR)"
          value={formData.price}
          onChange={handleChange}
          required
          className="w-full border-2 border-purple-300 px-4 py-2 rounded"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          onChange={handleChange}
          className="w-full border-2 border-purple-300 px-4 py-2 rounded"
        />
        <input
          type="text"
          name="keywords"
          placeholder="Keywords (comma-separated)"
          value={formData.keywords}
          onChange={handleChange}
          className="w-full border-2 border-purple-300 px-4 py-2 rounded"
        />
        <select
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
          className="w-full border-2 border-purple-300 px-4 py-2 rounded"
        >
          <option value="">Select a category</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name}
            </option>
          ))}
        </select>
        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          required
          className="w-full border text-sm file:bg-purple-600 file:text-white file:px-4 file:py-2 file:rounded"
        />
        {imagePreview && (
          <Image
            src={imagePreview}
            alt="Image preview"
            width={128}
            height={128}
            className="h-32 object-cover mt-2 rounded"
            style={{ objectFit: "cover" }}
            unoptimized={true}
          />
        )}
        <button
          type="submit"
          disabled={uploading}
          className="w-full bg-pink-500 text-white py-2 rounded hover:bg-pink-600 disabled:opacity-50"
        >
          {uploading ? "Uploading..." : "List Item"}
        </button>
      </form>
    </div>
  );
}
