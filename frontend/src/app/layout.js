// src/app/layout.js
import { ClerkProvider } from "@clerk/nextjs";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthWrapper from "../components/AuthWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Online Marketplace",
  description: "Buy and sell items",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} bg-purple-50 min-h-screen`}>
          <AuthWrapper>{children}</AuthWrapper>
        </body>
      </html>
    </ClerkProvider>
  );
}
