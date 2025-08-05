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
  inventory?: {
    colorId: number;
    name: string;
    colorCode: string;
  }[];
};

export const ImagesBlock = ({
  form,
  maxImages = 8,
  inventory = [],
}: ImagesBlockProps) => {
  const { setValue, watch } = form;
  const images = watch("images") || [];
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number[]>([]);
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
    null
  );
  const [selectedColorId, setSelectedColorId] = useState<number | null>(null);

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
        const newImages = urls.map((url) => ({ url, colorId: 0 }));
        setValue("images", [...images, ...newImages].slice(0, maxImages), {
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

  const assignColorToImage = () => {
    if (selectedImageIndex === null || selectedColorId === null) return;

    const updatedImages = images.map((image, index) =>
      index === selectedImageIndex
        ? { ...image, colorId: selectedColorId }
        : image
    );

    setValue("images", updatedImages, { shouldValidate: true });
    setSelectedImageIndex(null);
    setSelectedColorId(null);
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

  const getColorForImage = (colorId: number | null) => {
    if (colorId === null) return null;
    return inventory.find((color) => color.colorId === colorId);
  };

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Product Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
          {/* Existing Images */}
          {images.map((image, index) => (
            <div key={index} className="relative aspect-square group">
              <div className="absolute inset-0 rounded-lg overflow-hidden border">
                <Image
                  src={image.url}
                  alt={`Product image ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>

              {/* Color badge if assigned */}
              {image.colorId && (
                <div className="absolute bottom-2 left-2">
                  <div
                    className="h-4 w-4 rounded-full border border-white shadow-sm"
                    style={{
                      backgroundColor:
                        getColorForImage(image.colorId)?.colorCode ||
                        "transparent",
                    }}
                  />
                </div>
              )}

              <div className="absolute top-2 right-2 flex gap-1">
                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity h-7 w-7"
                  onClick={() => removeImage(index)}
                >
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
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

        {/* Color Assignment Dialog */}
        {selectedImageIndex !== null && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg max-w-md w-full">
              <h3 className="font-medium text-lg mb-4">
                Assign Color to Image
              </h3>

              <div className="grid grid-cols-4 gap-2 mb-4">
                {inventory.map((color) => (
                  <button
                    key={color.colorId}
                    className={`flex flex-col items-center p-2 rounded border ${
                      selectedColorId === color.colorId
                        ? "border-primary bg-primary/10"
                        : "border-transparent hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedColorId(color.colorId)}
                  >
                    <div
                      className="h-6 w-6 rounded-full mb-1 border"
                      style={{ backgroundColor: color.colorCode }}
                    />
                    <span className="text-xs">{color.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedImageIndex(null);
                    setSelectedColorId(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  onClick={assignColorToImage}
                  disabled={selectedColorId === null}
                >
                  Assign Color
                </Button>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
