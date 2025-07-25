"use client";

import { CategoriesBlock } from "@/components/dashboard/categories/categories-block";
import { SizesBlock } from "@/components/dashboard/categories/sizes-block";
import { SubCategoriesBlock } from "@/components/dashboard/categories/sub-categories-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <Tabs defaultValue="categories">
        <TabsList>
          <TabsTrigger value="categories">
            <div className="p-12">Categories</div>
          </TabsTrigger>
          <TabsTrigger value="subcategories">
            <div className="p-12">Sub-Categories</div>
          </TabsTrigger>
          <TabsTrigger value="sizes">
            <div className="p-12">Sizes</div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="categories" className="w-full">
          <CategoriesBlock />
        </TabsContent>
        <TabsContent value="subcategories">
          <SubCategoriesBlock />
        </TabsContent>
        <TabsContent value="sizes">
          <div className="space-y-8">
            <SizesBlock />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
