import * as React from "react";
import { cva } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-3 py-1 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default:
          "border bg-gradient-to-br text-sm font-medium rounded-sm text-gray-700 dark:text-gray-400 from-slate-50 to-gray-50 dark:from-slate-950/30 dark:to-gray-950/30 border-gray-100 dark:border-gray-900/50",
        success:
          "border bg-gradient-to-br text-sm font-medium rounded text-green-700 dark:text-green-400 from-emerald-50 to-green-50 dark:from-emerald-950/30 dark:to-green-950/30 border-green-100 dark:border-green-900/50",
        warning:
          "border bg-gradient-to-br text-sm font-medium rounded-sm text-orange-700 dark:text-orange-400 from-red-50 to-orange-50 dark:from-red-950/30 dark:to-orange-950/30 border-orange-100 dark:border-orange-900/50",
        danger:
          "border bg-gradient-to-br text-sm font-medium rounded-sm text-red-700 dark:text-red-400 from-rose-50 to-red-50 dark:from-rose-950/30 dark:to-red-950/30 border-red-100 dark:border-red-900/50",
        info: "border bg-gradient-to-br text-sm font-medium rounded-sm text-blue-700 dark:text-blue-400 from-sky-50 to-blue-50 dark:from-sky-950/30 dark:to-blue-950/30 border-blue-100 dark:border-blue-900/50",
        purple:
          "border bg-gradient-to-br text-sm font-medium rounded-sm text-purple-700 dark:text-purple-400 from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-purple-100 dark:border-purple-900/50",
        outline:
          "border border-gray-300 text-gray-800 dark:border-gray-600 dark:text-gray-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

function Badge({ className, variant, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {children}
    </span>
  );
}

export { Badge, badgeVariants };
