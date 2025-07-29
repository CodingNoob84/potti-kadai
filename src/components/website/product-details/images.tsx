import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageGalleryProps {
  images: { url: string; alt?: string; colorId: number | null }[];
  discountPercentage?: number;
  colorId: number | null;
}

export function ImageGallery({
  images,
  discountPercentage = 0,
  colorId,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images]);

  // Scroll to and select the image matching the colorId
  useEffect(() => {
    if (colorId === null) return;

    const matchingIndex = images.findIndex((img) => img.colorId === colorId);
    if (matchingIndex >= 0 && matchingIndex !== selectedImage) {
      setSelectedImage(matchingIndex);

      // Scroll to the matching thumbnail
      setTimeout(() => {
        thumbnailRefs.current[matchingIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [colorId, images, selectedImage]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      thumbnailContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className={`space-y-3`}>
      {/* Main Image */}
      <div className="relative aspect-square overflow-hidden rounded-lg border bg-gray-50">
        <Image
          src={images[selectedImage]?.url || "/placeholder.svg"}
          alt={images[selectedImage]?.alt || "Product image"}
          fill
          className="object-contain p-4"
          priority
        />
        {discountPercentage > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-md">
            {discountPercentage}% OFF
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="relative">
          {images.length > 4 && (
            <>
              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border hover:bg-gray-50"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="h-5 w-5 text-gray-700" />
              </button>
              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border hover:bg-gray-50"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="h-5 w-5 text-gray-700" />
              </button>
            </>
          )}

          <div
            ref={thumbnailContainerRef}
            className="flex space-x-2 overflow-x-auto pt-6 px-2 pb-1 scrollbar-hide"
            style={{
              scrollSnapType: "x mandatory",
              paddingLeft: images.length > 4 ? "2rem" : "0",
              paddingRight: images.length > 4 ? "2rem" : "0",
            }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => setSelectedImage(index)}
                className={`relative w-16 h-16 flex-shrink-0 rounded-md border overflow-hidden transition-colors ${
                  selectedImage === index ? "border-primary" : "border-gray-200"
                } ${
                  image.colorId === colorId
                    ? "ring-2 ring-offset-2 ring-blue-500"
                    : ""
                }`}
                aria-label={`View image ${index + 1}`}
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt || `Thumbnail ${index + 1}`}
                  fill
                  priority
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
