"use client";

import { useState } from "react";
import { Search, ScanBarcode, Minus, Plus, Trash2, Percent, Receipt, CreditCard, Smartphone, Banknote, Pause, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { products, businessSettings, categoryLabels } from "@/lib/mock-data";
import { usePosStore } from "@/hooks/use-pos-store";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/lib/types";

const categories: { value: string; label: string }[] = [
  { value: "all", label: "All Items" },
  { value: "beverages", label: "☕ Beverages" },
  { value: "food", label: "🍽️ Food" },
  { value: "snacks", label: "🍿 Snacks" },
  { value: "combos", label: "🎯 Combos" },
  { value: "desserts", label: "🍰 Desserts" },
];

export default function PosPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [showDiscountModal, setShowDiscountModal] = useState(false);
  const [showHeldOrders, setShowHeldOrders] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card" | "mobile">("cash");
  const [cashReceived, setCashReceived] = useState("");
  const [discountInput, setDiscountInput] = useState("");
  const [discountTypeInput, setDiscountTypeInput] = useState<"fixed" | "percentage">("fixed");
  const [completedOrder, setCompletedOrder] = useState<ReturnType<typeof pos.completeOrder>>(null);

  const pos = usePosStore();

  const filteredProducts = products.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || p.category === activeCategory;
    return matchesSearch && matchesCategory && p.status === "active";
  });

  const handlePay = () => {
    const order = pos.completeOrder(paymentMethod);
    if (order) {
      setCompletedOrder(order);
    }
    setShowPaymentModal(false);
    setCashReceived("");
  };

  const handleApplyDiscount = () => {
    const val = parseFloat(discountInput);
    if (!isNaN(val) && val >= 0) {
      pos.setDiscount(val);
      pos.setDiscountType(discountTypeInput);
    }
    setShowDiscountModal(false);
    setDiscountInput("");
  };

  const cashReceivedNum = parseFloat(cashReceived) || 0;
  const changeAmount = cashReceivedNum - pos.total;

  return (
    <div className="flex h-[calc(100vh-7rem)] gap-4">
      {/* Left Panel — Product Selection */}
      <div className="flex flex-1 flex-col">
        {/* Search */}
        <div className="mb-4 flex gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search products or scan barcode..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-11 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-slate-200 placeholder:text-slate-600 focus:border-blue-500/50"
            />
            <ScanBarcode className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-600" />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="mb-4 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setActiveCategory(cat.value)}
              className={cn(
                "rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200",
                activeCategory === cat.value
                  ? "bg-blue-500/20 text-blue-400 shadow-sm shadow-blue-500/10"
                  : "bg-white/[0.03] text-slate-400 hover:bg-white/[0.06] hover:text-slate-200"
              )}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <ScrollArea className="flex-1">
          <div className="grid grid-cols-2 gap-3 pb-4 md:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <button
                key={product.id}
                onClick={() => pos.addToCart(product)}
                disabled={product.stock === 0}
                className={cn(
                  "group relative flex flex-col items-center gap-2 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 text-center transition-all duration-200 hover:border-blue-500/30 hover:bg-blue-500/[0.04] hover:shadow-lg hover:shadow-blue-500/5 active:scale-[0.97]",
                  product.stock === 0 && "opacity-40 cursor-not-allowed"
                )}
              >
                <span className="text-3xl">{product.image}</span>
                <p className="text-sm font-medium text-slate-200 line-clamp-1">
                  {product.name}
                </p>
                <p className="text-lg font-bold text-blue-400">
                  {businessSettings.currencySymbol}{product.price}
                </p>
                {product.stock <= product.minStock && product.stock > 0 && (
                  <Badge className="absolute right-2 top-2 bg-amber-500/15 text-amber-400 border-0 text-[9px]">
                    Low
                  </Badge>
                )}
                {product.stock === 0 && (
                  <Badge className="absolute right-2 top-2 bg-rose-500/15 text-rose-400 border-0 text-[9px]">
                    Out
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </ScrollArea>
      </div>

      {/* Right Panel — Cart / Invoice */}
      <Card className="flex w-[380px] shrink-0 flex-col border-white/[0.06] bg-white/[0.02] backdrop-blur-sm xl:w-[420px]">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-base text-white flex items-center gap-2">
                <Receipt className="h-4 w-4 text-blue-400" />
                Invoice
              </CardTitle>
              <p className="text-xs text-slate-500 mt-0.5">
                {new Date().toLocaleDateString()} • {pos.cart.length} items
              </p>
            </div>
            <div className="flex gap-1.5">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs text-slate-400 hover:text-amber-400 hover:bg-amber-500/10"
                onClick={() => setShowHeldOrders(true)}
              >
                <Pause className="mr-1 h-3.5 w-3.5" />
                Held ({pos.heldOrders.length})
              </Button>
            </div>
          </div>
        </CardHeader>

        <Separator className="bg-white/[0.06]" />

        {/* Cart Items */}
        <ScrollArea className="flex-1 px-4">
          {pos.cart.length === 0 ? (
            <div className="flex h-40 flex-col items-center justify-center text-slate-600">
              <Receipt className="mb-2 h-10 w-10" />
              <p className="text-sm">No items in cart</p>
              <p className="text-xs mt-1">Click products to add</p>
            </div>
          ) : (
            <div className="space-y-2 py-3">
              {pos.cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex items-center gap-3 rounded-lg p-2 transition-colors hover:bg-white/[0.03]"
                >
                  <span className="text-xl">{item.product.image}</span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-slate-200">
                      {item.product.name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {businessSettings.currencySymbol}{item.product.price} each
                    </p>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => pos.updateQuantity(item.product.id, item.quantity - 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] text-slate-400 transition-colors hover:bg-white/[0.06]"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-medium text-white">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => pos.updateQuantity(item.product.id, item.quantity + 1)}
                      className="flex h-6 w-6 items-center justify-center rounded-md border border-white/[0.08] text-slate-400 transition-colors hover:bg-white/[0.06]"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>
                  <p className="w-16 text-right text-sm font-semibold text-slate-200">
                    {businessSettings.currencySymbol}{(item.product.price * item.quantity).toLocaleString()}
                  </p>
                  <button
                    onClick={() => pos.removeFromCart(item.product.id)}
                    className="text-slate-600 transition-colors hover:text-rose-400"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>

        {/* Totals */}
        <div className="border-t border-white/[0.06] p-4">
          <div className="space-y-2 text-sm">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal</span>
              <span>{businessSettings.currencySymbol}{pos.subtotal.toLocaleString()}</span>
            </div>
            {pos.discountAmount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Discount</span>
                <span>-{businessSettings.currencySymbol}{pos.discountAmount.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-400">
              <span>Tax ({businessSettings.taxRate}%)</span>
              <span>{businessSettings.currencySymbol}{pos.taxAmount.toFixed(0)}</span>
            </div>
            <Separator className="bg-white/[0.06]" />
            <div className="flex justify-between text-lg font-bold text-white">
              <span>Total</span>
              <span>{businessSettings.currencySymbol}{pos.total.toFixed(0)}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="mt-4 grid grid-cols-3 gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-amber-500/10 hover:text-amber-400 hover:border-amber-500/20"
              onClick={pos.holdOrder}
              disabled={pos.cart.length === 0}
            >
              <Pause className="mr-1 h-3.5 w-3.5" />
              Hold
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-violet-500/10 hover:text-violet-400 hover:border-violet-500/20"
              onClick={() => setShowDiscountModal(true)}
              disabled={pos.cart.length === 0}
            >
              <Percent className="mr-1 h-3.5 w-3.5" />
              Discount
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/[0.08] bg-white/[0.02] text-slate-400 hover:bg-rose-500/10 hover:text-rose-400 hover:border-rose-500/20"
              onClick={pos.clearCart}
              disabled={pos.cart.length === 0}
            >
              <X className="mr-1 h-3.5 w-3.5" />
              Clear
            </Button>
          </div>

          <Button
            className="mt-3 h-12 w-full rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 text-base font-bold text-white shadow-lg shadow-blue-500/25 hover:from-blue-600 hover:to-violet-700 transition-all duration-300"
            onClick={() => setShowPaymentModal(true)}
            disabled={pos.cart.length === 0}
          >
            <CreditCard className="mr-2 h-5 w-5" />
            Pay {businessSettings.currencySymbol}{pos.total.toFixed(0)}
          </Button>
        </div>
      </Card>

      {/* Payment Modal */}
      <Dialog open={showPaymentModal} onOpenChange={setShowPaymentModal}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">Complete Payment</DialogTitle>
            <DialogDescription className="text-slate-500">
              Total: {businessSettings.currencySymbol}{pos.total.toFixed(0)}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {([
                { method: "cash" as const, icon: Banknote, label: "Cash", color: "emerald" },
                { method: "card" as const, icon: CreditCard, label: "Card", color: "blue" },
                { method: "mobile" as const, icon: Smartphone, label: "Mobile", color: "violet" },
              ]).map((pm) => (
                <button
                  key={pm.method}
                  onClick={() => setPaymentMethod(pm.method)}
                  className={cn(
                    "flex flex-col items-center gap-2 rounded-xl border p-4 transition-all duration-200",
                    paymentMethod === pm.method
                      ? `border-${pm.color}-500/30 bg-${pm.color}-500/10 text-${pm.color}-400`
                      : "border-white/[0.06] bg-white/[0.02] text-slate-400 hover:bg-white/[0.04]"
                  )}
                  style={paymentMethod === pm.method ? {
                    borderColor: pm.color === "emerald" ? "rgba(16,185,129,0.3)" : pm.color === "blue" ? "rgba(59,130,246,0.3)" : "rgba(139,92,246,0.3)",
                    backgroundColor: pm.color === "emerald" ? "rgba(16,185,129,0.1)" : pm.color === "blue" ? "rgba(59,130,246,0.1)" : "rgba(139,92,246,0.1)",
                    color: pm.color === "emerald" ? "#34d399" : pm.color === "blue" ? "#60a5fa" : "#a78bfa",
                  } : {}}
                >
                  <pm.icon className="h-6 w-6" />
                  <span className="text-xs font-medium">{pm.label}</span>
                </button>
              ))}
            </div>

            {paymentMethod === "cash" && (
              <div>
                <label className="mb-2 block text-sm text-slate-400">
                  Cash Received
                </label>
                <Input
                  type="number"
                  placeholder="Enter amount..."
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="h-12 rounded-xl border-white/[0.06] bg-white/[0.04] text-lg font-bold text-white text-center placeholder:text-slate-600"
                />
                {cashReceivedNum > 0 && (
                  <div className="mt-3 flex justify-between rounded-lg bg-emerald-500/10 p-3">
                    <span className="text-sm text-emerald-400">Change</span>
                    <span className="text-lg font-bold text-emerald-400">
                      {businessSettings.currencySymbol}{changeAmount > 0 ? changeAmount.toFixed(0) : 0}
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setShowPaymentModal(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handlePay}
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white hover:from-blue-600 hover:to-violet-700"
              disabled={paymentMethod === "cash" && cashReceivedNum < pos.total}
            >
              Confirm Payment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Discount Modal */}
      <Dialog open={showDiscountModal} onOpenChange={setShowDiscountModal}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-sm">
          <DialogHeader>
            <DialogTitle className="text-white">Apply Discount</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setDiscountTypeInput("fixed")}
                className={cn(
                  "rounded-xl border p-3 text-sm font-medium transition-all",
                  discountTypeInput === "fixed"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                )}
              >
                Fixed Amount ({businessSettings.currencySymbol})
              </button>
              <button
                onClick={() => setDiscountTypeInput("percentage")}
                className={cn(
                  "rounded-xl border p-3 text-sm font-medium transition-all",
                  discountTypeInput === "percentage"
                    ? "border-blue-500/30 bg-blue-500/10 text-blue-400"
                    : "border-white/[0.06] bg-white/[0.02] text-slate-400"
                )}
              >
                Percentage (%)
              </button>
            </div>
            <Input
              type="number"
              placeholder={discountTypeInput === "fixed" ? "Enter amount..." : "Enter percentage..."}
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              className="h-12 rounded-xl border-white/[0.06] bg-white/[0.04] text-lg font-bold text-white text-center placeholder:text-slate-600"
            />
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setShowDiscountModal(false)} className="text-slate-400">
              Cancel
            </Button>
            <Button onClick={handleApplyDiscount} className="bg-gradient-to-r from-violet-500 to-purple-600 text-white">
              Apply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Held Orders Modal */}
      <Dialog open={showHeldOrders} onOpenChange={setShowHeldOrders}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Held Orders</DialogTitle>
            <DialogDescription className="text-slate-500">
              {pos.heldOrders.length} orders on hold
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-80">
            {pos.heldOrders.length === 0 ? (
              <p className="py-8 text-center text-slate-600">No held orders</p>
            ) : (
              <div className="space-y-3">
                {pos.heldOrders.map((order) => (
                  <div
                    key={order.id}
                    className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold text-white">{order.orderNumber}</span>
                      <Badge className="bg-amber-500/15 text-amber-400 border-0 text-[10px]">
                        Held
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      {order.items.map((item, i) => (
                        <p key={i} className="text-xs text-slate-500">
                          {item.quantity}x {item.productName} — {businessSettings.currencySymbol}{item.total}
                        </p>
                      ))}
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold text-white">
                        {businessSettings.currencySymbol}{order.total.toFixed(0)}
                      </span>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-blue-400 hover:bg-blue-500/10"
                        onClick={() => {
                          pos.resumeOrder(order.id);
                          setShowHeldOrders(false);
                        }}
                      >
                        Resume
                      </Button>
                    </div>
                    {order.note && (
                      <p className="mt-1 text-[11px] italic text-slate-600">{order.note}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Order Complete Modal */}
      <Dialog open={!!completedOrder} onOpenChange={() => setCompletedOrder(null)}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-sm">
          <div className="flex flex-col items-center py-4">
            <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/20">
              <svg className="h-8 w-8 text-emerald-400" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-white">Payment Successful!</h3>
            <p className="text-sm text-slate-500 mt-1">
              Order {completedOrder?.orderNumber}
            </p>
            <p className="mt-3 text-3xl font-bold text-emerald-400">
              {businessSettings.currencySymbol}{completedOrder?.total.toFixed(0)}
            </p>
            <div className="mt-6 flex gap-3">
              <Button
                variant="outline"
                className="border-white/[0.08] text-slate-400"
                onClick={() => setCompletedOrder(null)}
              >
                <Receipt className="mr-2 h-4 w-4" />
                Print Receipt
              </Button>
              <Button
                className="bg-blue-500 text-white hover:bg-blue-600"
                onClick={() => setCompletedOrder(null)}
              >
                New Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
