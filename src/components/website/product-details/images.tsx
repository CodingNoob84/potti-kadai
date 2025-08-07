import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";

interface ImageGalleryProps {
  images: { url: string; alt?: string; colorId: number | null }[];
  discountedText: string;
  selectedColorId: number | null;
  setSelectedColorId: (selectedColorId: number) => void;
}

export function ImageGallery({
  images,
  discountedText,
  selectedColorId,
  setSelectedColorId,
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Initialize refs array
  useEffect(() => {
    thumbnailRefs.current = thumbnailRefs.current.slice(0, images.length);
  }, [images]);

  // Scroll to and select the image matching the selectedColorId
  useEffect(() => {
    if (selectedColorId === null) return;

    const matchingIndex = images.findIndex(
      (img) => img.colorId === selectedColorId
    );
    if (matchingIndex >= 0 && matchingIndex !== selectedImage) {
      setSelectedImage(matchingIndex);
      setTimeout(() => {
        thumbnailRefs.current[matchingIndex]?.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }, 100);
    }
  }, [selectedColorId, images, selectedImage]);

  const scrollThumbnails = (direction: "left" | "right") => {
    if (thumbnailContainerRef.current) {
      const scrollAmount = direction === "left" ? -200 : 200;
      thumbnailContainerRef.current.scrollBy({
        left: scrollAmount,
        behavior: "smooth",
      });
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedImage(index);
    const colorId = images[index]?.colorId;
    if (colorId !== null && colorId !== undefined) {
      setSelectedColorId(colorId);
    }
  };

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <div className="relative w-full sm:max-w-sm aspect-square overflow-hidden rounded-lg border bg-gray-50 mx-auto">
        <Image
          src={images[selectedImage]?.url || "/placeholder.svg"}
          alt={images[selectedImage]?.alt || "Product image"}
          //width={390}
          //height={450}
          fill
          className="object-contain p-4"
          priority
        />
        {discountedText !== "" && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-sm font-medium px-2 py-1 rounded-md">
            {discountedText}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="relative px-4 sm:px-8">
          {/* Arrows only if more than 4 */}
          {images.length > 4 && (
            <>
              <button
                onClick={() => scrollThumbnails("left")}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="h-4 w-4 text-gray-600" />
              </button>
              <button
                onClick={() => scrollThumbnails("right")}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-md border border-gray-200 hover:bg-gray-50 transition-colors"
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="h-4 w-4 text-gray-600" />
              </button>
            </>
          )}
          <div
            ref={thumbnailContainerRef}
            className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {images.map((image, index) => (
              <button
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleThumbnailClick(index)}
                className={`
              relative flex-shrink-0 rounded-md border-2 overflow-hidden transition-all
              w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white
              ${
                selectedImage === index
                  ? "border-primary"
                  : "border-transparent"
              }
              ${image.colorId === selectedColorId ? "ring-2 ring-blue-500" : ""}
              hover:border-gray-300
            `}
                aria-label={`View image ${index + 1}`}
              >
                <div className="absolute inset-0.5 rounded-sm overflow-hidden">
                  <Image
                    src={image.url || "/placeholder.svg"}
                    alt={image.alt || `Thumbnail ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
