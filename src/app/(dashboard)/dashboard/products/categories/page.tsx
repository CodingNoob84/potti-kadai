"use client";
import {
  ChevronDown,
  ChevronRight,
  Edit,
  Folder,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import React, { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";

type Category = {
  id: number;
  name: string;
  slug: string;
  description: string;
  productCount: number;
  isActive: boolean;
  subcategories: string[];
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Men's Fashion",
    slug: "mens",
    description: "Clothing and accessories for men",
    productCount: 234,
    isActive: true,
    subcategories: ["T-Shirts", "Shirts", "Pants", "Jeans", "Jackets", "Shoes"],
  },
  {
    id: 2,
    name: "Women's Fashion",
    slug: "womens",
    description: "Clothing and accessories for women",
    productCount: 345,
    isActive: true,
    subcategories: [
      "T-Shirts",
      "Shirts",
      "Dresses",
      "Pants",
      "Skirts",
      "Shoes",
    ],
  },
  {
    id: 3,
    name: "Kids Fashion",
    slug: "kids",
    description: "Clothing for children",
    productCount: 156,
    isActive: true,
    subcategories: [
      "Boys T-Shirts",
      "Girls T-Shirts",
      "Boys Shirts",
      "Girls Dresses",
      "Kids Pants",
      "Kids Shoes",
    ],
  },
];

export default function CategoriesPage() {
  const [expanded, setExpanded] = useState<number | null>(null);
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [isSubcategoryModalOpen, setIsSubcategoryModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [currentCategoryId, setCurrentCategoryId] = useState<number | null>(
    null
  );
  const [newSubcategory, setNewSubcategory] = useState("");
  const [editingSubcategory, setEditingSubcategory] = useState<{
    index: number;
    value: string;
  } | null>(null);
  const [categoryForm, setCategoryForm] = useState<
    Omit<Category, "id" | "productCount" | "subcategories"> & {
      id?: number;
      subcategories: string[];
    }
  >({
    name: "",
    slug: "",
    description: "",
    isActive: true,
    subcategories: [],
  });

  const toggleRow = (id: number) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const startEditing = (index: number, value: string) => {
    setEditingSubcategory({ index, value });
  };

  // Subcategory Modal Functions
  const openSubcategoryModal = (categoryId: number) => {
    setCurrentCategoryId(categoryId);
    const category = categories.find((c) => c.id === categoryId);
    if (category) {
      setCategoryForm({
        ...categoryForm,
        subcategories: [...category.subcategories],
      });
    }
    setIsSubcategoryModalOpen(true);
  };

  const addSubcategory = () => {
    if (!newSubcategory.trim() || currentCategoryId === null) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === currentCategoryId
          ? {
              ...cat,
              subcategories: [...cat.subcategories, newSubcategory.trim()],
            }
          : cat
      )
    );
    setNewSubcategory("");
  };

  const saveSubcategoryEdit = () => {
    if (
      !editingSubcategory ||
      currentCategoryId === null ||
      !editingSubcategory.value.trim()
    )
      return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === currentCategoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.map((sub, idx) =>
                idx === editingSubcategory.index
                  ? editingSubcategory.value
                  : sub
              ),
            }
          : cat
      )
    );
    setEditingSubcategory(null);
  };

  const deleteSubcategory = (index: number) => {
    if (currentCategoryId === null) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === currentCategoryId
          ? {
              ...cat,
              subcategories: cat.subcategories.filter((_, i) => i !== index),
            }
          : cat
      )
    );
  };

  // Category CRUD Functions
  const openNewCategoryModal = () => {
    setCategoryForm({
      name: "",
      slug: "",
      description: "",
      isActive: true,
      subcategories: [],
    });
    setIsCategoryModalOpen(true);
  };

  const openEditCategoryModal = (category: Category) => {
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      isActive: category.isActive,
      subcategories: [...category.subcategories],
      id: category.id,
    });
    setIsCategoryModalOpen(true);
  };

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (categoryForm.id) {
      // Update existing category
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === categoryForm.id
            ? {
                ...cat,
                ...categoryForm,
                subcategories: categoryForm.subcategories,
              }
            : cat
        )
      );
    } else {
      // Add new category
      const newCategory: Category = {
        id: Math.max(0, ...categories.map((c) => c.id)) + 1,
        name: categoryForm.name,
        slug: categoryForm.slug,
        description: categoryForm.description,
        isActive: categoryForm.isActive,
        productCount: 0,
        subcategories: categoryForm.subcategories,
      };
      setCategories((prev) => [...prev, newCategory]);
    }

    setIsCategoryModalOpen(false);
  };

  const deleteCategory = (id: number) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== id));
  };

  const addSubcategoryInForm = () => {
    if (
      !categoryForm.subcategories.includes(newSubcategory.trim()) &&
      newSubcategory.trim()
    ) {
      setCategoryForm((prev) => ({
        ...prev,
        subcategories: [...prev.subcategories, newSubcategory.trim()],
      }));
      setNewSubcategory("");
    }
  };

  const removeSubcategoryFromForm = (index: number) => {
    setCategoryForm((prev) => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Product Categories</h1>
        <Button onClick={openNewCategoryModal}>
          <Plus className="h-4 w-4 mr-2" />
          Add Category
        </Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[40px]"></TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Products</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categories.map((category) => (
                <React.Fragment key={category.id}>
                  <TableRow
                    className={
                      expanded === category.id ? "bg-muted/30" : undefined
                    }
                  >
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleRow(category.id)}
                      >
                        {expanded === category.id ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Folder className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <p className="font-medium">{category.name}</p>
                          <p className="text-sm text-muted-foreground">
                            /{category.slug}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[200px] truncate">
                      {category.description}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {category.productCount} products
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={category.isActive ? "default" : "secondary"}
                      >
                        {category.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openSubcategoryModal(category.id)}
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditCategoryModal(category)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-700"
                          onClick={() => deleteCategory(category.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>

                  {expanded === category.id && (
                    <TableRow className="bg-muted/10 hover:bg-muted/20">
                      <TableCell />
                      <TableCell colSpan={5}>
                        <div className="py-3 px-4">
                          <div className="flex justify-between items-center mb-3">
                            <h3 className="font-semibold">Subcategories</h3>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openSubcategoryModal(category.id)}
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Subcategory
                            </Button>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {category.subcategories.length > 0 ? (
                              category.subcategories.map((sub, idx) => (
                                <Badge
                                  key={idx}
                                  variant="secondary"
                                  className="text-xs py-1 px-2 flex items-center gap-1"
                                >
                                  {sub}
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      openSubcategoryModal(category.id);
                                      startEditing(idx, sub);
                                    }}
                                    className="text-muted-foreground hover:text-primary"
                                  >
                                    <Edit className="h-3 w-3" />
                                  </button>
                                </Badge>
                              ))
                            ) : (
                              <p className="text-sm text-muted-foreground">
                                No subcategories yet
                              </p>
                            )}
                          </div>
                        </div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Subcategory Management Modal */}
      <Dialog
        open={isSubcategoryModalOpen}
        onOpenChange={setIsSubcategoryModalOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {editingSubcategory ? "Edit Subcategory" : "Manage Subcategories"}
              <button
                onClick={() => {
                  setIsSubcategoryModalOpen(false);
                  setEditingSubcategory(null);
                }}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {editingSubcategory ? (
              <div className="space-y-2">
                <Label>Edit Subcategory</Label>
                <div className="flex gap-2">
                  <Input
                    value={editingSubcategory.value}
                    onChange={(e) =>
                      setEditingSubcategory({
                        ...editingSubcategory,
                        value: e.target.value,
                      })
                    }
                  />
                  <Button onClick={saveSubcategoryEdit}>Save</Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <Label>New Subcategory</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Enter subcategory name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") addSubcategory();
                    }}
                  />
                  <Button onClick={addSubcategory}>Add</Button>
                </div>
              </div>
            )}

            <div className="border-t pt-4">
              <h4 className="font-medium mb-2">Existing Subcategories</h4>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {currentCategoryId &&
                categories.find((c) => c.id === currentCategoryId)
                  ?.subcategories.length ? (
                  categories
                    .find((c) => c.id === currentCategoryId)
                    ?.subcategories.map((sub, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                      >
                        <span>{sub}</span>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditing(idx, sub)}
                          >
                            <Edit className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => deleteSubcategory(idx)}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    No subcategories yet
                  </p>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Category Add/Edit Modal */}
      <Dialog open={isCategoryModalOpen} onOpenChange={setIsCategoryModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex justify-between items-center">
              {categoryForm.id ? "Edit Category" : "Add New Category"}
              <button
                onClick={() => setIsCategoryModalOpen(false)}
                className="p-1 rounded-full hover:bg-muted"
              >
                <X className="h-4 w-4" />
              </button>
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleCategorySubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Category Name</Label>
                  <Input
                    id="name"
                    value={categoryForm.name}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug</Label>
                  <Input
                    id="slug"
                    value={categoryForm.slug}
                    onChange={(e) =>
                      setCategoryForm({ ...categoryForm, slug: e.target.value })
                    }
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={categoryForm.description}
                  onChange={(e) =>
                    setCategoryForm({
                      ...categoryForm,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="status"
                  checked={categoryForm.isActive}
                  onCheckedChange={(val) =>
                    setCategoryForm({ ...categoryForm, isActive: val })
                  }
                />
                <Label htmlFor="status">Active</Label>
              </div>

              <div className="space-y-2">
                <Label>Subcategories</Label>
                <div className="flex gap-2">
                  <Input
                    value={newSubcategory}
                    onChange={(e) => setNewSubcategory(e.target.value)}
                    placeholder="Enter subcategory name"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addSubcategoryInForm();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={addSubcategoryInForm}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add
                  </Button>
                </div>

                <div className="mt-2 flex flex-wrap gap-2">
                  {categoryForm.subcategories.map((sub, idx) => (
                    <Badge
                      key={idx}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {sub}
                      <button
                        type="button"
                        onClick={() => removeSubcategoryFromForm(idx)}
                        className="text-muted-foreground hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsCategoryModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {categoryForm.id ? "Save Changes" : "Add Category"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
