import { MarkdownEditor } from '@/components/blog/MarkdownEditor';
import { PostCard } from '@/components/blog/PostCard';
import { PostDetail } from '@/components/blog/PostDetail';
import { PageHeader } from '@/components/ui/PageHeader';
import { useAppStore } from '@/store/StoreContext';
import type { Post } from '@/types';
import { useState } from 'react';

interface Props {
  filter: string[];
  onFilterChange: (f: string[]) => void;
}

export function BlogPage({ filter, onFilterChange }: Props) {
  const { posts, addPost, updatePost, deletePost } = useAppStore();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);

  const allTags = [...new Set(posts.flatMap((p) => p.tags))];
  const filtered =
    filter.length > 0
      ? posts.filter(
          (p) =>
            p.tags.some((t) => filter.includes(t)) || filter.includes(p.type),
        )
      : posts;

  function toggleFilter(val: string) {
    onFilterChange(
      filter.includes(val) ? filter.filter((f) => f !== val) : [...filter, val],
    );
  }

  function handleSave(data: Omit<Post, 'id' | 'date'>) {
    if (editingPost) {
      updatePost(editingPost.id, data);
    } else {
      addPost(data);
    }
    setEditorOpen(false);
    setEditingPost(null);
  }

  function handleEdit(post: Post) {
    setEditingPost(post);
    setSelectedPost(null);
    setEditorOpen(true);
  }

  function handleDelete(post: Post) {
    if (!confirm('Delete this post?')) return;
    deletePost(post.id);
    setSelectedPost(null);
  }

  if (selectedPost) {
    return (
      <PostDetail
        post={selectedPost}
        onBack={() => setSelectedPost(null)}
        onEdit={() => handleEdit(selectedPost)}
        onDelete={() => handleDelete(selectedPost)}
      />
    );
  }

  return (
    <div>
      <PageHeader
        title={
          <>
            Field{' '}
            <em className='font-light not-italic text-[var(--accent)]'>
              Notes
            </em>
          </>
        }
        subtitle='Write up your findings, document projects, share what worked.'
      />

      <div className='grid grid-cols-[1fr_250px] gap-5 items-start'>
        <div className='flex flex-col gap-3.5'>
          {filtered.length > 0 ? (
            filtered.map((p) => (
              <PostCard
                key={p.id}
                post={p}
                onClick={() => setSelectedPost(p)}
              />
            ))
          ) : (
            <div className='text-center py-12 text-[var(--ink3)]'>
              <div className='text-3xl mb-2'>📝</div>
              <p className='text-[11px]'>
                No posts yet. Hit "New Post" to write your first one.
              </p>
            </div>
          )}
        </div>

        <div className='flex flex-col gap-3'>
          <div className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md p-3.5'>
            <div className='text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink2)] mb-2.5 pb-1.5 border-b border-[var(--border2)]'>
              Tags
            </div>
            {allTags.map((t) => (
              <div
                key={t}
                className='flex items-center justify-between py-1.5 text-[11px] border-b border-[var(--border2)] last:border-0'
              >
                <button
                  onClick={() => toggleFilter(t)}
                  className={`hover:text-[var(--accent)] transition-colors ${filter.includes(t) ? 'text-[var(--accent)] font-bold' : 'text-[var(--ink2)]'}`}
                >
                  #{t}
                </button>
                <span className='text-[9px] font-bold text-[var(--accent)] cursor-pointer'>
                  {posts.filter((p) => p.tags.includes(t)).length}
                </span>
              </div>
            ))}
            {filter.length > 0 && (
              <div className='mt-2'>
                <button
                  onClick={() => onFilterChange([])}
                  className='text-[9px] font-bold text-[var(--accent)] underline underline-offset-2'
                >
                  ← Show all
                </button>
              </div>
            )}
          </div>
          <div className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md p-3.5'>
            <div className='text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink2)] mb-2.5 pb-1.5 border-b border-[var(--border2)]'>
              By Type
            </div>
            {['DIY', 'Paid', 'Review', 'Tips'].map((ty) => (
              <div
                key={ty}
                className='flex items-center justify-between py-1.5 text-[11px] border-b border-[var(--border2)] last:border-0'
              >
                <button
                  onClick={() => toggleFilter(ty)}
                  className={`hover:text-[var(--accent)] transition-colors ${filter.includes(ty) ? 'text-[var(--accent)] font-bold' : 'text-[var(--ink2)]'}`}
                >
                  {ty}
                </button>
                <span className='text-[9px] font-bold text-[var(--accent)] cursor-pointer'>
                  {posts.filter((p) => p.type === ty).length}
                </span>
              </div>
            ))}
          </div>
          <div className='bg-[var(--white)] border-[1.5px] border-[var(--border)] rounded-md p-3.5'>
            <div className='text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--ink2)] mb-2.5 pb-1.5 border-b border-[var(--border2)]'>
              Stats
            </div>
            <div className='text-[11px] text-[var(--ink2)] leading-[2.2]'>
              {posts.length} total posts
              <br />
              {allTags.length} unique tags
              <br />
              {posts.filter((p) => p.type === 'DIY').length} DIY write-ups
              <br />
              {posts.filter((p) => p.type === 'Review').length} reviews
            </div>
          </div>
        </div>
      </div>

      <MarkdownEditor
        open={editorOpen}
        initial={editingPost ?? undefined}
        onClose={() => {
          setEditorOpen(false);
          setEditingPost(null);
        }}
        onSave={handleSave}
      />
    </div>
  );
}
