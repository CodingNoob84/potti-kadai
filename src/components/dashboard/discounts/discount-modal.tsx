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
  name: z.string().min(2, "Name must be at least 2 characters").max(50),
  type: z.enum(["percentage", "amount"]),
  value: z.coerce.number().min(1, "Value must be at least 1"),
  minQuantity: z.coerce
    .number()
    .min(1, "Minimum quantity must be at least 1")
    .default(1),
  appliedTo: z.enum(["all", "category", "subcategory", "product"]),
  appliedToId: z.string().optional(),
});

interface NewDiscountModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewDiscountModal({
  open,
  onOpenChange,
}: NewDiscountModalProps) {
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
    onOpenChange(false);
    form.reset();
  }

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
                  <FormItem>
                    <FormLabel>Discount Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
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
                      {form.getValues("type") === "percentage"
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
                          {form.getValues("type") === "percentage" ? "%" : "$"}
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
                          disabled={!appliedTo}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={`Select ${appliedTo}`}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {appliedTo === "category" && (
                              <>
                                <SelectItem value="electronics">
                                  Electronics
                                </SelectItem>
                                <SelectItem value="clothing">
                                  Clothing
                                </SelectItem>
                                <SelectItem value="home">
                                  Home & Garden
                                </SelectItem>
                              </>
                            )}
                            {appliedTo === "subcategory" && (
                              <>
                                <SelectItem value="laptops">Laptops</SelectItem>
                                <SelectItem value="t-shirts">
                                  T-Shirts
                                </SelectItem>
                                <SelectItem value="furniture">
                                  Furniture
                                </SelectItem>
                              </>
                            )}
                            {appliedTo === "product" && (
                              <>
                                <SelectItem value="prod-123">
                                  MacBook Pro
                                </SelectItem>
                                <SelectItem value="prod-456">
                                  iPhone 15
                                </SelectItem>
                                <SelectItem value="prod-789">
                                  Leather Sofa
                                </SelectItem>
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

            <DialogFooter className="mt-6">
              <Button
                variant="outline"
                type="button"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Create Discount</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
