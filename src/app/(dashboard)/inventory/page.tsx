"use client";

import { useState } from "react";
import {
  Warehouse,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingUp,
  Search,
  Plus,
  Minus,
  History,
  CheckCircle,
  Package,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import {
  products as initialProducts,
  stockMovements as initialMovements,
  categoryLabels,
  businessSettings,
} from "@/lib/mock-data";
import { Product, StockMovement } from "@/lib/types";

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [movements, setMovements] = useState<StockMovement[]>(initialMovements);
  const [searchQuery, setSearchQuery] = useState("");
  const [stockFilter, setStockFilter] = useState<"all" | "low" | "out" | "good">("all");
  
  // Dialog State
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [adjustmentQty, setAdjustmentQty] = useState("");
  const [adjustmentType, setAdjustmentType] = useState<"add" | "remove">("add");
  const [adjustmentNote, setAdjustmentNote] = useState("");

  const totalItems = products.length;
  const lowStockCount = products.filter((p) => p.stock <= p.minStock && p.stock > 0).length;
  const outOfStockCount = products.filter((p) => p.stock === 0).length;
  const goodStockCount = totalItems - lowStockCount - outOfStockCount;

  // Filter products based on search & stock filters
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === "low") {
      return matchesSearch && p.stock <= p.minStock && p.stock > 0;
    }
    if (stockFilter === "out") {
      return matchesSearch && p.stock === 0;
    }
    if (stockFilter === "good") {
      return matchesSearch && p.stock > p.minStock;
    }
    return matchesSearch;
  });

  const openAdjustDialog = (product: Product, type: "add" | "remove") => {
    setSelectedProduct(product);
    setAdjustmentType(type);
    setAdjustmentQty("");
    setAdjustmentNote("");
    setIsAdjustOpen(true);
  };

  const handleAdjustStock = () => {
    if (!selectedProduct || !adjustmentQty) return;

    const qty = parseInt(adjustmentQty);
    if (isNaN(qty) || qty <= 0) return;

    const finalQtyChange = adjustmentType === "add" ? qty : -qty;
    const previousStock = selectedProduct.stock;
    const newStock = Math.max(0, previousStock + finalQtyChange);

    // Update product stock
    setProducts((prev) =>
      prev.map((p) => (p.id === selectedProduct.id ? { ...p, stock: newStock } : p))
    );

    // Add movement history record
    const newMovement: StockMovement = {
      id: `sm-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      type: adjustmentType === "add" ? "in" : "out",
      quantity: qty,
      previousStock,
      newStock,
      note: adjustmentNote || (adjustmentType === "add" ? "Manual Restock" : "Manual Adjustment"),
      date: new Date().toISOString().split("T")[0],
    };

    setMovements((prev) => [newMovement, ...prev]);
    setIsAdjustOpen(false);
    setSelectedProduct(null);
  };

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Card
          onClick={() => setStockFilter("all")}
          className={`cursor-pointer border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 ${
            stockFilter === "all" ? "border-blue-500/30 bg-blue-500/[0.02]" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Total Items
              </p>
              <p className="text-2xl font-bold text-white mt-1">{totalItems}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-blue-400">
              <Warehouse className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStockFilter("good")}
          className={`cursor-pointer border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 ${
            stockFilter === "good" ? "border-emerald-500/30 bg-emerald-500/[0.02]" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Healthy Stock
              </p>
              <p className="text-2xl font-bold text-emerald-400 mt-1">{goodStockCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <CheckCircle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStockFilter("low")}
          className={`cursor-pointer border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 ${
            stockFilter === "low" ? "border-amber-500/30 bg-amber-500/[0.02]" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Low Stock
              </p>
              <p className="text-2xl font-bold text-amber-500 mt-1">{lowStockCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 text-amber-400">
              <AlertTriangle className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>

        <Card
          onClick={() => setStockFilter("out")}
          className={`cursor-pointer border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-200 ${
            stockFilter === "out" ? "border-rose-500/30 bg-rose-500/[0.02]" : ""
          }`}
        >
          <CardContent className="p-5 flex items-center justify-between">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Out of Stock
              </p>
              <p className="text-2xl font-bold text-rose-500 mt-1">{outOfStockCount}</p>
            </div>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-rose-500/10 text-rose-400">
              <Package className="h-5 w-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="stock" className="w-full">
        <TabsList className="bg-white/[0.03] border border-white/[0.06] mb-4">
          <TabsTrigger value="stock" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Stock Management
          </TabsTrigger>
          <TabsTrigger value="history" className="data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
            Stock Movement History
          </TabsTrigger>
        </TabsList>

        {/* Stock Management Tab */}
        <TabsContent value="stock" className="space-y-4 outline-none">
          <div className="flex items-center gap-3">
            <div className="relative w-full max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
              <Input
                placeholder="Search inventory, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-10 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50"
              />
            </div>
            {stockFilter !== "all" && (
              <Badge
                variant="secondary"
                onClick={() => setStockFilter("all")}
                className="cursor-pointer bg-white/[0.06] text-slate-400 hover:bg-white/[0.1] border-0"
              >
                Clear filter ({stockFilter})
              </Badge>
            )}
          </div>

          <Card className="border-white/[0.06] bg-white/[0.02]">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-white/[0.06]">
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-500">Product</TableHead>
                    <TableHead className="text-slate-500">SKU</TableHead>
                    <TableHead className="text-slate-500">Category</TableHead>
                    <TableHead className="text-center text-slate-500">Current Stock</TableHead>
                    <TableHead className="text-center text-slate-500">Min Alert Stock</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="w-40 text-right text-slate-500">Stock Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-40 text-center text-slate-600">
                        No inventory matches found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] text-slate-300"
                      >
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <span className="text-xl">{product.image}</span>
                            <div className="font-semibold text-white">{product.name}</div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="capitalize text-slate-400">
                          {categoryLabels[product.category] || product.category}
                        </TableCell>
                        <TableCell className="text-center">
                          <span
                            className={`font-semibold ${
                              product.stock === 0
                                ? "text-rose-500"
                                : product.stock <= product.minStock
                                ? "text-amber-500"
                                : "text-emerald-400"
                            }`}
                          >
                            {product.stock} {product.unit}(s)
                          </span>
                        </TableCell>
                        <TableCell className="text-center text-slate-400">
                          {product.minStock} {product.unit}(s)
                        </TableCell>
                        <TableCell>
                          {product.stock === 0 ? (
                            <Badge className="bg-rose-500/10 text-rose-500 border-0 text-[10px]">
                              Out of Stock
                            </Badge>
                          ) : product.stock <= product.minStock ? (
                            <Badge className="bg-amber-500/10 text-amber-500 border-0 text-[10px]">
                              Low Stock
                            </Badge>
                          ) : (
                            <Badge className="bg-emerald-500/10 text-emerald-500 border-0 text-[10px]">
                              In Stock
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1.5">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAdjustDialog(product, "add")}
                              className="h-8 border-white/[0.06] bg-white/[0.02] text-emerald-400 hover:bg-emerald-500/10 hover:text-emerald-400"
                            >
                              <Plus className="mr-1 h-3.5 w-3.5" />
                              Add
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openAdjustDialog(product, "remove")}
                              className="h-8 border-white/[0.06] bg-white/[0.02] text-rose-400 hover:bg-rose-500/10 hover:text-rose-400"
                            >
                              <Minus className="mr-1 h-3.5 w-3.5" />
                              Remove
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Stock Movement History Tab */}
        <TabsContent value="history" className="outline-none">
          <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
            <CardHeader className="pb-3">
              <CardTitle className="text-base text-white flex items-center gap-2">
                <History className="h-4 w-4 text-blue-400" />
                Movement Log
              </CardTitle>
              <CardDescription className="text-slate-500">
                Audit record of inventory changes
              </CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <Table>
                <TableHeader className="border-white/[0.06]">
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="text-slate-500">Date</TableHead>
                    <TableHead className="text-slate-500">Product</TableHead>
                    <TableHead className="text-slate-500">Adjustment Type</TableHead>
                    <TableHead className="text-center text-slate-500">Quantity</TableHead>
                    <TableHead className="text-center text-slate-500">Previous Stock</TableHead>
                    <TableHead className="text-center text-slate-500">New Stock</TableHead>
                    <TableHead className="text-slate-500">Note</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movements.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-40 text-center text-slate-600">
                        No movement records found
                      </TableCell>
                    </TableRow>
                  ) : (
                    movements.map((move) => (
                      <TableRow
                        key={move.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] text-slate-300"
                      >
                        <TableCell className="text-slate-400">{move.date}</TableCell>
                        <TableCell className="font-semibold text-white">
                          {move.productName}
                        </TableCell>
                        <TableCell>
                          {move.type === "in" ? (
                            <Badge className="bg-emerald-500/10 text-emerald-400 border-0 text-[10px]">
                              Stock In / Restock
                            </Badge>
                          ) : move.type === "out" ? (
                            <Badge className="bg-rose-500/10 text-rose-400 border-0 text-[10px]">
                              Stock Out / Sold
                            </Badge>
                          ) : (
                            <Badge className="bg-amber-500/10 text-amber-400 border-0 text-[10px]">
                              Adjustment
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-center font-bold">
                          {move.type === "in" ? (
                            <span className="text-emerald-400">+{move.quantity}</span>
                          ) : (
                            <span className="text-rose-400">-{move.quantity}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center text-slate-500">
                          {move.previousStock}
                        </TableCell>
                        <TableCell className="text-center font-semibold text-white">
                          {move.newStock}
                        </TableCell>
                        <TableCell className="text-slate-400 text-xs italic">{move.note}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Stock Adjustment Modal */}
      <Dialog open={isAdjustOpen} onOpenChange={setIsAdjustOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white">
              {adjustmentType === "add" ? "Restock Product" : "Reduce Product Stock"}
            </DialogTitle>
            <DialogDescription className="text-slate-500">
              Adjust stock level for <span className="text-white font-semibold">{selectedProduct?.name}</span>
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-3">
            <div className="flex justify-between items-center bg-white/[0.02] border border-white/[0.06] p-3 rounded-lg">
              <span className="text-slate-400 text-sm">Current Stock:</span>
              <span className="font-semibold text-white text-lg">
                {selectedProduct?.stock} {selectedProduct?.unit}(s)
              </span>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qty">
                Quantity to {adjustmentType === "add" ? "Add" : "Remove"}
              </Label>
              <Input
                id="qty"
                type="number"
                value={adjustmentQty}
                onChange={(e) => setAdjustmentQty(e.target.value)}
                placeholder="Enter quantity..."
                className="border-white/[0.06] bg-white/[0.04] text-lg font-semibold text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="note">Adjustment Note</Label>
              <Textarea
                id="note"
                value={adjustmentNote}
                onChange={(e) => setAdjustmentNote(e.target.value)}
                placeholder="e.g. Delivery batch #01, wastage reduction..."
                className="border-white/[0.06] bg-white/[0.04] min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAdjustOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAdjustStock}
              className={
                adjustmentType === "add"
                  ? "bg-emerald-500 text-white hover:bg-emerald-600"
                  : "bg-rose-500 text-white hover:bg-rose-600"
              }
              disabled={!adjustmentQty}
            >
              Confirm Adjustment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
