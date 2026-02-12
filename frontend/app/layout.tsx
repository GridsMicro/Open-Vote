import type { Metadata } from "next";
import { Inter, Outfit, Prompt } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const prompt = Prompt({
  variable: "--font-prompt",
  weight: ["300", "400", "500", "600"],
  subsets: ["thai", "latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Open-Vote | Thailand's Verifiable e-Voting Infrastructure",
  description: "ระบบลงคะแนนเสียงที่โปร่งใส ตรวจสอบได้ด้วยคณิตศาสตร์ สำหรับนวัตกรรมประชาธิปไตยยุคใหม่",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className="scroll-smooth">
      <body
        className={`${inter.variable} ${outfit.variable} ${prompt.variable} antialiased font-prompt`}
      >
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
