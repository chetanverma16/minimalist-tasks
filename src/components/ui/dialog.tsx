"use client";

import * as React from "react";
import { motion, AnimatePresence, HTMLMotionProps } from "framer-motion";
import { cn } from "@/lib/utils";

interface DialogProps {
  open?: boolean;
  children?: React.ReactNode;
}

const Dialog = ({ open, children }: DialogProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0, backdropFilter: "blur(0px)" }}
            animate={{ opacity: 1, backdropFilter: "blur(4px)" }}
            exit={{ opacity: 0, backdropFilter: "blur(0px)" }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50"
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            {children}
          </div>
        </>
      )}
    </AnimatePresence>
  );
};

const DialogContent = React.forwardRef<
  HTMLDivElement,
  HTMLMotionProps<"div"> & React.HTMLAttributes<HTMLDivElement>
>(({ className, children, ...props }, ref) => (
  <motion.div
    ref={ref}
    initial={{ opacity: 0, scale: 0.95, y: -20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: -20 }}
    transition={{ duration: 0.2, ease: "easeOut" }}
    className={cn(
      "relative w-full max-w-lg gap-4 border border-gray-200 bg-white p-6 shadow-lg dark:border-gray-800 dark:bg-gray-950 sm:rounded-lg",
      className
    )}
    {...props}
  >
    {children}
  </motion.div>
));
DialogContent.displayName = "DialogContent";

const DialogHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col space-y-1.5 text-center sm:text-left",
      className
    )}
    {...props}
  />
);
DialogHeader.displayName = "DialogHeader";

const DialogFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn(
      "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2",
      className
    )}
    {...props}
  />
);
DialogFooter.displayName = "DialogFooter";

const DialogTitle = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) => (
  <h2
    className={cn(
      "text-lg font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
);
DialogTitle.displayName = "DialogTitle";

const DialogDescription = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) => (
  <p
    className={cn("text-sm text-gray-500 dark:text-gray-400", className)}
    {...props}
  />
);
DialogDescription.displayName = "DialogDescription";

const DialogContext = React.createContext<DialogProps | null>(null);

const DialogProvider = ({ children, ...props }: DialogProps) => {
  return (
    <DialogContext.Provider value={props}>{children}</DialogContext.Provider>
  );
};

const Dialog2 = ({ children, ...props }: DialogProps) => {
  return (
    <DialogProvider {...props}>
      <Dialog {...props}>{children}</Dialog>
    </DialogProvider>
  );
};

export {
  Dialog2 as Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
};
