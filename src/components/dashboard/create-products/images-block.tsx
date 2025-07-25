"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { productCreateType } from "@/form-schemas/product";
import { ImagePlus, Loader2, Trash2 } from "lucide-react";
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
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);

  const uploadToCloudinary = async (file: File, index: number) => {
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
      return data.result.secure_url;
    } catch (error) {
      console.error("Upload error:", error);
      return null;
    } finally {
      // Remove this file's progress when done
      setUploadProgress((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || files.length === 0 || uploading) return;

    setUploading(true);
    setUploadProgress(Array.from(files).map(() => 0)); // Initialize progress for each file

    try {
      const fileArray = Array.from(files);
      const uploadPromises = fileArray.map((file, index) =>
        uploadToCloudinary(file, index)
      );

      const urls = (await Promise.all(uploadPromises)).filter(
        Boolean
      ) as string[];

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
              className={`aspect-square rounded-lg border-2 border-dashed transition-colors flex items-center justify-center relative overflow-hidden ${
                uploading
                  ? "border-primary/50 cursor-wait"
                  : "hover:border-primary cursor-pointer"
              }`}
            >
              {uploading ? (
                <div className="flex flex-col items-center justify-center p-4 w-full h-full">
                  <Loader2 className="h-8 w-8 mx-auto text-primary animate-spin mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Uploading {uploadProgress.length} image
                    {uploadProgress.length !== 1 ? "s" : ""}...
                  </span>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2">
                    <div
                      className="bg-green-400 h-1.5 rounded-full"
                      style={{
                        width: `${
                          uploadProgress.length > 0
                            ? uploadProgress.reduce((a, b) => a + b, 0) /
                              uploadProgress.length
                            : 0
                        }%`,
                      }}
                    />
                  </div>
                </div>
              ) : (
                <div className="text-center p-4">
                  <ImagePlus className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                  <span className="text-sm text-muted-foreground">
                    Add Image
                  </span>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {maxImages - images.length} remaining
                  </span>
                </div>
              )}
            </button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
