import { type ButtonHTMLAttributes, type ReactNode } from "react"
import clsx from "clsx"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "primary" | "danger" | "ghost"
  size?: "sm" | "md"
  children: ReactNode
}

export function Button({ variant = "default", size = "md", className, children, ...props }: Props) {
  return (
    <button
      className={clsx(
        "font-mono font-bold tracking-wide rounded border-[1.5px] transition-all duration-150 cursor-pointer",
        size === "sm" ? "text-[9px] px-[10px] py-[5px]" : "text-[10px] px-[14px] py-[7px]",
        variant === "default" && [
          "border-[var(--border)] bg-[var(--white)] text-[var(--ink)]",
          "hover:bg-[var(--accent-bg)] hover:border-[var(--accent)] hover:text-[var(--accent)]",
        ],
        variant === "primary" && [
          "bg-[var(--accent)] text-white border-[var(--accent)]",
          "hover:opacity-85",
        ],
        variant === "danger" && [
          "border-red-200 text-red-600 bg-[var(--white)]",
          "hover:bg-red-50 hover:border-red-500",
        ],
        variant === "ghost" && "border-transparent bg-transparent text-[var(--ink2)] hover:text-[var(--accent)]",
        className
      )}
      {...props}
    >
      {children}
    </button>
  )
}
