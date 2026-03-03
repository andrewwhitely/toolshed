import { useState, useEffect, useRef } from "react"
import { marked } from "marked"
import { Button } from "@/components/ui/Button"
import { Input, Select, Textarea } from "@/components/ui/Input"
import { FormGroup } from "@/components/ui/FormGroup"
import type { Post, PostType } from "@/types"

type Tab = "write" | "preview" | "split"

interface Props {
  open: boolean
  initial?: Post
  onClose: () => void
  onSave: (post: Omit<Post, "id" | "date">) => void
}

export function MarkdownEditor({ open, initial, onClose, onSave }: Props) {
  const [tab, setTab] = useState<Tab>("split")
  const [title,     setTitle]     = useState("")
  const [tags,      setTags]      = useState("")
  const [type,      setType]      = useState<PostType>("DIY")
  const [cost,      setCost]      = useState("")
  const [time,      setTime]      = useState("")
  const [toolsUsed, setToolsUsed] = useState("")
  const [materials, setMaterials] = useState("")
  const [body,      setBody]      = useState("")
  const previewRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (initial) {
      setTitle(initial.title); setTags(initial.tags.join(", "))
      setType(initial.type);   setCost(initial.cost ?? "")
      setTime(initial.time ?? ""); setToolsUsed(initial.toolsUsed ?? "")
      setMaterials(initial.materials ?? ""); setBody(initial.body)
    } else {
      setTitle(""); setTags(""); setType("DIY"); setCost("")
      setTime(""); setToolsUsed(""); setMaterials(""); setBody("")
    }
  }, [initial, open])

  useEffect(() => {
    if (previewRef.current) {
      previewRef.current.innerHTML = marked.parse(body) as string
    }
  }, [body, tab])

  function submit() {
    if (!title.trim()) return
    onSave({
      title, body, type, cost, time, toolsUsed, materials,
      tags: tags.split(",").map(t => t.trim()).filter(Boolean),
    })
    onClose()
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-lg shadow-2xl flex flex-col overflow-hidden" style={{ width: "min(820px, 96vw)", height: "min(88vh, 700px)" }}>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3 border-b border-[var(--border)] flex-shrink-0">
          <h3 className="font-serif text-[16px] font-bold text-[var(--ink)]">
            {initial ? "Edit Post" : "New Post"}
          </h3>
          <div className="flex gap-2">
            {(["write", "preview", "split"] as Tab[]).map(t => (
              <button key={t} onClick={() => setTab(t)}
                className={`font-mono text-[10px] font-bold px-2.5 py-1 border-[1.5px] rounded capitalize transition-all ${tab === t ? "bg-[var(--accent)] text-white border-[var(--accent)]" : "border-[var(--border)] text-[var(--ink2)] bg-[var(--white)]"}`}>
                {t}
              </button>
            ))}
            <Button size="sm" onClick={onClose}>✕</Button>
          </div>
        </div>

        {/* Meta */}
        <div className="grid grid-cols-3 gap-2.5 px-5 py-3 border-b border-[var(--border2)] flex-shrink-0">
          <FormGroup label="Title">
            <Input value={title} onChange={e => setTitle(e.target.value)} placeholder="What did you build or learn?" />
          </FormGroup>
          <FormGroup label="Tags (comma sep.)">
            <Input value={tags} onChange={e => setTags(e.target.value)} placeholder="deck, stain, outdoor" />
          </FormGroup>
          <FormGroup label="Type">
            <Select value={type} onChange={e => setType(e.target.value as PostType)}>
              <option>DIY</option><option>Paid</option><option>Review</option><option>Tips</option>
            </Select>
          </FormGroup>
          <div className="col-span-3">
            <label className="block text-[9px] font-bold uppercase tracking-[0.1em] text-[var(--ink3)] mb-1">Quick Stats</label>
            <div className="grid grid-cols-4 gap-2">
              <Input value={cost}      onChange={e => setCost(e.target.value)}      placeholder="Cost e.g. $240" />
              <Input value={time}      onChange={e => setTime(e.target.value)}      placeholder="Time e.g. 6 hrs" />
              <Input value={toolsUsed} onChange={e => setToolsUsed(e.target.value)} placeholder="Tools used" />
              <Input value={materials} onChange={e => setMaterials(e.target.value)} placeholder="Key materials" />
            </div>
          </div>
        </div>

        {/* Editor body */}
        <div className="flex flex-1 overflow-hidden">
          {(tab === "write" || tab === "split") && (
            <div className={`flex flex-col overflow-y-auto p-4 ${tab === "split" ? "flex-1 border-r border-[var(--border2)]" : "w-full"}`}>
              <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--ink3)] font-bold mb-2">Markdown</div>
              <Textarea
                className="flex-1 h-full border-none bg-transparent text-[11px] leading-[1.7] focus:ring-0"
                value={body}
                onChange={e => setBody(e.target.value)}
                placeholder={"## Start writing...\n\n**bold**, *italic*, - lists, > quotes"}
              />
            </div>
          )}
          {(tab === "preview" || tab === "split") && (
            <div className={`overflow-y-auto p-4 ${tab === "split" ? "flex-1" : "w-full"}`}>
              <div className="text-[9px] uppercase tracking-[0.1em] text-[var(--ink3)] font-bold mb-2">Preview</div>
              <div ref={previewRef} className="md-preview" />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-5 py-2.5 border-t border-[var(--border)] bg-[var(--bg)] flex-shrink-0">
          <span className="text-[9px] text-[var(--ink3)]">**bold** *italic* ## heading - list &gt; quote</span>
          <div className="flex gap-2">
            <Button onClick={onClose}>Discard</Button>
            <Button variant="primary" onClick={submit}>Publish Post</Button>
          </div>
        </div>
      </div>
    </div>
  )
}
