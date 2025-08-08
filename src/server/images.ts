import { db } from "@/db/drizzle";
import { productImages } from "@/db/schema/products";
import { inArray } from "drizzle-orm";

export async function fetchProductImages(productIds: number[]) {
  const images = await db
    .select({
      url: productImages.url,
      productId: productImages.productId,
      colorId: productImages.colorId,
    })
    .from(productImages)
    .where(inArray(productImages.productId, productIds));

  const imageMap = new Map<number, { url: string; colorId: number | null }[]>();
  for (const img of images) {
    if (!imageMap.has(img.productId)) imageMap.set(img.productId, []);
    imageMap.get(img.productId)!.push({ url: img.url, colorId: img.colorId });
  }

  return imageMap;
}

export function getImageForProduct(
  productId: number,
  colorId: number,
  imageMap: Map<number, { url: string; colorId: number | null }[]>
) {
  const images = imageMap.get(productId) || [];
  return images.find((img) => img.colorId === colorId) || images[0];
}
