import type { Post } from "@/types"

interface Props {
	post: Post
	onClick: () => void
}

function excerpt(body: string) {
	return body
		.replace(/#+\s/g, "")
		.replace(/\*\*/g, "")
		.replace(/\*/g, "")
		.replace(/>/g, "")
		.replace(/\r?\n/g, " ")
		.slice(0, 160) + "…"
}

export function PostCard({ post, onClick }: Props) {
	return (
		<div onClick={onClick} className="bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-200">
			<div className="p-5">
				<div className="text-[9px] text-[var(--ink3)] mb-1.5 uppercase tracking-[0.06em]">{post.date} · {post.type}</div>
				<div className="font-serif text-[19px] font-bold text-[var(--ink)] mb-1.5 leading-tight">{post.title}</div>
				<div className="text-[10px] text-[var(--ink2)] leading-[1.7] mb-3">{excerpt(post.body)}</div>
				<div className="flex gap-1.5 flex-wrap mb-2">
					{post.tags.map(t => (
						<span key={t} className="text-[9px] font-semibold px-1.5 py-0.5 bg-[var(--bg)] border border-[var(--border2)] rounded text-[var(--ink3)] uppercase tracking-[0.06em]">
							#{t}
						</span>
					))}
				</div>
				<div className="flex gap-1.5 flex-wrap">
					{post.cost && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-yellow-50 text-yellow-800">💰 {post.cost}</span>}
					{post.time && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-800">⏱ {post.time}</span>}
					{post.toolsUsed && <span className="text-[9px] font-semibold px-2 py-0.5 rounded bg-[var(--accent-bg)] text-[var(--accent)]">🔧 {post.toolsUsed}</span>}
				</div>
			</div>
		</div>
	)
}
