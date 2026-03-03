import { type ReactNode } from "react"

interface Props {
  label: string
  children: ReactNode
}

export function FormGroup({ label, children }: Props) {
  return (
    <div>
      <label className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--ink3)] mb-1">
        {label}
      </label>
      {children}
    </div>
  )
}
