import { useState } from "react";
import { useAppData } from "@/contexts/AppContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function CategoriesTab() {
  const { data, updateData } = useAppData();
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({ name: "", image: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editingCategory) {
      const updated = data.categories.map((cat: any) =>
        cat.id === editingCategory.id ? { ...cat, ...formData } : cat
      );
      updateData("categories", updated);
      toast({ title: "Category updated successfully" });
    } else {
      const newCategory = {
        id: Date.now().toString(),
        ...formData,
        count: 0,
        value: 0,
      };
      updateData("categories", [...data.categories, newCategory]);
      toast({ title: "Category created successfully" });
    }
    
    setIsOpen(false);
    setEditingCategory(null);
    setFormData({ name: "", image: "" });
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({ name: category.name, image: category.image });
    setIsOpen(true);
  };

  const handleDelete = (id: string) => {
    updateData("categories", data.categories.filter((cat: any) => cat.id !== id));
    toast({ title: "Category deleted successfully" });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Seed Categories</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => { setEditingCategory(null); setFormData({ name: "", image: "" }); }}>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="image">Emoji/Icon</Label>
                <Input
                  id="image"
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  placeholder="🌱"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                {editingCategory ? "Update" : "Create"} Category
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {data.categories.map((category: any) => {
          const categoryStock = data.stock.filter((item: any) => item.category === category.id);
          const count = categoryStock.length;
          const value = categoryStock.reduce((sum: number, item: any) => sum + (item.quantity * item.sellingPrice), 0);
          
          return (
            <Card key={category.id} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium">{category.name}</CardTitle>
                <div className="flex gap-1">
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(category)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-4xl mb-2">{category.image}</div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">Items in stock</p>
                  <p className="text-lg font-semibold text-primary">₹{value.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Total value</p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
