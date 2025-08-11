"use client";

import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { motion } from "framer-motion";
import { AlertTriangle, Clock, Heart, Info, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";

export const CartAutoDeleteTimer = () => {
  const [timeLeft, setTimeLeft] = useState({
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const [isUrgent, setIsUrgent] = useState(false);

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();

      // Get current time in IST
      const istString = now.toLocaleString("en-US", {
        timeZone: "Asia/Kolkata",
      });
      const istNow = new Date(istString);

      // Get midnight in IST
      const midnight = new Date(istString);
      midnight.setHours(24, 0, 0, 0); // next midnight IST

      const difference = midnight.getTime() - istNow.getTime();

      if (difference > 0) {
        const hours = Math.floor(difference / (1000 * 60 * 60));
        const minutes = Math.floor(
          (difference % (1000 * 60 * 60)) / (1000 * 60)
        );
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ hours, minutes, seconds });
        setIsUrgent(hours < 2);
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (time: number) => time.toString().padStart(2, "0");

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`rounded-xl p-3 sm:p-4 border-2 transition-all duration-300 ${
        isUrgent
          ? "bg-gradient-to-r from-red-50 to-orange-50 border-red-200 shadow-red-100"
          : "bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200 shadow-blue-100"
      } shadow-lg`}
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <motion.div
            animate={isUrgent ? { scale: [1, 1.1, 1] } : {}}
            transition={{
              duration: 1,
              repeat: isUrgent ? Number.POSITIVE_INFINITY : 0,
            }}
            className={`p-2 rounded-lg ${
              isUrgent
                ? "bg-gradient-to-r from-red-500 to-orange-500"
                : "bg-gradient-to-r from-blue-500 to-indigo-500"
            }`}
          >
            <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
          </motion.div>
          <div className="flex-1 sm:flex-none">
            <div className="flex items-center gap-2">
              <h3
                className={`font-semibold text-sm sm:text-base ${
                  isUrgent ? "text-red-800" : "text-blue-800"
                }`}
              >
                Cart Auto-Clear Timer
              </h3>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-5 w-5 p-0 hover:bg-white/50 rounded-full"
                  >
                    <Info className="h-3 w-3 sm:h-4 sm:w-4 text-gray-600" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[280px] sm:w-80 p-0" align="start">
                  <div className="p-3 sm:p-4 space-y-3 sm:space-y-4">
                    <div className="flex items-center gap-2">
                      <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                        <ShoppingCart className="h-4 w-4 text-white" />
                      </div>
                      <h4 className="font-semibold text-gray-900">
                        Why Auto-Clear?
                      </h4>
                    </div>

                    <div className="space-y-3 text-xs sm:text-sm text-gray-600">
                      <p>
                        <strong>PottiKadai</strong> is a small shop with limited
                        inventory. When you add items to your cart, you&aposre
                        temporarily reserving them.
                      </p>

                      <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3">
                        <div className="flex items-start gap-2">
                          <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-amber-800 mb-1 text-xs sm:text-sm">
                              Fair Shopping Policy
                            </p>
                            <p className="text-amber-700 text-xs">
                              To ensure fair access for all customers, cart
                              items are automatically cleared every night at
                              midnight (IST).
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <p className="font-medium text-gray-800 text-xs sm:text-sm">
                          What can you do?
                        </p>
                        <ul className="space-y-1 text-xs">
                          <li className="flex items-center gap-2">
                            <ShoppingCart className="h-3 w-3 text-green-600" />
                            <span>Complete your purchase today</span>
                          </li>
                          <li className="flex items-center gap-2">
                            <Heart className="h-3 w-3 text-pink-600" />
                            <span>
                              Move items to wishlist to save for later
                            </span>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
            <p
              className={`text-xs sm:text-sm ${
                isUrgent ? "text-red-600" : "text-blue-600"
              }`}
            >
              Items will be cleared at midnight (IST)
            </p>
          </div>
        </div>

        <div className="w-full sm:w-auto text-right sm:text-right">
          <div
            className={`text-xl sm:text-2xl font-bold font-mono ${
              isUrgent ? "text-red-700" : "text-blue-700"
            }`}
          >
            {formatTime(timeLeft.hours)}:{formatTime(timeLeft.minutes)}:
            {formatTime(timeLeft.seconds)}
          </div>
          <p
            className={`text-xs ${isUrgent ? "text-red-600" : "text-blue-600"}`}
          >
            {isUrgent ? "Hurry up!" : "Time remaining"}
          </p>
        </div>
      </div>

      {isUrgent && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-3 pt-3 border-t border-red-200"
        >
          <div className="flex items-center gap-2 text-xs sm:text-sm text-red-700">
            <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
            <span className="font-medium">
              Less than 2 hours left! Consider checking out or moving items to
              wishlist.
            </span>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};
