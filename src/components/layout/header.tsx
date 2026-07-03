"use client";

import { usePathname } from "next/navigation";
import { Bell, Search, Moon, Sun, Maximize2 } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

const pageTitles: Record<string, string> = {
  "/dashboard": "Dashboard",
  "/pos": "Point of Sale",
  "/products": "Products",
  "/inventory": "Inventory",
  "/orders": "Orders",
  "/customers": "Customers",
  "/reports": "Reports",
  "/settings": "Settings",
};

export function Header() {
  const pathname = usePathname();
  const [darkMode, setDarkMode] = useState(true);
  const title = pageTitles[pathname] || "Dashboard";

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-white/[0.06] bg-[#0d1117]/80 px-6 backdrop-blur-xl">
      <div>
        <h2 className="text-lg font-semibold text-white">{title}</h2>
        <p className="text-xs text-slate-500">
          {new Date().toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <Input
            placeholder="Search anything..."
            className="h-9 w-64 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
          />
          <kbd className="absolute right-3 top-1/2 -translate-y-1/2 rounded border border-white/10 bg-white/[0.04] px-1.5 py-0.5 text-[10px] text-slate-500">
            ⌘K
          </kbd>
        </div>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200"
        >
          {darkMode ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
        </button>

        {/* Fullscreen */}
        <button
          onClick={() => {
            if (!document.fullscreenElement) {
              document.documentElement.requestFullscreen();
            } else {
              document.exitFullscreen();
            }
          }}
          className="hidden h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200 lg:flex"
        >
          <Maximize2 className="h-4 w-4" />
        </button>

        {/* Notifications */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/[0.06] text-slate-400 transition-colors hover:bg-white/[0.04] hover:text-slate-200">
          <Bell className="h-4 w-4" />
          <Badge className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-500 p-0 text-[9px] font-bold text-white border-0">
            3
          </Badge>
        </button>
      </div>
    </header>
  );
}
