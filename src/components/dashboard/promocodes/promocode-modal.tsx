"use client";
import { PromoCodeType } from "@/app/(dashboard)/dashboard/promocodes/page";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarPicker } from "@/components/ui/calendar";
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { createOrUpdatePromoCode } from "@/server/offers";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { format } from "date-fns";
import { Box, Calendar, ListTree, Package, Tags } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { CategorySearch } from "../discounts/categories-search";
import { SubcategorySearchBox } from "../discounts/subcategory-search";

const formSchema = z.object({
  id: z.number(),
  code: z.string().min(3, "Code must be at least 3 characters").max(20),
  type: z.string(),
  value: z.coerce.number().min(1, "Value must be at least 1"),
  minQuantity: z.coerce
    .number()
    .min(1, "Minimum quantity must be at least 1")
    .default(1),
  validFrom: z.date(),
  validTo: z.date(),
  maxUses: z.coerce.number().min(0, "Must be 0 or more").default(0),
  usesPerUser: z.coerce.number().min(1, "Must be at least 1").default(1),
  appliedTo: z.string(),
  categoryIds: z.array(z.number()).optional(),
  subcategoryIds: z.array(z.number()).optional(),
  productIds: z.array(z.number()).optional(),
});

interface NewPromoCodeModalProps {
  type: "Create" | "Edit";
  promoCodeValues?: PromoCodeType;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function NewPromoCodeModal({
  type,
  promoCodeValues,
  open,
  onOpenChange,
}: NewPromoCodeModalProps) {
  const queryClient = useQueryClient();
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: 0,
      code: "",
      type: "percentage",
      value: 10,
      minQuantity: 1,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      maxUses: 0,
      usesPerUser: 1,
      appliedTo: "all",
      categoryIds: [],
      subcategoryIds: [],
      productIds: [],
    },
  });

  // Reset form when promoCodeValues changes
  useEffect(() => {
    if (promoCodeValues) {
      form.reset({
        ...promoCodeValues,
        minQuantity: promoCodeValues.minQuantity ?? 1,
        validFrom: new Date(promoCodeValues.validFrom),
        validTo: new Date(promoCodeValues.validTo),
      });
    } else {
      form.reset({
        id: 0,
        code: "",
        type: "percentage",
        value: 10,
        minQuantity: 1,
        validFrom: new Date(),
        validTo: new Date(new Date().setMonth(new Date().getMonth() + 1)),
        maxUses: 0,
        usesPerUser: 1,
        appliedTo: "all",
        categoryIds: [],
        subcategoryIds: [],
        productIds: [],
      });
    }
  }, [form, promoCodeValues, open]);

  const appliedTo = form.watch("appliedTo");

  const createUpdateMutation = useMutation({
    mutationFn: createOrUpdatePromoCode,
    onSuccess: () => {
      const sMessage =
        type === "Create"
          ? "Your discount has been created successfully."
          : "Your discount has been updated successfully.";
      toast.success(sMessage);
      queryClient.invalidateQueries({ queryKey: ["all-promocodes"] });
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[650px]">
        <DialogHeader>
          <DialogTitle>Create New Promo Code</DialogTitle>
          <DialogDescription>
            Generate a new promotional code for your customers
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Promo Code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="SUMMER20"
                        className="font-mono uppercase"
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.toUpperCase())
                        }
                      />
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

              <FormField
                control={form.control}
                name="validFrom"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid From</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="validTo"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Valid To</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <Calendar className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <CalendarPicker
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < form.getValues("validFrom") ||
                            date < new Date()
                          }
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="maxUses"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Uses (0 for unlimited)</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usesPerUser"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Uses Per User</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="1" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

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
                {appliedTo === "category" && (
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

                {appliedTo === "subcategory" && (
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

            <DialogFooter className="mt-4">
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
