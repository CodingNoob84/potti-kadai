import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
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
  const [isZoomed, setIsZoomed] = useState(false);
  const thumbnailContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailRefs = useRef<(HTMLButtonElement | null)[]>([]);

  // Scroll to center the selected thumbnail
  const scrollToThumbnail = (index: number) => {
    const container = thumbnailContainerRef.current;
    const thumbnail = thumbnailRefs.current[index];

    if (container && thumbnail) {
      const containerWidth = container.offsetWidth;
      const thumbnailLeft = thumbnail.offsetLeft;
      const thumbnailWidth = thumbnail.offsetWidth;

      // Calculate scroll position to center the thumbnail
      const scrollTo = thumbnailLeft - containerWidth / 2 + thumbnailWidth / 2;

      container.scrollTo({
        left: scrollTo,
        behavior: "smooth",
      });
    }
  };

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
        scrollToThumbnail(matchingIndex);
      }, 100);
    }
  }, [selectedColorId, images, selectedImage]);

  // Scroll to center when selected image changes
  useEffect(() => {
    scrollToThumbnail(selectedImage);
  }, [selectedImage]);

  const nextImage = () => {
    const nextIndex = (selectedImage + 1) % images.length;
    setSelectedImage(nextIndex);
    const colorId = images[nextIndex]?.colorId;
    if (colorId !== null && colorId !== undefined) {
      setSelectedColorId(colorId);
    }
  };

  const prevImage = () => {
    const prevIndex = (selectedImage - 1 + images.length) % images.length;
    setSelectedImage(prevIndex);
    const colorId = images[prevIndex]?.colorId;
    if (colorId !== null && colorId !== undefined) {
      setSelectedColorId(colorId);
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* Main Image */}
      <div className="relative w-full sm:max-w-sm aspect-square overflow-hidden rounded-lg border bg-gray-50 mx-auto group">
        {/* Discount Badge */}
        {discountedText && (
          <Badge className="absolute top-3 left-3 z-10 bg-red-500 text-white font-bold">
            {discountedText}
          </Badge>
        )}

        {/* Navigation Arrows */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={prevImage}
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={nextImage}
        >
          <ChevronRight className="h-5 w-5" />
        </Button>

        {/* Zoom Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute bottom-3 right-3 z-10 bg-white/80 hover:bg-white shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
          onClick={() => setIsZoomed(true)}
        >
          <ZoomIn className="h-5 w-5" />
        </Button>

        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            <Image
              src={images[selectedImage]?.url || "/placeholder.svg"}
              alt={images[selectedImage]?.alt || "Product image"}
              fill
              className="object-contain p-4"
              priority
            />
          </motion.div>
        </AnimatePresence>

        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute bottom-3 left-3 bg-black/50 text-white px-2 py-1 rounded-full text-xs">
            {selectedImage + 1} / {images.length}
          </div>
        )}
      </div>

      {/* Thumbnail Navigation */}
      {images.length > 1 && (
        <div className="relative px-4 sm:px-8">
          {/* Arrows only if more than 4 */}
          {images.length > 4 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md h-8 w-8"
                onClick={() => {
                  const container = thumbnailContainerRef.current;
                  if (container) {
                    container.scrollBy({ left: -200, behavior: "smooth" });
                  }
                }}
                aria-label="Scroll thumbnails left"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white/80 hover:bg-white shadow-md h-8 w-8"
                onClick={() => {
                  const container = thumbnailContainerRef.current;
                  if (container) {
                    container.scrollBy({ left: 200, behavior: "smooth" });
                  }
                }}
                aria-label="Scroll thumbnails right"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </>
          )}
          <div
            ref={thumbnailContainerRef}
            className="flex space-x-3 overflow-x-auto py-2 scrollbar-hide"
            style={{ scrollSnapType: "x mandatory" }}
          >
            {images.map((image, index) => (
              <motion.button
                key={index}
                ref={(el) => {
                  thumbnailRefs.current[index] = el;
                }}
                onClick={() => handleThumbnailClick(index)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`
                  relative flex-shrink-0 rounded-md border-2 overflow-hidden transition-all
                  w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center bg-white
                  ${
                    selectedImage === index
                      ? "border-primary shadow-lg"
                      : "border-gray-200"
                  }
                  ${
                    image.colorId === selectedColorId
                      ? "ring-2 ring-blue-500"
                      : ""
                  }
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
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Zoom Modal */}
      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-full"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={images[selectedImage]?.url || "/placeholder.svg"}
                alt={images[selectedImage]?.alt || "Product image - Zoomed"}
                width={800}
                height={800}
                className="object-contain"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 text-white"
                onClick={() => setIsZoomed(false)}
              >
                ×
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
