import type { Metadata } from "next";
import { Inter, IBM_Plex_Sans, Fira_Code } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-inter",
  display: "swap",
});

const plex = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const fira = Fira_Code({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-fira",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Framis — Engineering forward",
  description:
    "Learn to think like an engineer who builds with AI. Zero to full-stack AI engineer in 12 months.",
  icons: { icon: "/framis-mark.png" },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${plex.variable} ${fira.variable}`}>
      <body className="font-sans text-ink-900 bg-surface antialiased">{children}</body>
    </html>
  );
}
