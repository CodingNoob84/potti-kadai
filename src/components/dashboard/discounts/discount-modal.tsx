"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Separator } from "@/components/ui/separator";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { createOrUpdateDiscount } from "@/server/offers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Box, ListTree, Package, Tags } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CategorySearch } from "./categories-search";
import { SubcategorySearchBox } from "./subcategory-search";

const formSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  type: z.string(),
  value: z.coerce.number().min(1, "Value must be at least 1"),
  minQuantity: z.coerce
    .number()
    .min(1, "Minimum quantity must be at least 1")
    .default(1),
  appliedTo: z.string(),
  categoryIds: z.array(z.number()).optional(),
  subcategoryIds: z.array(z.number()).optional(),
  productIds: z.array(z.number()).optional(),
});

type DiscountsType = {
  categoryIds?: number[]; // optional, consistent with zod schema
  subcategoryIds?: number[]; // optional
  productIds?: number[];
  id: number;
  name: string;
  type: string;
  value: number;
  minQuantity: number;
  appliedTo: string;
};

interface NewDiscountModalProps {
  type: "Create" | "Edit";
  discountValues?: DiscountsType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDiscountModal({
  type,
  discountValues,
  open,
  onOpenChange,
}: NewDiscountModalProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: discountValues ?? {
      id: 0,
      name: "",
      type: "percentage",
      value: 10,
      minQuantity: 1,
      appliedTo: "all",
      categoryIds: [],
      subcategoryIds: [],
      productIds: [],
    },
  });
  const appliedTo = form.watch("appliedTo");

  const createUpdateMutation = useMutation({
    mutationFn: createOrUpdateDiscount,
    onSuccess: (data) => {
      console.log("data", data);
      const sMessage =
        type === "Create"
          ? "Your discount has been created successfully."
          : "Your discount has been updated successfully.";
      toast.success(sMessage);
      queryClient.invalidateQueries({ queryKey: ["all-discounts"] });
      onOpenChange(false);
      form.reset();
    },
    onError: () => {
      toast.error("An error occurred while processing your request.");
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    createUpdateMutation.mutate(values);
  }

  useEffect(() => {
    if (discountValues) {
      form.reset(discountValues);
    } else {
      form.reset({
        id: 0,
        name: "",
        type: "percentage",
        value: 10,
        minQuantity: 1,
        appliedTo: "all",
        categoryIds: [],
        subcategoryIds: [],
        productIds: [],
      });
    }
  }, [form, discountValues, open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[625px]">
        <DialogHeader>
          <DialogTitle>Create New Discount</DialogTitle>
          <DialogDescription>
            Add a new discount to apply to your products
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  <FormItem className="w-full">
                    <FormLabel>Discount Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl className="w-full">
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
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
                      {form.watch("type") === "percentage"
                        ? "Percentage"
                        : "Amount"}
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          type="number"
                          placeholder={
                            form.getValues("type") === "percentage"
                              ? "10"
                              : "5.00"
                          }
                          {...field}
                        />
                        <span className="absolute right-3 top-2.5 text-muted-foreground text-sm">
                          {form.watch("type") === "percentage" ? "%" : "₹"}
                        </span>
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

            <Separator className="my-4" />

            <div>
              <h3 className="font-medium mb-3">Apply Discount To</h3>
              <FormField
                control={form.control}
                name="appliedTo"
                render={({ field }) => (
                  <FormItem className="space-y-3">
                    <FormControl>
                      <RadioGroup
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        className="grid grid-cols-1 md:grid-cols-2 gap-3"
                      >
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="all" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Package className="h-4 w-4" />
                            All Products
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="category" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <ListTree className="h-4 w-4" />
                            Specific Category
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="subcategory" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Tags className="h-4 w-4" />
                            Specific Subcategory
                          </FormLabel>
                        </FormItem>
                        <FormItem className="flex items-center space-x-3 space-y-0">
                          <FormControl>
                            <RadioGroupItem value="product" />
                          </FormControl>
                          <FormLabel className="font-normal flex items-center gap-2">
                            <Box className="h-4 w-4" />
                            Specific Product
                          </FormLabel>
                        </FormItem>
                      </RadioGroup>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="pt-4">
                {appliedTo === "categories" && (
                  <FormField
                    control={form.control}
                    name="categoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <CategorySearch field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {appliedTo === "subcategories" && (
                  <FormField
                    control={form.control}
                    name="subcategoryIds"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categories</FormLabel>
                        <FormControl>
                          <SubcategorySearchBox field={field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {createUpdateMutation.isPending
                  ? "Loading..."
                  : type === "Create"
                  ? "Create Promo Code"
                  : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
