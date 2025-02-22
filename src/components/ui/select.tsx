import { ChevronDown, Check } from "lucide-react";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

type DropdownMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
    isActive?: boolean;
  }[];
  children: React.ReactNode;
  shouldCloseOnClick?: boolean;
  onlyIcon?: boolean;
};

const DropdownMenu = ({
  options,
  children,
  shouldCloseOnClick = true,
  onlyIcon = false,
}: DropdownMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative">
      <div
        onClick={() => {
          toggleDropdown();
        }}
        className="px-3 py-2 bg-white cursor-pointer whitespace-nowrap flex items-center gap-x-2 hover:bg-gray-100 text-gray-900 shadow-sm border border-gray-200/50 rounded-lg"
      >
        {children ?? "Menu"}
        {!onlyIcon && (
          <>
            <motion.span
              className="ml-2"
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.4, ease: "easeInOut", type: "spring" }}
            >
              <ChevronDown className="h-4 w-4" />
            </motion.span>
          </>
        )}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ y: -5, scale: 0.95, filter: "blur(10px)" }}
            animate={{ y: 0, scale: 1, filter: "blur(0px)" }}
            exit={{ y: -5, scale: 0.95, opacity: 0, filter: "blur(10px)" }}
            transition={{ duration: 0.6, ease: "circInOut", type: "spring" }}
            className="absolute z-10 w-48 mt-2 p-1 bg-gray-50 rounded-xl text-gray-900 border border-gray-200/50 backdrop-blur-sm flex flex-col gap-2"
          >
            {options && options.length > 0 ? (
              options.map((option, index) => (
                <motion.div
                  initial={{
                    opacity: 0,
                    x: 10,
                    scale: 0.95,
                    filter: "blur(10px)",
                  }}
                  animate={{ opacity: 1, x: 0, scale: 1, filter: "blur(0px)" }}
                  exit={{
                    opacity: 0,
                    x: 10,
                    scale: 0.95,
                    filter: "blur(10px)",
                  }}
                  transition={{
                    duration: 0.4,
                    delay: index * 0.1,
                    ease: "easeInOut",
                    type: "spring",
                  }}
                  whileHover={{
                    transition: {
                      duration: 0.4,
                      ease: "easeInOut",
                    },
                  }}
                  whileTap={{
                    scale: 0.95,
                    transition: {
                      duration: 0.2,
                      ease: "easeInOut",
                    },
                  }}
                  key={option.label}
                  onClick={() => {
                    option.onClick();
                    if (shouldCloseOnClick) {
                      setIsOpen(false);
                    }
                  }}
                  className={cn(
                    "px-2 py-3 cursor-pointer text-sm hover:bg-gray-100 rounded-lg w-full text-left flex items-center justify-between",
                    option.isActive
                      ? "bg-gray-100 text-blue-600"
                      : "text-gray-900"
                  )}
                >
                  <div className="flex items-center gap-x-2">
                    {option.Icon}
                    {option.label}
                  </div>
                  <div className="flex items-center gap-x-2">
                    {option.isActive && (
                      <Check className="h-4 w-4 text-blue-600" />
                    )}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="px-4 py-2 text-white text-xs">No options</div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
