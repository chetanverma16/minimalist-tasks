import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "bg-gray-900 text-gray-50",
        secondary: "bg-gray-100 text-gray-900",
        destructive: "bg-red-500 text-gray-50",
        outline: "text-gray-950",
      },
      priority: {
        none: "bg-gray-200 text-gray-800",
        low: "bg-green-200 text-green-800",
        medium: "bg-yellow-200 text-yellow-800",
        high: "bg-orange-200 text-orange-800",
        urgent: "bg-red-200 text-red-800",
      },
      status: {
        not_started: "bg-blue-200 text-blue-800",
        in_progress: "bg-purple-200 text-purple-800",
        completed: "bg-green-200 text-green-800",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, priority, status, ...props }: BadgeProps) {
  return (
    <div
      className={cn(badgeVariants({ variant, priority, status }), className)}
      {...props}
    />
  );
}

export { Badge, badgeVariants };
