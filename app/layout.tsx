import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Newsreader } from "next/font/google";
import "./globals.css";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const serif = Newsreader({ subsets: ["latin"], style: ["normal", "italic"], axes: ["opsz"], variable: "--font-serif", display: "swap" });

export const metadata: Metadata = {
  title: "Addie 18",
  description: "18 songs I think you should meet.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#3D1738",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${display.variable} ${serif.variable}`}>
      <body>{children}</body>
    </html>
  );
}
