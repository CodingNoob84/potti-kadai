import z from "zod";

export const productCreateSchema = z.object({
  id: z.number(),
  title: z.string().min(2, {
    message: "Title must be at least 2 characters.",
  }),
  description: z.string().min(2, {
    message: "Description must be at least 2 characters.",
  }),
  price: z.coerce.number().min(1, { message: "Price must be at least 1" }),
  gender: z.array(z.string()).min(1, "Please select at least one gender"),
  isactive: z.boolean(),
  category: z.number(),
  subcategory: z.number(),
  images: z.array(
    z.object({
      url: z.string().url(),
      colorId: z.number(),
    })
  ),
  inventory: z.array(
    z.object({
      colorId: z.number(),
      name: z.string(), // Color name like "Black"
      colorCode: z.string(), // HEX code like "#000000"
      sizes: z.array(
        z.object({
          sizeId: z.number(),
          name: z.string(), // Size label like "S", "M", "L"
          quantity: z.coerce.number(),
        })
      ),
    })
  ),
});

export type productCreateType = z.infer<typeof productCreateSchema>;
