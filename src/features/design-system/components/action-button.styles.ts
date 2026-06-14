import { cva } from "class-variance-authority";

export const actionButtonVariants = cva(
  "glow-ring inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl border text-sm font-semibold transition-[background,border-color,color,transform,box-shadow] duration-200 disabled:pointer-events-none disabled:opacity-45 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      intent: {
        primary:
          "border-white/80 bg-white text-zinc-950 shadow-[0_10px_30px_-12px_oklch(1_0_0/0.65)] hover:-translate-y-0.5 hover:bg-zinc-100",
        secondary:
          "border-white/12 bg-white/[0.07] text-foreground shadow-[inset_0_1px_0_oklch(1_0_0/0.08)] hover:-translate-y-0.5 hover:border-white/20 hover:bg-white/[0.11]",
        ghost:
          "border-transparent text-muted-foreground hover:bg-white/[0.07] hover:text-foreground",
        danger:
          "border-red-300/20 bg-red-500/12 text-red-100 hover:-translate-y-0.5 hover:border-red-300/30 hover:bg-red-500/20",
      },
      size: {
        sm: "h-8 px-3 text-xs",
        md: "h-10 px-4",
        lg: "h-12 px-5 text-[15px]",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: {
      intent: "primary",
      size: "md",
    },
  },
);
