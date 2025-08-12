"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { useEffect, useState } from "react";

const reviews = [
  {
    id: 1,
    name: "Priya Sharma",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Amazing quality products! The fabric is so soft and comfortable. Delivery was super fast too. Highly recommend PottiKadai!",
    product: "Cotton T-Shirt",
    location: "Mumbai",
  },
  {
    id: 2,
    name: "Rajesh Kumar",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Great shopping experience. The customer service is excellent and the prices are very reasonable. Will definitely shop again!",
    product: "Formal Shirt",
    location: "Delhi",
  },
  {
    id: 3,
    name: "Anita Patel",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Love the variety of products available. The website is easy to navigate and the checkout process is smooth.",
    product: "Kurti Set",
    location: "Ahmedabad",
  },
  {
    id: 4,
    name: "Vikram Singh",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Excellent quality jeans! Perfect fit and the material is durable. PottiKadai has become my go-to store for clothing.",
    product: "Denim Jeans",
    location: "Bangalore",
  },
  {
    id: 5,
    name: "Meera Reddy",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Outstanding service! The dress I ordered was exactly as shown in the picture. Fast delivery and great packaging.",
    product: "Party Dress",
    location: "Hyderabad",
  },
  {
    id: 6,
    name: "Arjun Nair",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Good collection of ethnic wear. The quality is impressive and the prices are competitive. Happy with my purchase!",
    product: "Kurta Pajama",
    location: "Kochi",
  },
];

export const ReviewsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
      }, 2000);
      return () => clearInterval(interval);
    }
  }, [isHovered, reviews.length]);

  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 bg-gradient-to-br from-primary/5 via-white to-primary/10 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(120,119,198,0.1),transparent_50%)]" />

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.h2
            className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            What Our Customers Say
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Don&apos;t just take our word for it - hear from our happy customers
          </motion.p>
        </motion.div>

        <div
          className="relative overflow-hidden"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <div className="relative h-[300px] w-full overflow-hidden">
            <motion.div
              className="flex absolute top-0 left-0 h-full w-full"
              style={{ width: `${reviews.length * 100}%` }}
              animate={{
                x: `-${currentIndex * (100 / reviews.length)}%`,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20,
              }}
            >
              {reviews.map((review) => (
                <motion.div
                  key={review.id}
                  className="w-full h-full"
                  style={{ width: `${100 / reviews.length}%` }}
                >
                  <Card className="h-full bg-white/70 backdrop-blur-sm border-white/20 shadow-lg hover:shadow-xl transition-all duration-300">
                    <CardContent className="p-8 relative h-full flex flex-col">
                      {/* Quote Icon */}
                      <Quote className="absolute top-4 right-4 h-8 w-8 text-primary/20" />

                      {/* Rating */}
                      <div className="flex items-center mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < review.rating
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>

                      {/* Review Text */}
                      <p className="text-foreground leading-relaxed text-lg flex-grow">
                        &quot;{review.review}&quot;
                      </p>

                      {/* Product Info */}
                      <div className="mb-4">
                        <span className="text-sm text-primary font-medium bg-primary/10 px-3 py-1 rounded-full">
                          {review.product}
                        </span>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center">
                        <Avatar className="h-12 w-12 mr-4">
                          <AvatarImage
                            src={review.avatar || "/placeholder.svg"}
                            alt={review.name}
                          />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {review.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-semibold text-foreground">
                            {review.name}
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            {review.location}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Navigation Dots */}
          <div className="flex justify-center mt-8 space-x-2">
            {reviews.map((_, index) => (
              <button
                key={index}
                className={`h-3 w-3 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-primary w-8"
                    : "bg-primary/30 hover:bg-primary/50"
                }`}
                onClick={() => setCurrentIndex(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
