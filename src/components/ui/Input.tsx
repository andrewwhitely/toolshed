import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react"
import clsx from "clsx"

const base = "w-full font-mono text-[11px] px-[10px] py-2 border-[1.5px] border-[var(--border)] rounded bg-[var(--bg)] text-[var(--ink)] focus:outline-none focus:border-[var(--accent)] transition-colors"

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return <input className={clsx(base, className)} {...props} />
}

export function Select({ className, ...props }: SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={clsx(base, className)} {...props} />
}

export function Textarea({ className, ...props }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={clsx(base, "resize-none", className)} {...props} />
}
