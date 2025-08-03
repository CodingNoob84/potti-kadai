"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

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

import { createOrUpdateSize } from "@/server/categories";
import { Size } from "@/types/categories";

const sizeSchema = z.object({
  name: z.string().min(1, "Name is required"),
  ukSize: z.string().optional(),
  usSize: z.string().optional(),
  euSize: z.string().optional(),
  indiaSize: z.string().optional(),
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
    },
  });

  useEffect(() => {
    if (open && initialSize) {
      const countryMap = Object.fromEntries(
        initialSize.country_sizes.map((cs) => [
          cs.country_name.toLowerCase(),
          cs.size_label,
        ])
      );

      form.reset({
        name: initialSize.name,
        ukSize: countryMap["uk"] || "",
        usSize: countryMap["us"] || "",
        euSize: countryMap["eu"] || "",
        indiaSize: countryMap["ind"] || "",
      });
    } else if (!initialSize) {
      form.reset({
        name: "",
        ukSize: "",
        usSize: "",
        euSize: "",
        indiaSize: "",
      });
    }
  }, [open, initialSize, form]);

  const mutation = useMutation({
    mutationFn: async (data: z.infer<typeof sizeSchema>) => {
      const countrySizes = [
        data.ukSize && { countryName: "UK", sizeLabel: data.ukSize },
        data.usSize && { countryName: "US", sizeLabel: data.usSize },
        data.euSize && { countryName: "EU", sizeLabel: data.euSize },
        data.indiaSize && { countryName: "IND", sizeLabel: data.indiaSize },
      ].filter(Boolean) as { countryName: string; sizeLabel: string }[];

      return createOrUpdateSize({
        id: initialSize?.id,
        name: data.name,
        sizeTypeId: initialSize?.size_type.id ?? 0,
        countrySizes,
      });
    },
    onSuccess: () => {
      toast.success(
        `Size ${type === "Add" ? "added" : "updated"} successfully`
      );
      queryClient.invalidateQueries({ queryKey: ["all-sizes"] });
      setOpen(false);
    },
    onError: () => {
      toast.error(`Failed to ${type === "Add" ? "add" : "update"} size`);
    },
  });

  const onSubmit = (data: z.infer<typeof sizeSchema>) => {
    mutation.mutate(data);
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
            {type} {sizeType} Size
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
              {["ukSize", "usSize", "euSize", "indiaSize"].map((key) => (
                <FormField
                  key={key}
                  control={form.control}
                  name={key as keyof z.infer<typeof sizeSchema>}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {key.replace("Size", "").toUpperCase()} Size
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder={`${key
                            .replace("Size", "")
                            .toUpperCase()} size`}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              ))}
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {type === "Add" ? "Add" : "Update"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
