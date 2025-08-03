"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { getProductDetailsById } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { Loader2, Package, Ticket } from "lucide-react";
import Image from "next/image";

export const ProductDetailsInExpand = ({
  productId,
}: {
  productId: number;
}) => {
  const { data: productDetail, isLoading } = useQuery({
    queryKey: ["products", productId],
    queryFn: () => getProductDetailsById(productId),
    enabled: !!productId,
  });
  console.log("datat--", productDetail);

  if (isLoading) {
    return (
      <div className="p-4 text-center">
        <Loader2 className="h-5 w-5 animate-spin inline-block mr-2" />
        Loading product details...
      </div>
    );
  }

  if (!productDetail) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Product not found.
      </div>
    );
  }

  return (
    <div className="p-4 bg-gray-50">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Images Section */}
        <Card>
          <CardContent className="p-4">
            <h4 className="font-medium mb-3">Images</h4>
            {productDetail.images?.length ? (
              <div className="grid grid-cols-3 gap-2">
                {productDetail.images.map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square border rounded-md overflow-hidden"
                  >
                    <Image
                      src={img}
                      alt={`Image ${i + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground">No images available</p>
            )}
          </CardContent>
        </Card>

        {/* Discount Section */}
        <Card>
          <CardContent className="p-4 space-y-4">
            <h4 className="font-medium text-lg">Offers & Discounts</h4>

            {/* Discounts Section */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-muted-foreground">
                Discounts
              </h5>
              {productDetail.discounts?.length ? (
                <div className="grid gap-3">
                  {productDetail.discounts.map((discount, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          {/* {discount?.type === "direct" ? (
                            <Percent className="h-4 w-4 text-primary" />
                          ) : (
                            <Package className="h-4 w-4 text-primary" />
                          )} */}
                        </div>
                        <div>
                          {/* <p className="font-medium">
                            {discount.type === "direct"
                              ? `Flat ${discount.value}% off`
                              : `Buy ${discount.quantity} get ${discount.value}% off`}
                          </p> */}
                          {/* <p className="text-xs text-muted-foreground">
                            {discount.type === "direct"
                              ? "On all purchases"
                              : `Minimum ${discount.quantity} items required`}
                          </p> */}
                        </div>
                      </div>
                      {/* <Badge variant="secondary" className="px-3 py-1">
                        {discount.type === "direct"
                          ? `${discount.value}% OFF`
                          : `${discount.value}% OFF`}
                      </Badge> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border border-dashed rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    No discounts available
                  </p>
                </div>
              )}
            </div>

            {/* Promo Codes Section */}
            <div className="space-y-3">
              <h5 className="font-medium text-sm text-muted-foreground">
                Promo Codes
              </h5>
              {productDetail.promocodes?.length ? (
                <div className="grid gap-3">
                  {productDetail.promocodes.map((promo, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <div className="flex items-center gap-3">
                        <div className="p-2 bg-primary/10 rounded-full">
                          <Ticket className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          {/* <p className="font-medium">{promo.promocode}</p> */}
                          <p className="text-xs text-muted-foreground">
                            Valid until {new Date().toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      {/* <Badge variant="secondary" className="px-3 py-1">
                        {promo.value}% OFF
                      </Badge> */}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 border border-dashed rounded-lg">
                  <p className="text-muted-foreground text-sm">
                    No promo codes available
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Inventory Section */}
        <Card className="md:col-span-2">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-semibold text-lg">Inventory Management</h4>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  Total Stock:{" "}
                  {productDetail.inventory.reduce(
                    (sum, color) =>
                      sum +
                      color.sizes.reduce(
                        (sizeSum, size) => sizeSum + size.quantity,
                        0
                      ),
                    0
                  )}
                </span>
              </div>
            </div>

            {productDetail.inventory.length ? (
              <div className="space-y-6">
                {productDetail.inventory.map((color) => (
                  <div
                    key={color.colorId}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-5 h-5 rounded-full border"
                          style={{ backgroundColor: color.colorCode }}
                        />
                        <span className="font-medium">{color.name}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {color.sizes.reduce(
                          (sum, size) => sum + size.quantity,
                          0
                        )}{" "}
                        units
                      </span>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
                      {color.sizes.map((s) => (
                        <div
                          key={s.sizeId}
                          className={`border rounded-lg p-3 flex flex-col items-center ${
                            s.quantity === 0 ? "opacity-50" : ""
                          }`}
                        >
                          <span className="text-sm font-medium">{s.name}</span>
                          <span
                            className={`text-lg font-semibold ${
                              s.quantity > 20
                                ? "text-green-600 dark:text-green-400"
                                : s.quantity > 0
                                ? "text-amber-600 dark:text-amber-400"
                                : "text-red-600 dark:text-red-400"
                            }`}
                          >
                            {s.quantity}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            units
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                <Package className="h-10 w-10 text-muted-foreground mb-2" />
                <p className="text-muted-foreground">No inventory found</p>
                <Button variant="ghost" size="sm" className="mt-2">
                  Add Inventory
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
