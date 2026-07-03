"use client";

import { useState } from "react";
import {
  Settings,
  Store,
  Percent,
  Receipt,
  Eye,
  Check,
  Save,
  Moon,
  Sun,
  ShieldAlert,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { businessSettings as initialSettings } from "@/lib/mock-data";
import { BusinessSettings } from "@/lib/types";

export default function SettingsPage() {
  const [settings, setSettings] = useState<BusinessSettings>(initialSettings);
  const [isSaved, setIsSaved] = useState(false);
  const [enableSound, setEnableSound] = useState(true);
  const [enableBarcodeScanner, setEnableBarcodeScanner] = useState(true);
  const [darkMode, setDarkMode] = useState(true);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setSettings((prev) => ({ ...prev, [id]: value }));
  };

  const handleTaxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, taxRate: parseFloat(e.target.value) || 0 }));
  };

  const handleSaveSettings = () => {
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2000);
  };

  const toggleTheme = (val: boolean) => {
    setDarkMode(val);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      {/* Left panel inputs */}
      <div className="space-y-6 lg:col-span-2">
        {/* Business Settings Card */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Store className="h-4.5 w-4.5 text-blue-400" />
              Business Profile
            </CardTitle>
            <CardDescription className="text-slate-500">
              Identity parameters printed on customer receipt vouchers.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="storeName">Business / Brand Name</Label>
                <Input
                  id="storeName"
                  value={settings.storeName}
                  onChange={handleInputChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Store Phone Number</Label>
                <Input
                  id="phone"
                  value={settings.phone}
                  onChange={handleInputChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Support Email Address</Label>
                <Input
                  id="email"
                  value={settings.email}
                  onChange={handleInputChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Store Currency Symbol</Label>
                <Input
                  id="currencySymbol"
                  value={settings.currencySymbol}
                  onChange={handleInputChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
              <div className="space-y-2 sm:col-span-2">
                <Label htmlFor="address">Full Address Location</Label>
                <Input
                  id="address"
                  value={settings.address}
                  onChange={handleInputChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Config Settings Card */}
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Percent className="h-4.5 w-4.5 text-violet-400" />
              Tax & Operations Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="taxRate">VAT / Sales Tax Rate (%)</Label>
                <Input
                  id="taxRate"
                  type="number"
                  value={settings.taxRate}
                  onChange={handleTaxChange}
                  className="border-white/[0.06] bg-white/[0.04]"
                />
              </div>
            </div>

            <Separator className="bg-white/[0.06]" />

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Receipt Printing Alerts</p>
                  <p className="text-xs text-slate-500">Play confirmation chime on cart checkout completion.</p>
                </div>
                <Switch checked={enableSound} onCheckedChange={setEnableSound} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Barcode auto-focus detection</p>
                  <p className="text-xs text-slate-500">Trigger scan focus trigger automatically during POS page load.</p>
                </div>
                <Switch checked={enableBarcodeScanner} onCheckedChange={setEnableBarcodeScanner} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-200">Dark Mode Interface</p>
                  <p className="text-xs text-slate-500">Enable premium default dark screen styles.</p>
                </div>
                <Switch checked={darkMode} onCheckedChange={toggleTheme} />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer actions */}
        <div className="flex justify-end gap-3">
          <Button
            onClick={handleSaveSettings}
            className="rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-white font-semibold"
          >
            {isSaved ? (
              <>
                <Check className="mr-2 h-4 w-4 text-emerald-400" />
                Settings Saved
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Right panel live preview */}
      <div className="space-y-6">
        <Card className="border-white/[0.06] bg-white/[0.02]">
          <CardHeader>
            <CardTitle className="text-base text-white flex items-center gap-2">
              <Receipt className="h-4.5 w-4.5 text-blue-400" />
              Receipt Live Preview
            </CardTitle>
            <CardDescription className="text-slate-500">
              Render of output receipt template
            </CardDescription>
          </CardHeader>
          <CardContent className="bg-white text-slate-900 font-mono text-xs p-5 rounded-xl border border-slate-200 max-w-sm mx-auto shadow-xl">
            <div className="text-center space-y-1.5 mb-4">
              <h3 className="font-bold text-sm uppercase tracking-wide">{settings.storeName}</h3>
              <p className="text-[10px] text-slate-600 leading-relaxed">{settings.address}</p>
              <p className="text-[10px] text-slate-600">{settings.phone}</p>
            </div>
            <Separator className="bg-slate-300 my-2" />
            <div className="flex justify-between text-[10px] text-slate-500 my-1">
              <span>ORD-2026-0099</span>
              <span>{new Date().toLocaleDateString()}</span>
            </div>
            <Separator className="bg-slate-300 my-2" />
            <div className="space-y-2.5 my-3">
              <div className="flex justify-between">
                <span>1x Classic Burger</span>
                <span>{settings.currencySymbol}550.00</span>
              </div>
              <div className="flex justify-between">
                <span>1x French Fries</span>
                <span>{settings.currencySymbol}220.00</span>
              </div>
            </div>
            <Separator className="bg-slate-300 my-2" />
            <div className="space-y-1.5 text-right font-semibold">
              <div className="flex justify-between text-[10px]">
                <span>Subtotal</span>
                <span>{settings.currencySymbol}770.00</span>
              </div>
              <div className="flex justify-between text-[10px]">
                <span>VAT / Tax ({settings.taxRate}%)</span>
                <span>{settings.currencySymbol}{(770 * settings.taxRate / 100).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xs pt-1.5 border-t border-slate-300 font-bold">
                <span>Total Amount</span>
                <span>{settings.currencySymbol}{(770 + 770 * settings.taxRate / 100).toFixed(2)}</span>
              </div>
            </div>
            <Separator className="bg-slate-300 my-3" />
            <div className="text-center text-[10px] text-slate-600 italic">
              {businessSettings.receiptFooter}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
