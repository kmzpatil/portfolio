import type { Metadata, Viewport } from "next";
import "./globals.css";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#05050A",
};

export const metadata: Metadata = {
  metadataBase: new URL("https://kmzpatil.github.io"),
  title: "Kartik Patil — High-Performance Engineer",
  description: "Portfolio of Kartik Patil. Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI. IIT Kharagpur.",
  keywords: ["Kartik Patil", "Software Engineer", "Quant", "IIT Kharagpur", "Low-Latency", "C++", "Python", "Portfolio"],
  authors: [{ name: "Kartik Patil", url: "https://github.com/kmzpatil" }],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Kartik Patil — High-Performance Engineer",
    description: "Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI.",
    url: "https://kmzpatil.github.io",
    siteName: "Kartik Patil Portfolio",
    type: "profile",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Kartik Patil — High-Performance Engineer",
    description: "Full-Stack & Backend Engineer specializing in Low-Latency Systems, Quantitative Finance, and AI.",
  },
};
import CustomCursor from "@/components/CustomCursor";

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": "https://kmzpatil.github.io/#person",
      "name": "Kartik Patil",
      "jobTitle": "High-Performance Systems Engineer & Quantitative Developer",
      "alumnusOf": {
        "@type": "CollegeOrUniversity",
        "name": "Indian Institute of Technology Kharagpur"
      },
      "url": "https://kmzpatil.github.io",
      "sameAs": [
        "https://github.com/kmzpatil",
        "https://linkedin.com/in/kmzpatil",
        "https://codeforces.com/profile/kresol"
      ],
      "knowsAbout": [
        "C++20",
        "Low-Latency Systems",
        "Order Matching Engines",
        "Statistical Arbitrage",
        "Kalman Filter",
        "Distributed Systems",
        "Python",
        "Quantitative Finance"
      ]
    },
    {
      "@type": "ProfilePage",
      "@id": "https://kmzpatil.github.io/#webpage",
      "url": "https://kmzpatil.github.io",
      "name": "Kartik Patil — High-Performance Engineer",
      "isPartOf": {
        "@type": "WebSite",
        "@id": "https://kmzpatil.github.io/#website",
        "url": "https://kmzpatil.github.io",
        "name": "Kartik Patil Portfolio"
      },
      "about": { "@id": "https://kmzpatil.github.io/#person" },
      "primaryImageOfPage": {
        "@type": "ImageObject",
        "url": "https://kmzpatil.github.io/og-image.png"
      }
    }
  ]
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') /* sanitize: safe static json-ld */ }}
        />
      </head>
      <body className="antialiased">
        <CustomCursor />
        {children}
      </body>
    </html>
  );
}
