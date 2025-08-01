"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Box, ListTree, Package, Tags } from "lucide-react";
import { useForm } from "react-hook-form";

import { z } from "zod";

const formSchema = z.object({
  name: z.string().min(2).max(50),
  type: z.enum(["percentage", "amount"]),
  value: z.coerce.number().min(1),
  minQuantity: z.coerce.number().min(1).default(1),
  appliedTo: z.enum(["all", "category", "subcategory", "product"]),
  appliedToId: z.string().optional(),
});

export function NewDiscountForm() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      type: "percentage",
      value: 10,
      minQuantity: 1,
      appliedTo: "all",
    },
  });

  const appliedTo = form.watch("appliedTo");

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Discount</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Summer Sale" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select discount type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="amount">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="value"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.getValues("type") === "percentage"
                        ? "Percentage Value"
                        : "Amount"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        {form.getValues("type") === "percentage" ? (
                          <div className="relative">
                            <Input type="number" placeholder="10" {...field} />
                            <span className="absolute right-3 top-2.5 text-muted-foreground">
                              %
                            </span>
                          </div>
                        ) : (
                          <div className="relative">
                            <Input type="number" placeholder="10" {...field} />
                            <span className="absolute right-3 top-2.5 text-muted-foreground">
                              $
                            </span>
                          </div>
                        )}
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="minQuantity"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Minimum Quantity</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium mb-4">Apply Discount To</h3>
              <FormField
                control={form.control}
                name="appliedTo"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <Package className="h-5 w-5" />
                              All Products
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="category" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <ListTree className="h-5 w-5" />
                              Specific Category
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="subcategory" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <Tags className="h-5 w-5" />
                              Specific Subcategory
                            </div>
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="product" />
                          </FormControl>
                          <FormLabel className="font-normal">
                            <div className="flex items-center gap-2">
                              <Box className="h-5 w-5" />
                              Specific Product
                            </div>
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {appliedTo !== "all" && (
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="appliedToId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          {appliedTo === "category" && "Select Category"}
                          {appliedTo === "subcategory" && "Select Subcategory"}
                          {appliedTo === "product" && "Select Product"}
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select ${appliedTo}`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {/* These would be dynamically populated */}
                            {appliedTo === "category" && (
                              <>
                                <SelectItem value="electronics">
                                  Electronics
                                </SelectItem>
                                <SelectItem value="clothing">
                                  Clothing
                                </SelectItem>
                              </>
                            )}
                            {appliedTo === "subcategory" && (
                              <>
                                <SelectItem value="laptops">Laptops</SelectItem>
                                <SelectItem value="t-shirts">
                                  T-Shirts
                                </SelectItem>
                              </>
                            )}
                            {appliedTo === "product" && (
                              <>
                                <SelectItem value="p123">
                                  MacBook Pro
                                </SelectItem>
                                <SelectItem value="p456">iPhone 15</SelectItem>
                              </>
                            )}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end gap-4">
              <Button variant="outline">Cancel</Button>
              <Button type="submit">Create Discount</Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
