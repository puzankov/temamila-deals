import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export const metadata: Metadata = {
  metadataBase: new URL("https://temamila.com"),
  title: {
    default: "Temamila Deals — Curated Real Estate Investment Deals",
    template: "%s · Temamila Deals",
  },
  description:
    "Browse curated off-market and creative-finance real estate deals — seller finance, subject-to, cash, fix & flip, STR and more.",
  openGraph: {
    title: "Temamila Deals",
    description: "Curated off-market and creative-finance real estate deals.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col bg-white">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
