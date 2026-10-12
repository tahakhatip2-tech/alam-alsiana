import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import AgentWidget from "@/components/AgentWidget";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  variable: "--font-cairo",
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
});

export const metadata: Metadata = {
  title: "عالم الصيانة | منصة الفنيين الأولى في الأردن",
  description: "المنصة الشاملة لتشخيص أعطال الهاردوير، تتبع مسارات اللوحات، سوق البوردات، وتسعير القطع.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable}>
      <body className="bg-[#0A0A0A] text-[#F3F4F6] min-h-screen flex flex-col antialiased selection:bg-[#FFC400] selection:text-black font-sans">
        {/* Modern Categorized Navbar */}
        <Navbar />

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col">{children}</main>

        {/* AI Shop Agent (Amer) Floating Widget */}
        <AgentWidget />

        {/* Footer */}
        <footer className="border-t border-[#1C1C1C] bg-[#080808] py-8 text-neutral-500 text-xs print:hidden">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="text-[#FFC400] font-bold">عالم الصيانة</span>
              <span>— مخصص لفنيي صيانة الهواتف الذكية في الأردن</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-400">
              <Link href="/admin" className="hover:text-[#FFC400] transition-colors">
                لوحة التحكم الإدارية
              </Link>
              <span>•</span>
              <span>دردشة صفقات فورية</span>
              <span>•</span>
              <span className="text-emerald-400">Offline-Ready</span>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
