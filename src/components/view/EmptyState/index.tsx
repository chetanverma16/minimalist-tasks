import React from "react";
import { motion } from "framer-motion";
import { ClipboardIcon } from "lucide-react";

const EmptyState = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col items-center justify-center p-20 border border-gray-200 rounded-lg text-center"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.5, filter: "blur(10px)" }}
        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
        transition={{ delay: 0.2, type: "spring" }}
      >
        <ClipboardIcon className="w-12 h-12 text-gray-800 mb-4" />
      </motion.div>

      <motion.h3
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.3, type: "spring" }}
        className="text-lg font-medium text-gray-900 mb-1"
      >
        No tasks found
      </motion.h3>

      <motion.p
        initial={{ opacity: 0, y: 10, filter: "blur(10px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ delay: 0.4, type: "spring" }}
        className="text-sm text-gray-500"
      >
        Get started by creating your first task
      </motion.p>
    </motion.div>
  );
};

export default EmptyState;
