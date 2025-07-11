import { Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";

const trendingProducts = [
  {
    id: 1,
    name: "Classic Cotton T-Shirt",
    price: 599,
    originalPrice: 799,
    image: "/images/products/p_img4.png",
    rating: 4.5,
    reviews: 128,
  },
  {
    id: 2,
    name: "Denim Casual Shirt",
    price: 1299,
    originalPrice: 1599,
    image: "/images/products/p_img5.png",
    rating: 4.3,
    reviews: 89,
  },
  {
    id: 3,
    name: "Formal Trousers",
    price: 1899,
    originalPrice: 2299,
    image: "/images/products/p_img6.png",
    rating: 4.7,
    reviews: 156,
  },
  {
    id: 4,
    name: "Summer Dress",
    price: 1499,
    originalPrice: 1899,
    image: "/images/products/p_img7.png",
    rating: 4.6,
    reviews: 203,
  },
  {
    id: 5,
    name: "Kids Polo Shirt",
    price: 699,
    originalPrice: 899,
    image: "/images/products/p_img8.png",
    rating: 4.4,
    reviews: 67,
  },
  {
    id: 6,
    name: "Casual Sneakers",
    price: 2499,
    originalPrice: 2999,
    image: "/images/products/p_img9.png",
    rating: 4.8,
    reviews: 234,
  },
  {
    id: 7,
    name: "Leather Jacket",
    price: 3999,
    originalPrice: 4999,
    image: "/images/products/p_img10.png",
    rating: 4.5,
    reviews: 91,
  },
  {
    id: 8,
    name: "Floral Blouse",
    price: 899,
    originalPrice: 1199,
    image: "/images/products/p_img11.png",
    rating: 4.2,
    reviews: 145,
  },
  {
    id: 9,
    name: "Sports Shorts",
    price: 799,
    originalPrice: 999,
    image: "/images/products/p_img12.png",
    rating: 4.6,
    reviews: 178,
  },
  {
    id: 10,
    name: "Winter Hoodie",
    price: 1799,
    originalPrice: 2199,
    image: "/images/products/p_img13.png",
    rating: 4.7,
    reviews: 267,
  },
];

export const TrendingSection = () => {
  return (
    <section className="py-16 px-4 md:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Trending Now</h2>
          <p className="text-muted-foreground text-lg">
            Discover what&apos;s popular this season
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {trendingProducts.map((product) => (
            <Link key={product.id} href={`/product/${product.id}`}>
              <Card className="group cursor-pointer hover:shadow-lg transition-shadow pt-0">
                <CardContent className="p-0">
                  <div className="relative aspect-square overflow-hidden rounded-t-lg">
                    <Image
                      src={product.image || "/placeholder.svg"}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {product.originalPrice > product.price && (
                      <Badge className="absolute top-2 left-2 bg-red-500">
                        {Math.round(
                          ((product.originalPrice - product.price) /
                            product.originalPrice) *
                            100
                        )}
                        % OFF
                      </Badge>
                    )}
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-sm md:text-base mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <div className="flex items-center mb-2">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm text-muted-foreground ml-1">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="font-bold text-lg">
                        ₹{product.price}
                      </span>
                      {product.originalPrice > product.price && (
                        <span className="text-sm text-muted-foreground line-through">
                          ₹{product.originalPrice}
                        </span>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild size="lg">
            <Link href="/products">View All Products</Link>
          </Button>
        </div>
      </div>
    </section>
  );
};
