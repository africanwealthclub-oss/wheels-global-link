import { createFileRoute } from "@tanstack/react-router";
import { Check, Edit3, Eye, FileText, Plus, RefreshCw, Trash2, X } from "lucide-react";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { AdminModuleShell } from "@/components/admin-shell";
import { AdminPagination } from "@/components/admin-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminAction,
  adminCreate,
  adminDelete,
  adminList,
  adminUpdate,
} from "@/lib/vehicle-platform";

export const Route = createFileRoute("/admin/content")({
  head: () => ({ meta: [{ title: "Blog / Articles | AWA Admin" }] }),
  component: ContentAdminPage,
});
type Article = {
  id?: number;
  title: string;
  slug?: string;
  excerpt?: string;
  content?: string;
  cover_image?: string;
  status: string;
  updated_at?: string;
  published_at?: string;
};
type FormState = {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string;
  status: string;
};
const emptyForm: FormState = {
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  cover_image: "",
  status: "Draft",
};
const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

function ContentAdminPage() {
  const contentRef = useRef<HTMLTextAreaElement>(null);
  const [items, setItems] = useState<Article[]>([]);
  const [form, setForm] = useState<FormState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, per_page: 12 });
  const load = async (requestedPage = page) => {
    setLoading(true);
    try {
      const result = await adminList<Article>("articles", `?per_page=12&page=${requestedPage}`);
      setItems(result.data);
      setPagination(
        result.meta ?? { page: requestedPage, pages: 1, total: result.data.length, per_page: 12 },
      );
      setLive(true);
    } catch (error) {
      setLive(false);
      setMessage(error instanceof Error ? error.message : "Unable to load content");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(page);
  }, [page]);
  const startCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage("");
  };
  const startEdit = (article: Article) => {
    setEditingId(article.id ?? null);
    setForm({
      title: article.title,
      slug: article.slug ?? slugify(article.title),
      excerpt: article.excerpt ?? "",
      content: article.content ?? "",
      cover_image: article.cover_image ?? "",
      status: article.status || "Draft",
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeForm = () => {
    setForm(null);
    setEditingId(null);
  };
  const update = (key: keyof FormState, value: string) =>
    setForm((current) =>
      current
        ? {
            ...current,
            [key]: value,
            ...(key === "title" && !editingId ? { slug: slugify(value) } : {}),
          }
        : current,
    );
  const formatContent = (before: string, after: string) => {
    const area = contentRef.current;
    if (!area || !form) return;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const selected = form.content.slice(start, end) || "selected text";
    const next = `${form.content.slice(0, start)}${before}${selected}${after}${form.content.slice(end)}`;
    update("content", next);
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(start + before.length, start + before.length + selected.length);
    });
  };
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form?.title.trim() || !form.excerpt.trim() || !form.content.trim()) {
      setMessage("Title, excerpt, and article content are required.");
      return;
    }
    setSaving(true);
    setMessage("");
    try {
      const payload = { ...form, slug: form.slug || slugify(form.title), status: form.status };
      if (editingId) await adminUpdate("articles", editingId, payload);
      else await adminCreate("articles", payload);
      closeForm();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save article");
    } finally {
      setSaving(false);
    }
  };
  const publish = async (article: Article) => {
    if (!article.id) return;
    try {
      const action = article.status === "Published" ? "unpublish" : "publish";
      await adminAction("articles", article.id, action);
      setItems((current) =>
        current.map((item) =>
          item.id === article.id
            ? { ...item, status: action === "publish" ? "Published" : "Draft" }
            : item,
        ),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update publishing status");
    }
  };
  const remove = async (article: Article) => {
    if (!article.id || !window.confirm(`Delete “${article.title}”? This cannot be undone.`)) return;
    try {
      await adminDelete("articles", article.id);
      setItems((current) => current.filter((item) => item.id !== article.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete article");
    }
  };
  return (
    <AdminModuleShell title="Blog / Articles" eyebrow="News publishing">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Create, edit, publish, and remove blog articles and News posts.
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {loading ? "Syncing…" : live ? "Live API data" : "API unavailable"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCw /> Refresh
          </Button>
          <Button variant="automotive" onClick={startCreate}>
            <Plus /> New article
          </Button>
        </div>
      </div>
      {message && (
        <div
          role="alert"
          className="mb-5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-800"
        >
          {message}
        </div>
      )}
      {form && (
        <form
          onSubmit={save}
          className="mb-6 rounded-2xl border border-primary/20 bg-white p-5 shadow-sm sm:p-6"
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">
                {editingId ? "Edit article" : "New article"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {editingId ? "Update blog article" : "Create blog article"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={closeForm}>
              <X />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {" "}
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Title
              </span>
              <Input value={form.title} onChange={(event) => update("title", event.target.value)} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Slug (locked)
              </span>
              <Input value={form.slug} readOnly className="bg-slate-50 text-slate-500" />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Excerpt
              </span>
              <Textarea
                value={form.excerpt}
                onChange={(event) => update("excerpt", event.target.value)}
                className="min-h-20"
              />
            </label>
            <label className="block sm:col-span-2">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Article content
              </span>
              <div className="overflow-hidden rounded-md border border-input">
                <div className="flex flex-wrap gap-1 border-b border-input bg-slate-50 p-2">
                  <button
                    type="button"
                    onClick={() => formatContent("<strong>", "</strong>")}
                    className="rounded px-2 py-1 text-xs font-bold hover:bg-white"
                  >
                    Bold
                  </button>
                  <button
                    type="button"
                    onClick={() => formatContent("<em>", "</em>")}
                    className="rounded px-2 py-1 text-xs italic hover:bg-white"
                  >
                    Italic
                  </button>
                  <button
                    type="button"
                    onClick={() => formatContent("<h2>", "</h2>")}
                    className="rounded px-2 py-1 text-xs font-bold hover:bg-white"
                  >
                    Heading
                  </button>
                  <button
                    type="button"
                    onClick={() => formatContent("<ul><li>", "</li></ul>")}
                    className="rounded px-2 py-1 text-xs hover:bg-white"
                  >
                    List
                  </button>
                </div>
                <Textarea
                  ref={contentRef}
                  value={form.content}
                  onChange={(event) => update("content", event.target.value)}
                  className="min-h-72 rounded-none border-0 font-mono text-sm focus-visible:ring-0"
                  placeholder="Write article content, then use the toolbar to add formatting."
                />
              </div>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Cover image URL
              </span>
              <Input
                value={form.cover_image}
                onChange={(event) => update("cover_image", event.target.value)}
              />
              {form.cover_image && (
                <img
                  src={form.cover_image}
                  alt="Article cover preview"
                  className="mt-3 aspect-[16/9] w-full rounded-xl border border-slate-200 object-cover"
                  onError={(event) => {
                    event.currentTarget.style.display = "none";
                  }}
                />
              )}
            </label>
            <label className="block">
              <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
              </span>
              <select
                value={form.status}
                onChange={(event) => update("status", event.target.value)}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm"
              >
                <option>Draft</option>
                <option>Review</option>
                <option>Published</option>
              </select>
            </label>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Check /> {saving ? "Saving…" : editingId ? "Save changes" : "Create article"}
            </Button>
          </div>
        </form>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {items.map((item) => (
          <article
            key={item.id ?? item.title}
            className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <FileText className="h-5 w-5" />
              </div>
              <Badge variant={item.status === "Published" ? "default" : "secondary"}>
                {item.status}
              </Badge>
            </div>
            <h2 className="mt-5 text-xl font-extrabold">{item.title}</h2>
            <p className="mt-2 line-clamp-2 text-sm text-slate-500">
              {item.excerpt || "No excerpt"}
            </p>
            <p className="mt-2 text-xs text-slate-400">
              /{item.slug || slugify(item.title)} · Updated {item.updated_at || "—"}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Button variant="outline" onClick={() => startEdit(item)}>
                <Edit3 /> Edit
              </Button>
              <Button variant="outline" onClick={() => void publish(item)}>
                {item.status === "Published" ? "Unpublish" : "Publish"}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => void remove(item)}
                aria-label="Delete article"
              >
                <Trash2 />
              </Button>
            </div>
          </article>
        ))}
        {!items.length && (
          <div className="rounded-2xl border border-dashed border-slate-300 p-10 text-center text-sm text-slate-500 lg:col-span-2">
            {loading ? "Loading articles…" : "No articles found."}
          </div>
        )}
      </div>
      <div className="mt-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <AdminPagination
          page={pagination.page}
          pages={pagination.pages}
          total={pagination.total}
          perPage={pagination.per_page}
          onPageChange={setPage}
        />
      </div>
    </AdminModuleShell>
  );
}
