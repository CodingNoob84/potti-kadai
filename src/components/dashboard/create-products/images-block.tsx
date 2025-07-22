"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productCreateType } from "@/form-schemas/product";
import { ImagePlus, Trash2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";

type ImagesBlockProps = {
  form: UseFormReturn<productCreateType>;
  maxImages?: number;
};

export const ImagesBlock = ({ form, maxImages = 8 }: ImagesBlockProps) => {
  const { setValue, watch } = form;
  const images = watch("images") || [];
  const [uploading, setUploading] = useState(false);

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);
    const folderName = "pottikadai";
    formData.append("folderName", folderName);

    try {
      const response = await fetch(`/api/fileupload`, {
        method: "POST",
        body: formData,
      });

      if (!response.ok) throw new Error("Upload failed");
      const data = await response.json();
      console.log("data", data);
      return data.result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || uploading) return;

    setUploading(true);
    try {
      const uploadPromises = Array.from(files).map(uploadToCloudinary);
      const urls = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];
      console.log("urls", urls);
      if (urls.length > 0) {
        setValue("images", [...images, ...urls].slice(0, maxImages), {
          shouldValidate: true,
        });
      }
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (index: number) => {
    const updatedImages = images.filter((_, i) => i !== index);
    setValue("images", updatedImages, { shouldValidate: true });
  };

  const triggerFileInput = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.multiple = true;
    input.accept = "image/*";
    input.onchange = (e) =>
      handleImageUpload((e.target as HTMLInputElement).files);
    input.click();
  };

  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {/* Existing Images */}
          {images.map((url, index) => (
            <div key={url} className="relative aspect-square group">
              <div className="absolute inset-0 rounded-lg overflow-hidden border">
                <Image
                  src={url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {/* Upload Button - Only show if we haven't reached max images */}
          {images.length < maxImages && (
            <button
              type="button"
              onClick={triggerFileInput}
              disabled={uploading}
              className="aspect-square rounded-lg border-2 border-dashed hover:border-primary transition-colors flex items-center justify-center"
            >
              <div className="text-center p-4">
                <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                <span className="text-sm text-muted-foreground">
                  {uploading ? "Uploading..." : "Add Image"}
                </span>
              </div>
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
