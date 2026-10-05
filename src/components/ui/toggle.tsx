"use client"

import * as React from "react"
import * as TogglePrimitive from "@radix-ui/react-toggle"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const toggleVariants = cva(
  "inline-flex items-center justify-center px-4 py-2 rounded-lg text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: [
          "bg-base-300 text-[rgb(var(--text-secondary))]",
          "hover:bg-base-300 hover:text-[rgb(var(--text-primary))]",
          "data-[state=on]:bg-base-400 data-[state=on]:text-[rgb(var(--text-primary))]",
        ].join(" "),
      },
      size: {
        default: "min-w-[initial]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

const Toggle = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root> &
  VariantProps<typeof toggleVariants>
>(({ className, variant, size, ...props }, ref) => (
  <TogglePrimitive.Root
    ref={ref}
    className={cn(toggleVariants({ variant, size, className }))}
    {...props}
  />
))

Toggle.displayName = TogglePrimitive.Root.displayName

export { Toggle, toggleVariants }