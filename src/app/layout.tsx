import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Chatbot from "@/components/Chatbot";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const metadata: Metadata = {
  title: "Nikhil Yadav | Data Analyst Portfolio",
  description: "Data Analyst | SQL | Python | Power BI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased dark`}
    >
      <head>
        <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet" />
      </head>
      <body className="font-sans min-h-full flex flex-col bg-black text-[#e2e2e2] selection:bg-[#adc6ff]/30 selection:text-[#adc6ff]">
        {children}
        <Chatbot />
      </body>
    </html>
  );
}

