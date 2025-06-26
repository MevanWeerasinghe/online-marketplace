// src/components/AuthWrapper.js
"use client";

import { useUser, SignInButton } from "@clerk/nextjs";
import AuthButtons from "./AuthButtons";

export default function AuthWrapper({ children }) {
  const { user, isLoaded } = useUser();

  // Show loading state while authentication is being checked
  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-purple-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-700 mx-auto mb-4"></div>
          <p className="text-purple-700 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  // Show sign-in page if user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center border border-purple-200">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-purple-700 mb-2">
              Online Marketplace
            </h1>
            <p className="text-gray-600">
              Welcome! Please sign in to access the marketplace
            </p>
          </div>

          <div className="mb-6">
            <div className="bg-purple-50 rounded-lg p-4 mb-4">
              <h3 className="font-semibold text-purple-700 mb-2">
                🛒 What you can do:
              </h3>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Browse and search items</li>
                <li>• Add items to your cart</li>
                <li>• List items for sale</li>
                <li>• Rate and review products</li>
              </ul>
            </div>
          </div>

          <div className="space-y-4">
            <SignInButton mode="modal">
              <button className="w-full bg-purple-600 text-white py-3 px-6 rounded-lg hover:bg-purple-700 transition-colors font-medium">
                Sign In to Continue
              </button>
            </SignInButton>

            <p className="text-xs text-gray-500">
              By signing in, you agree to our terms of service and privacy
              policy
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Show the main app with header if user is authenticated
  return (
    <>
      <header className="p-4 flex justify-between items-center bg-pink-100 shadow">
        <h1 className="text-xl font-bold text-purple-700">
          Online Marketplace
        </h1>
        <div className="flex items-center gap-6">
          <a href="/" className="text-purple-700 font-medium hover:underline">
            Home
          </a>
          <a href="/sell" className="text-pink-600 font-medium hover:underline">
            Sell Item
          </a>
          <a
            href="/cart"
            className="text-green-600 font-medium hover:underline"
          >
            Cart
          </a>
          <AuthButtons />
        </div>
      </header>
      <main className="p-4">{children}</main>
    </>
  );
}
