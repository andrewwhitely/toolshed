import { useEffect, useRef } from "react"
import { marked } from "marked"
import { Button } from "@/components/ui/Button"
import type { Post } from "@/types"

interface Props {
  post: Post
  onBack: () => void
  onEdit: () => void
  onDelete: () => void
}

export function PostDetail({ post, onBack, onEdit, onDelete }: Props) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current) {
      ref.current.innerHTML = marked.parse(post.body) as string
    }
  }, [post.body])

  return (
    <div className="bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md p-8 max-w-[740px]">
      <button onClick={onBack} className="text-[10px] font-bold text-[var(--accent)] mb-4 flex items-center gap-1 hover:underline">
        ← Back to all posts
      </button>
      <div className="text-[10px] text-[var(--ink3)] mb-1.5">{post.date} · {post.type}</div>
      <h1 className="font-serif text-[28px] font-black text-[var(--ink)] mb-4 leading-tight">{post.title}</h1>
      <div className="flex gap-2 flex-wrap mb-5 pb-4 border-b border-[var(--border2)]">
        {post.cost      && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-yellow-50 text-yellow-800">💰 {post.cost}</span>}
        {post.time      && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">⏱ {post.time}</span>}
        {post.toolsUsed && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--accent-bg)] text-[var(--accent)]">🔧 {post.toolsUsed}</span>}
        {post.materials && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-green-50 text-green-800">📦 {post.materials}</span>}
        {post.tags.map(t => (
          <span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border2)] rounded text-[var(--ink3)] uppercase tracking-[0.06em]">
            #{t}
          </span>
        ))}
      </div>
      <div ref={ref} className="md-preview" />
      <div className="mt-6 pt-4 border-t border-[var(--border2)] flex gap-2">
        <Button size="sm" onClick={onEdit}>✏️ Edit</Button>
        <Button size="sm" variant="danger" onClick={onDelete}>🗑 Delete</Button>
      </div>
    </div>
  )
}
