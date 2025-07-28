import { Button } from "@/components/ui/button";
import { getProductReviews } from "@/server/products";
import { useQuery } from "@tanstack/react-query";
import { Star, Trash2, User, Wand2 } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";

type ReviewsListProps = {
  productId: number;
};

export const ReviewsList = ({ productId }: ReviewsListProps) => {
  const { data: productReviews = [], isLoading } = useQuery({
    queryKey: ["productreviews", productId],
    queryFn: () => getProductReviews(productId),
  });

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReview = async () => {
    setIsGenerating(true);
    try {
      // Simulate AI API call
      await new Promise((resolve) => setTimeout(resolve, 1500));

      toast.success("AI review generated (mock)");
    } catch (error) {
      console.log("error", error);
      toast.error("Failed to generate review");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDeleteReview = (reviewId: number) => {
    console.log("reviewId", reviewId);
    toast.info("Delete functionality would be implemented here");
  };

  if (isLoading) {
    return (
      <div className="py-3 px-4 space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
                <div className="space-y-2">
                  <div className="h-4 w-24 bg-muted rounded animate-pulse" />
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, j) => (
                      <div
                        key={j}
                        className="h-4 w-4 bg-muted rounded animate-pulse"
                      />
                    ))}
                  </div>
                </div>
              </div>
              <div className="h-4 w-16 bg-muted rounded animate-pulse" />
            </div>
            <div className="mt-3 space-y-2">
              <div className="h-4 w-full bg-muted rounded animate-pulse" />
              <div className="h-4 w-3/4 bg-muted rounded animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="py-3 px-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold">
          User Reviews ({productReviews.length})
        </h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleGenerateReview}
          disabled={isGenerating}
        >
          <Wand2 className="h-4 w-4 mr-2" />
          {isGenerating ? "Generating..." : "Generate AI Review"}
        </Button>
      </div>

      <div className="space-y-4">
        {productReviews.length > 0 ? (
          productReviews.map((review) => (
            <div
              key={review.id}
              className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center space-x-3">
                  <div className="flex items-center justify-center h-10 w-10 rounded-full bg-muted">
                    {review.userImage ? (
                      <Image
                        src={review.userImage}
                        alt={review.userName || "User"}
                        className="h-full w-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">
                      {review.userName || "Anonymous"}
                    </p>
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < review.rating
                              ? "fill-yellow-400 text-yellow-400"
                              : "fill-muted text-muted-foreground"
                          }`}
                        />
                      ))}
                      <span className="ml-2 text-xs text-muted-foreground">
                        {review.rating.toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="text-sm text-muted-foreground">
                  {review.createdAt?.toLocaleDateString() || "No date"}
                </div>
              </div>
              {review.comment && (
                <p className="mt-3 text-sm">{review.comment}</p>
              )}
              <div className="flex justify-end mt-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700"
                  onClick={() => handleDeleteReview(review.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-sm text-muted-foreground">No reviews yet</p>
            <Button
              variant="outline"
              size="sm"
              className="mt-2"
              onClick={handleGenerateReview}
              disabled={isGenerating}
            >
              <Wand2 className="h-4 w-4 mr-2" />
              Generate Sample Review
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
