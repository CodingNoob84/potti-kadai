"use client";

import { CategoriesBlock } from "@/components/dashboard/products/categories-block";
import { SubCategoriesBlock } from "@/components/dashboard/products/sub-categories-block";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function CategoriesPage() {
  return (
    <div className="p-6">
      <Tabs defaultValue="account">
        <TabsList>
          <TabsTrigger value="account">
            <div className="p-12">Categories</div>
          </TabsTrigger>
          <TabsTrigger value="password">
            <div className="p-12">Sub-Categories</div>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="account" className="w-full">
          <CategoriesBlock />
        </TabsContent>
        <TabsContent value="password">
          <SubCategoriesBlock />
        </TabsContent>
      </Tabs>
    </div>
  );
}
