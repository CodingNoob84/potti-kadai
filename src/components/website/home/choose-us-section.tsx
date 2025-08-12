"use client";

import { motion, spring } from "framer-motion";
import { Headphones, RotateCcw, Shield, Truck } from "lucide-react";

const whyChooseUs = [
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Free Shipping",
    description: "Free shipping on orders above ₹1000",
    color: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Shield className="h-8 w-8" />,
    title: "Secure Payment",
    description: "100% secure payment gateway",
    color: "from-green-500 to-emerald-500",
  },
  {
    icon: <Headphones className="h-8 w-8" />,
    title: "24/7 Support",
    description: "Round the clock customer support",
    color: "from-purple-500 to-violet-500",
  },
  {
    icon: <RotateCcw className="h-8 w-8" />,
    title: "Easy Returns",
    description: "30-day hassle-free returns",
    color: "from-orange-500 to-red-500",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 50,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: spring,
      stiffness: 100,
      damping: 12,
    },
  },
};

const iconVariants = {
  hover: {
    scale: 1.1,
    rotate: 5,
    transition: {
      type: spring,
      stiffness: 400,
      damping: 10,
    },
  },
};

export const ChooseUsSection = () => {
  return (
    <section className="py-20 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(120,119,198,0.1),transparent_50%)]" />

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
            Why Choose PottiKadai?
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            We&apos;re committed to providing the best shopping experience with
            unmatched quality and service
          </motion.p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {whyChooseUs.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -10 }}
              className="group relative"
            >
              <div className="text-center p-8 rounded-2xl bg-white/50 backdrop-blur-sm border border-white/20 shadow-lg hover:shadow-xl transition-all duration-300 h-full">
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-10 rounded-2xl transition-opacity duration-300`}
                />

                <motion.div
                  variants={iconVariants}
                  whileHover="hover"
                  className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br ${feature.color} text-white rounded-2xl mb-6 shadow-lg relative z-10`}
                >
                  {feature.icon}

                  {/* Floating particles */}
                  <motion.div
                    className="absolute -top-1 -right-1 w-3 h-3 bg-white/30 rounded-full"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.7, 1, 0.7],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: index * 0.2,
                    }}
                  />
                </motion.div>

                <motion.h3
                  className="font-bold text-xl mb-3 text-foreground group-hover:text-primary transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  {feature.title}
                </motion.h3>

                <motion.p
                  className="text-muted-foreground leading-relaxed"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                >
                  {feature.description}
                </motion.p>

                {/* Hover indicator */}
                <motion.div
                  className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-primary to-primary/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  layoutId={`indicator-${index}`}
                />
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
