"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";

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
  {
    id: 7,
    name: "Sneha Iyer",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Absolutely love my saree! The color and design are stunning. The fabric feels premium and comfortable.",
    product: "Silk Saree",
    location: "Chennai",
  },
  {
    id: 8,
    name: "Rohit Mehta",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Quick delivery and well-packaged. The hoodie is warm, soft, and exactly what I needed for winter.",
    product: "Winter Hoodie",
    location: "Pune",
  },
  {
    id: 9,
    name: "Kavya Menon",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "The lehenga I purchased was gorgeous and perfect for my cousin’s wedding. Everyone complimented me!",
    product: "Designer Lehenga",
    location: "Trivandrum",
  },
  {
    id: 10,
    name: "Amit Verma",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Good product quality and great value for money. The polo t-shirt fits perfectly and looks classy.",
    product: "Polo T-Shirt",
    location: "Jaipur",
  },
  {
    id: 11,
    name: "Neha Joshi",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Impressed with the detailing on the embroidered kurti. Looks elegant and feels comfortable all day.",
    product: "Embroidered Kurti",
    location: "Nagpur",
  },
  {
    id: 12,
    name: "Suresh Rathi",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Bought a pair of formal trousers and they are excellent quality. Great fit and durable stitching.",
    product: "Formal Trousers",
    location: "Lucknow",
  },
  {
    id: 13,
    name: "Pooja Desai",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Nice fabric and pattern on the kurta. The delivery was a day late, but overall a good experience.",
    product: "Printed Kurta",
    location: "Surat",
  },
  {
    id: 14,
    name: "Manoj Gupta",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "The jacket I ordered exceeded my expectations. Stylish, warm, and worth every penny.",
    product: "Casual Jacket",
    location: "Indore",
  },
  {
    id: 15,
    name: "Divya Kapoor",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "PottiKadai always delivers quality! The maxi dress I ordered is perfect for summer outings.",
    product: "Maxi Dress",
    location: "Gurgaon",
  },
  {
    id: 16,
    name: "Harish Chandra",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Good range of casual wear at affordable prices. The cargo pants I bought are very comfortable.",
    product: "Cargo Pants",
    location: "Patna",
  },
  {
    id: 17,
    name: "Ritika Bansal",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Loved the anarkali suit! Beautiful color combination and perfect for festive occasions.",
    product: "Anarkali Suit",
    location: "Amritsar",
  },
  {
    id: 18,
    name: "Anil Yadav",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 4,
    review:
      "Bought sportswear for my gym sessions. Breathable fabric and comfortable fit. Happy with the purchase.",
    product: "Sportswear Set",
    location: "Noida",
  },
  {
    id: 19,
    name: "Shweta Rao",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Very happy with my dupatta order. Vibrant colors and soft texture. Matches perfectly with my suit.",
    product: "Chiffon Dupatta",
    location: "Bhopal",
  },
  {
    id: 20,
    name: "Karan Malhotra",
    avatar: "/placeholder.svg?height=40&width=40",
    rating: 5,
    review:
      "Excellent store for online clothing! I’ve ordered multiple times and the experience is always top-notch.",
    product: "Casual Shirt",
    location: "Chandigarh",
  },
];

export const TestimonialsSection = () => {
  const [isMobile, setIsMobile] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const row1Controls = useAnimation();
  const row2Controls = useAnimation();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const getDuration = useCallback(
    (baseDuration: number) => {
      if (prefersReducedMotion) return baseDuration * 3;
      return isMobile ? baseDuration * 0.6 : baseDuration;
    },
    [isMobile, prefersReducedMotion] // dependencies that affect calculation
  );

  useEffect(() => {
    if (prefersReducedMotion) return;

    row1Controls.start({
      x: ["0%", "-50%"],
      transition: {
        duration: getDuration(30),
        repeat: Infinity,
        ease: "linear",
      },
    });

    row2Controls.start({
      x: ["-50%", "0%"],
      transition: {
        duration: getDuration(35),
        repeat: Infinity,
        ease: "linear",
      },
    });
  }, [prefersReducedMotion, row1Controls, row2Controls, getDuration]);

  const handleHoverStart = (isRow1: boolean) => {
    if (prefersReducedMotion) return;

    if (isMobile) {
      // On mobile, center the hovered card
      if (isRow1) {
        row1Controls.stop();
      } else {
        row2Controls.stop();
      }
    } else {
      // On desktop, just pause the animation
      if (isRow1) {
        row1Controls.stop();
      } else {
        row2Controls.stop();
      }
    }
  };

  const handleHoverEnd = (isRow1: boolean) => {
    if (prefersReducedMotion) return;

    if (isRow1) {
      row1Controls.start({
        x: ["0%", "-50%"],
        transition: {
          duration: getDuration(30),
          repeat: Infinity,
          ease: "linear",
        },
      });
    } else {
      row2Controls.start({
        x: ["-50%", "0%"],
        transition: {
          duration: getDuration(35),
          repeat: Infinity,
          ease: "linear",
        },
      });
    }
  };

  return (
    <section className="py-12 overflow-hidden bg-gradient-to-b from-gray-50 to-primary/30">
      <div className="container mx-auto px-4">
        <motion.h2
          className="text-3xl font-bold text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          What Our Customers Say
        </motion.h2>

        {/* First row - moves left to right */}
        <div className="mb-8 overflow-hidden">
          <motion.div className="flex" animate={row1Controls}>
            {[...reviews, ...reviews].map((review, index) => (
              <div
                key={`row1-${index}`}
                className="flex-shrink-0 px-4 w-[280px] md:w-80"
                onMouseEnter={() => handleHoverStart(true)}
                onMouseLeave={() => handleHoverEnd(true)}
                onTouchStart={() => handleHoverStart(true)}
                onTouchEnd={() => handleHoverEnd(true)}
              >
                <TestimonialCard {...review} isMobile={isMobile} />
              </div>
            ))}
          </motion.div>
        </div>

        {/* Second row - moves right to left */}
        <div className="overflow-hidden">
          <motion.div className="flex" animate={row2Controls}>
            {[...reviews.slice().reverse(), ...reviews.slice().reverse()].map(
              (review, index) => (
                <div
                  key={`row2-${index}`}
                  className="flex-shrink-0 px-4 w-[280px] md:w-80"
                  onMouseEnter={() => handleHoverStart(false)}
                  onMouseLeave={() => handleHoverEnd(false)}
                  onTouchStart={() => handleHoverStart(false)}
                  onTouchEnd={() => handleHoverEnd(false)}
                >
                  <TestimonialCard {...review} isMobile={isMobile} />
                </div>
              )
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({
  name,
  review,
  avatar,
  rating,
  product,
  location,
  isMobile,
}: (typeof reviews)[0] & { isMobile: boolean }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      whileHover={
        prefersReducedMotion
          ? {}
          : {
              y: isMobile ? 0 : -5,
              scale: isMobile ? 1.05 : 1,
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
              zIndex: 10,
            }
      }
      transition={{ duration: 0.3 }}
      className={isMobile ? "origin-center" : ""}
    >
      <Card className="h-full">
        <CardHeader className="flex flex-row items-center space-x-4 pb-2">
          <motion.div
            whileHover={prefersReducedMotion ? {} : { scale: 1.1 }}
            transition={{ duration: 0.2 }}
          >
            <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback>{name[0]}</AvatarFallback>
            </Avatar>
          </motion.div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-muted-foreground">{location}</p>
          </div>
        </CardHeader>
        <CardContent>
          <motion.p
            className="mb-4 italic"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            &quot;{review}&quot;
          </motion.p>
          <div className="flex justify-between items-center">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} filled={i < rating} />
              ))}
            </div>
            <motion.span
              className="text-sm text-muted-foreground"
              whileHover={prefersReducedMotion ? {} : { scale: 1.05 }}
            >
              {product}
            </motion.span>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const StarIcon = ({ filled }: { filled: boolean }) => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      className="w-5 h-5 text-yellow-500"
      whileHover={prefersReducedMotion ? {} : { scale: 1.2 }}
      transition={{ duration: 0.2 }}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={filled ? 0 : 2}
        d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
      />
    </motion.svg>
  );
};
