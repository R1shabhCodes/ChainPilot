import type { Metadata } from "next";
import { Outfit, Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import PrivyProviderWrapper from "./providers/PrivyProviderWrapper";

const fontOutfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  display: "swap",
});

const fontJakarta = Plus_Jakarta_Sans({
  variable: "--font-plus-jakarta",
  subsets: ["latin"],
  display: "swap",
});

const fontJetBrains = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "ChainPilot — AI DeFi Risk & Portfolio Copilot",
  description: "Evidence-backed AI copilot turning on-chain data into transparent risk evaluations and user-approved actions.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${fontOutfit.variable} ${fontJakarta.variable} ${fontJetBrains.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
        <PrivyProviderWrapper>{children}</PrivyProviderWrapper>
      </body>
    </html>
  );
}
