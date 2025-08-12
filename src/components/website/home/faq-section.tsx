"use client";

import { Card, CardContent } from "@/components/ui/card";
import { AnimatePresence, motion } from "framer-motion";
import { Minus, Plus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy. You can return any item within 30 days of purchase for a full refund, provided the item is in its original condition with tags attached.",
  },
  {
    id: 2,
    question: "How long does shipping take?",
    answer:
      "We offer free shipping on orders above ₹1000. Standard delivery takes 3-5 business days, while express delivery takes 1-2 business days. You'll receive a tracking number once your order is shipped.",
  },
  // ... other faqs
];

export const FAQSection = () => {
  const [openItems, setOpenItems] = useState<number[]>([1]);

  const toggleItem = (id: number) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section className="py-12 px-4 md:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-gradient-to-br from-white via-primary/5 to-white" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(120,119,198,0.07),transparent_50%)]" />

      <div className="max-w-3xl mx-auto relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <motion.h2
            className="text-3xl md:text-4xl font-semibold mb-4 bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
          >
            Frequently Asked Questions
          </motion.h2>
          <motion.p
            className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto"
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Find answers to common questions about our products and services
          </motion.p>
        </motion.div>

        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
            >
              <Card className="overflow-hidden bg-white/60 backdrop-blur-sm border border-white/20 shadow-sm hover:shadow-md transition-shadow duration-250">
                <CardContent className="p-4">
                  <motion.button
                    className="w-full flex items-center justify-between text-left"
                    onClick={() => toggleItem(faq.id)}
                    whileHover={{
                      backgroundColor: "rgba(var(--primary), 0.06)",
                    }}
                    transition={{ duration: 0.2 }}
                    aria-expanded={openItems.includes(faq.id)}
                  >
                    <h3 className="font-medium text-lg text-foreground pr-3">
                      {faq.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: openItems.includes(faq.id) ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="flex-shrink-0"
                    >
                      {openItems.includes(faq.id) ? (
                        <Minus className="h-5 w-5 text-primary" />
                      ) : (
                        <Plus className="h-5 w-5 text-primary" />
                      )}
                    </motion.div>
                  </motion.button>

                  <AnimatePresence initial={false}>
                    {openItems.includes(faq.id) && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: "easeInOut" }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3">
                          <motion.div
                            initial={{ y: -6, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            exit={{ y: -6, opacity: 0 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="border-t border-primary/20 pt-3"
                          >
                            <p className="text-muted-foreground text-sm leading-relaxed">
                              {faq.answer}
                            </p>
                          </motion.div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Contact Support */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center mt-10"
        >
          <Card className="bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 border border-primary/30 shadow-sm">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-3 text-foreground">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4 text-sm md:text-base">
                Our customer support team is here to help you 24/7
              </p>
              <motion.button
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:bg-primary/90 transition-colors duration-200"
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
              >
                Contact Support
              </motion.button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </section>
  );
};
