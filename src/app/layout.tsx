import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05050A",
};

export const metadata: Metadata = {
  title: "Kartik Patil — High-Performance Engineer",
  description: "Portfolio of Kartik Patil. Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI. IIT Kharagpur.",
  keywords: ["Kartik Patil", "Software Engineer", "Quant", "IIT Kharagpur", "Low-Latency", "C++", "Python", "Portfolio"],
  authors: [{ name: "Kartik Patil" }],
  openGraph: {
    title: "Kartik Patil — High-Performance Engineer",
    description: "Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI.",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Patil — High-Performance Engineer",
    description: "Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI.",
  },
};
import CustomCursor from "@/components/CustomCursor";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
