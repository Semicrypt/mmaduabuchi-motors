import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title:
    "MMADUABUCHI MOTORS | Premium Cars in Cotonou, Lagos & Onitsha",

  description:
    "MMADUABUCHI MOTORS offers premium automobiles including Lexus, Mercedes-Benz, Toyota, Range Rover, AMG and Hilux across Cotonou, Lagos and Onitsha.",

  keywords: [
    "MMADUABUCHI MOTORS",
    "cars in Cotonou",
    "cars in Lagos",
    "cars in Onitsha",
    "Lexus Nigeria",
    "Mercedes Nigeria",
    "Range Rover Nigeria",
    "Toyota Hilux Nigeria",
    "luxury cars Nigeria",
    "cars Benin Republic",
  ],

  openGraph: {
    title: "MMADUABUCHI MOTORS",
    description:
      "Premium Cars. Exceptional Presence.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}