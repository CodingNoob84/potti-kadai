"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { addSize, updateSize } from "@/server/categories"; // Ensure these exist
import { Size } from "@/types/categories";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const sizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ukSize: z.string().optional(),
  usSize: z.string().optional(),
  euSize: z.string().optional(),
  indiaSize: z.string().optional(),
  categoryId: z.number(),
});

export const AddEditSize = ({
  type,
  sizeType,
  initialSize,
}: {
  type: "Add" | "Edit";
  sizeType: string | null;
  initialSize?: Size;
}) => {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof sizeSchema>>({
    resolver: zodResolver(sizeSchema),
    defaultValues: {
      name: "",
      ukSize: "",
      usSize: "",
      euSize: "",
      indiaSize: "",
      categoryId: initialSize?.categoryId ?? 1, // fallback to 1 if undefined
    },
  });

  useEffect(() => {
    if (initialSize) {
      form.reset({
        name: initialSize.name,
        ukSize: initialSize.ukSize || "",
        usSize: initialSize.usSize || "",
        euSize: initialSize.euSize || "",
        indiaSize: initialSize.indiaSize || "",
        categoryId: initialSize.categoryId ?? 1,
      });
    } else {
      form.reset({
        name: "",
        ukSize: "",
        usSize: "",
        euSize: "",
        indiaSize: "",
        categoryId: 1,
      });
    }
  }, [initialSize, form]);

  const addSizeMutation = useMutation({
    mutationFn: (data: z.infer<typeof sizeSchema>) =>
      addSize({ ...data, type: sizeType ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-sizes"] });
      toast.success("Size added successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to add size");
    },
  });

  const updateSizeMutation = useMutation({
    mutationFn: (data: z.infer<typeof sizeSchema>) =>
      updateSize({ id: initialSize?.id ?? 0, ...data, type: sizeType ?? "" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-sizes"] });
      toast.success("Size updated successfully");
      setOpen(false);
    },
    onError: () => {
      toast.error("Failed to update size");
    },
  });

  const onSubmit = (data: z.infer<typeof sizeSchema>) => {
    if (type === "Add") {
      addSizeMutation.mutate(data);
    } else {
      updateSizeMutation.mutate(data);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {type === "Add" ? (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add Size
          </Button>
        ) : (
          <Button variant="ghost" size="icon">
            <Plus className="h-4 w-4" />
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {type} {sizeType} size
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. S, M, L, 42..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="ukSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>UK Size</FormLabel>
                    <FormControl>
                      <Input placeholder="UK size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="usSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>US Size</FormLabel>
                    <FormControl>
                      <Input placeholder="US size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="euSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>EU Size</FormLabel>
                    <FormControl>
                      <Input placeholder="EU size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="indiaSize"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Indian Size</FormLabel>
                    <FormControl>
                      <Input placeholder="Indian size" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={
                  addSizeMutation.isPending || updateSizeMutation.isPending
                }
              >
                {type === "Add" ? "Add" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
