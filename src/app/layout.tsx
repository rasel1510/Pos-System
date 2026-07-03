import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Neuravixor POS System",
  description:
    "Professional Point of Sale system — Sales, billing, inventory, and customer management made easy",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} dark h-full antialiased`}>
      <body className="min-h-full bg-[#0d1117] font-sans text-slate-200">
        <TooltipProvider>{children}</TooltipProvider>
      </body>
    </html>
  );
}
