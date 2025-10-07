
"use client"

import * as React from "react"
import * as ProgressPrimitive from "@radix-ui/react-progress"
import { motion, MotionValue } from "framer-motion"

import { cn } from "@/lib/utils"

type ProgressProps = React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & {
  asMotion?: boolean
  value?: number | MotionValue<number>
}

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  ProgressProps
>(({ className, value, asMotion, ...props }, ref) => {
  const Comp = asMotion ? motion.div : 'div';
  const indicatorStyle = typeof value === 'number' 
    ? { transform: `translateX(-${100 - (value || 0)}%)` } 
    : { scaleX: value };
  const IndicatorComp = typeof value === 'number' ? 'div' : motion.div;

  return (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn(
      "relative h-4 w-full overflow-hidden rounded-full bg-secondary",
      className
    )}
    {...props}
  >
    {typeof value === 'number' ? (
      <ProgressPrimitive.Indicator
        className="h-full w-full flex-1 bg-primary transition-all"
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    ) : (
       <motion.div
        className="h-full w-full flex-1 bg-primary"
        style={{ scaleX: value.get() / 100, transformOrigin: 'left' }}
      />
    )}
  </ProgressPrimitive.Root>
)});
Progress.displayName = ProgressPrimitive.Root.displayName

export { Progress }
