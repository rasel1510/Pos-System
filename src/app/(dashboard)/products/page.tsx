"use client";

import { useState } from "react";
import {
  Plus,
  Search,
  Grid,
  List,
  Edit2,
  Trash2,
  Filter,
  CheckCircle,
  XCircle,
  MoreVertical,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { products as initialProducts, businessSettings, categoryLabels } from "@/lib/mock-data";
import { Product, ProductCategory } from "@/lib/types";

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [viewMode, setViewMode] = useState<"table" | "grid">("table");
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  
  // Dialog States
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  // Form States for Add/Edit
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    category: "food" as ProductCategory,
    price: "",
    cost: "",
    stock: "",
    minStock: "",
    image: "🍔",
    description: "",
    status: "active" as "active" | "inactive",
    barcode: "",
    unit: "piece",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSelectChange = (field: string, value: string | null) => {
    setFormData((prev) => ({ ...prev, [field]: value || "" }));
  };

  const openAddDialog = () => {
    setFormData({
      name: "",
      sku: `PROD-${Date.now().toString().slice(-4)}`,
      category: "food",
      price: "",
      cost: "",
      stock: "",
      minStock: "10",
      image: "🍔",
      description: "",
      status: "active",
      barcode: Math.floor(1000000000 + Math.random() * 9000000000).toString(),
      unit: "piece",
    });
    setIsAddOpen(true);
  };

  const handleAddProduct = () => {
    const newProduct: Product = {
      id: `p-${Date.now()}`,
      name: formData.name,
      sku: formData.sku,
      category: formData.category,
      price: parseFloat(formData.price) || 0,
      cost: parseFloat(formData.cost) || 0,
      stock: parseInt(formData.stock) || 0,
      minStock: parseInt(formData.minStock) || 0,
      image: formData.image,
      description: formData.description,
      status: formData.status,
      barcode: formData.barcode,
      unit: formData.unit,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setProducts((prev) => [newProduct, ...prev]);
    setIsAddOpen(false);
  };

  const openEditDialog = (product: Product) => {
    setSelectedProduct(product);
    setFormData({
      name: product.name,
      sku: product.sku,
      category: product.category,
      price: product.price.toString(),
      cost: product.cost.toString(),
      stock: product.stock.toString(),
      minStock: product.minStock.toString(),
      image: product.image,
      description: product.description || "",
      status: product.status,
      barcode: product.barcode,
      unit: product.unit,
    });
    setIsEditOpen(true);
  };

  const handleEditProduct = () => {
    if (!selectedProduct) return;
    setProducts((prev) =>
      prev.map((p) =>
        p.id === selectedProduct.id
          ? {
              ...p,
              name: formData.name,
              sku: formData.sku,
              category: formData.category,
              price: parseFloat(formData.price) || 0,
              cost: parseFloat(formData.cost) || 0,
              stock: parseInt(formData.stock) || 0,
              minStock: parseInt(formData.minStock) || 0,
              image: formData.image,
              description: formData.description,
              status: formData.status,
              barcode: formData.barcode,
              unit: formData.unit,
            }
          : p
      )
    );
    setIsEditOpen(false);
    setSelectedProduct(null);
  };

  const handleDeleteProduct = (productId: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts((prev) => prev.filter((p) => p.id !== productId));
    }
  };

  // Filter products
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.barcode.includes(searchQuery);
    const matchesCategory =
      categoryFilter === "all" || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top action bar */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {/* Search bar */}
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <Input
              placeholder="Search products, SKU..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-10 rounded-xl border-white/[0.06] bg-white/[0.04] pl-10 text-sm text-slate-300 placeholder:text-slate-600 focus:border-blue-500/50 focus:ring-blue-500/20"
            />
          </div>

          {/* Category Filter */}
          <div className="w-48">
            <Select value={categoryFilter} onValueChange={(val) => setCategoryFilter(val || "all")}>
              <SelectTrigger className="h-10 rounded-xl border-white/[0.06] bg-[#0f1322] text-slate-300">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                <SelectItem value="all">All Categories</SelectItem>
                {Object.entries(categoryLabels).map(([val, label]) => (
                  <SelectItem key={val} value={val}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Action button & View Switcher */}
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl border border-white/[0.06] bg-white/[0.02] p-1">
            <button
              onClick={() => setViewMode("table")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "table"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`rounded-lg p-1.5 transition-colors ${
                viewMode === "grid"
                  ? "bg-blue-500/20 text-blue-400"
                  : "text-slate-500 hover:text-slate-300"
              }`}
            >
              <Grid className="h-4 w-4" />
            </button>
          </div>

          <Button
            onClick={openAddDialog}
            className="h-10 rounded-xl bg-gradient-to-r from-blue-500 to-violet-600 font-semibold text-white hover:from-blue-600 hover:to-violet-700"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </div>
      </div>

      {/* Product List container */}
      {viewMode === "table" ? (
        <Card className="border-white/[0.06] bg-white/[0.02] backdrop-blur-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="border-white/[0.06]">
                  <TableRow className="border-white/[0.06] hover:bg-transparent">
                    <TableHead className="w-12 text-slate-500">Icon</TableHead>
                    <TableHead className="text-slate-500">Name</TableHead>
                    <TableHead className="text-slate-500">SKU</TableHead>
                    <TableHead className="text-slate-500">Category</TableHead>
                    <TableHead className="text-right text-slate-500">Price</TableHead>
                    <TableHead className="text-right text-slate-500">Cost</TableHead>
                    <TableHead className="text-center text-slate-500">Stock</TableHead>
                    <TableHead className="text-slate-500">Status</TableHead>
                    <TableHead className="w-16 text-right text-slate-500"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredProducts.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="h-40 text-center text-slate-600">
                        No products found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredProducts.map((product) => (
                      <TableRow
                        key={product.id}
                        className="border-white/[0.04] hover:bg-white/[0.02] text-slate-300"
                      >
                        <TableCell className="text-lg text-center">{product.image}</TableCell>
                        <TableCell className="font-semibold text-white">
                          {product.name}
                        </TableCell>
                        <TableCell className="font-mono text-xs">{product.sku}</TableCell>
                        <TableCell className="capitalize text-slate-400">
                          {categoryLabels[product.category] || product.category}
                        </TableCell>
                        <TableCell className="text-right font-semibold text-white">
                          {businessSettings.currencySymbol}
                          {product.price}
                        </TableCell>
                        <TableCell className="text-right text-slate-400">
                          {businessSettings.currencySymbol}
                          {product.cost}
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
                        <TableCell>
                          <Badge
                            className={`border-0 text-[10px] font-semibold ${
                              product.status === "active"
                                ? "bg-emerald-500/10 text-emerald-400"
                                : "bg-slate-500/10 text-slate-500"
                            }`}
                          >
                            {product.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger render={
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 text-slate-400 hover:text-white"
                              />
                            }>
                              <MoreVertical className="h-4 w-4" />
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                              align="end"
                              className="border-white/[0.08] bg-[#0f1623] text-slate-300"
                            >
                              <DropdownMenuItem
                                onClick={() => openEditDialog(product)}
                                className="hover:bg-white/[0.04] cursor-pointer"
                              >
                                <Edit2 className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteProduct(product.id)}
                                className="text-rose-400 hover:bg-rose-500/10 focus:text-rose-400 cursor-pointer"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.length === 0 ? (
            <div className="col-span-full py-20 text-center text-slate-600">
              No products found
            </div>
          ) : (
            filteredProducts.map((product) => (
              <Card
                key={product.id}
                className="border-white/[0.06] bg-white/[0.02] overflow-hidden group hover:border-white/[0.1] transition-all"
              >
                <CardContent className="p-5 flex flex-col items-center text-center space-y-3">
                  <span className="text-4xl">{product.image}</span>
                  <div>
                    <h3 className="font-semibold text-white">{product.name}</h3>
                    <p className="text-xs text-slate-500 font-mono mt-0.5">{product.sku}</p>
                  </div>
                  <Badge className="bg-white/[0.04] text-slate-400 border-0 capitalize">
                    {categoryLabels[product.category] || product.category}
                  </Badge>
                  <div className="w-full grid grid-cols-2 gap-2 border-y border-white/[0.04] py-2 text-sm">
                    <div>
                      <p className="text-slate-500 text-xs">Selling Price</p>
                      <p className="font-semibold text-white mt-0.5">
                        {businessSettings.currencySymbol}
                        {product.price}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500 text-xs">Available Stock</p>
                      <p
                        className={`font-semibold mt-0.5 ${
                          product.stock === 0
                            ? "text-rose-500"
                            : product.stock <= product.minStock
                            ? "text-amber-500"
                            : "text-emerald-400"
                        }`}
                      >
                        {product.stock}
                      </p>
                    </div>
                  </div>
                  <div className="w-full flex justify-end gap-2 pt-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(product)}
                      className="h-8 text-xs text-slate-400 hover:text-white"
                    >
                      <Edit2 className="mr-1.5 h-3.5 w-3.5" />
                      Edit
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteProduct(product.id)}
                      className="h-8 text-xs text-rose-500/70 hover:text-rose-400 hover:bg-rose-500/10"
                    >
                      <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Add Product Dialog */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Add New Product</DialogTitle>
            <DialogDescription className="text-slate-500">
              Create a new item in your store inventory.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="e.g. Garlic Chicken Wrap"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU Code</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={handleInputChange}
                placeholder="SKU-001"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleSelectChange("category", val)}
              >
                <SelectTrigger className="border-white/[0.06] bg-white/[0.04] text-slate-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                  {Object.entries(categoryLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Emoji Icon / Image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={handleInputChange}
                placeholder="🍔, ☕, 🍰..."
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price ({businessSettings.currencySymbol})</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="0.00"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price ({businessSettings.currencySymbol})</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={handleInputChange}
                placeholder="0.00"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Initial Stock</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                placeholder="0"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock Limit</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleInputChange}
                placeholder="10"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Short description of the product"
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsAddOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddProduct}
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white"
              disabled={!formData.name || !formData.price}
            >
              Create Product
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="border-white/[0.08] bg-[#0f1623] text-slate-200 sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-white">Edit Product</DialogTitle>
            <DialogDescription className="text-slate-500">
              Update the specifications of your product.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sku">SKU Code</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => handleSelectChange("category", val)}
              >
                <SelectTrigger className="border-white/[0.06] bg-white/[0.04] text-slate-300">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                  {Object.entries(categoryLabels).map(([val, label]) => (
                    <SelectItem key={val} value={val}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">Emoji Icon / Image</Label>
              <Input
                id="image"
                value={formData.image}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Selling Price ({businessSettings.currencySymbol})</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cost">Cost Price ({businessSettings.currencySymbol})</Label>
              <Input
                id="cost"
                type="number"
                value={formData.cost}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="stock">Stock Level</Label>
              <Input
                id="stock"
                type="number"
                value={formData.stock}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="minStock">Min Stock Limit</Label>
              <Input
                id="minStock"
                type="number"
                value={formData.minStock}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={handleInputChange}
                className="border-white/[0.06] bg-white/[0.04]"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(val) => handleSelectChange("status", val)}
              >
                <SelectTrigger className="border-white/[0.06] bg-white/[0.04] text-slate-300">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="border-white/[0.08] bg-[#0f1623] text-slate-300">
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsEditOpen(false)}
              className="text-slate-400"
            >
              Cancel
            </Button>
            <Button
              onClick={handleEditProduct}
              className="bg-gradient-to-r from-blue-500 to-violet-600 text-white"
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
