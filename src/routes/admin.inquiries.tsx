import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Mail, Phone, Search, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminModuleShell } from "@/components/admin-shell";
import { AdminPagination } from "@/components/admin-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, adminList, adminUpdate } from "@/lib/vehicle-platform";
export const Route = createFileRoute("/admin/inquiries")({
  head: () => ({ meta: [{ title: "Inquiries | AWA Admin" }] }),
  component: InquiryAdminPage,
});
type Inquiry = {
  id?: number;
  customer_name: string;
  phone?: string;
  email?: string;
  request_text: string;
  type: string;
  status: string;
  priority?: string;
  created_at?: string;
  source?: string;
  items_json?: string | Record<string, unknown> | unknown[];
  assigned_to?: number | null;
  next_follow_up_at?: string | null;
};
function InquiryAdminPage() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(Boolean(API_BASE_URL));
  const [selected, setSelected] = useState<Inquiry | null>(null);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0, per_page: 12 });
  const load = (requestedPage = page) => {
    if (!API_BASE_URL) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminList<Inquiry>("inquiries", `?per_page=12&page=${requestedPage}`)
      .then((r) => {
        setItems(r.data);
        setPagination(
          r.meta ?? { page: requestedPage, pages: 1, total: r.data.length, per_page: 12 },
        );
        setLive(true);
      })
      .catch(() => setLive(false))
      .finally(() => setLoading(false));
  };
  useEffect(() => {
    load(page);
  }, [page]);
  const filtered = useMemo(
    () =>
      items.filter((x) =>
        `${x.customer_name} ${x.email} ${x.request_text}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );
  async function update(item: Inquiry, patch: Record<string, unknown>) {
    if (!item.id) return;
    try {
      await adminUpdate("inquiries", item.id, patch);
      setItems((all) => all.map((x) => (x.id === item.id ? ({ ...x, ...patch } as Inquiry) : x)));
      setSelected((current) =>
        current?.id === item.id ? ({ ...current, ...patch } as Inquiry) : current,
      );
    } catch (e) {
      alert(e instanceof Error ? e.message : "Update failed");
    }
  }
  return (
    <AdminModuleShell title="Inquiries" eyebrow="Lead management">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Review, qualify, assign, and move customer conversations forward.
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {loading ? "Syncing…" : live ? "Live API data" : "API unavailable"}
          </p>
        </div>
      </div>
      <div className="mb-5 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => {
              setPage(1);
              setQuery(e.target.value);
            }}
            placeholder="Search customer or request"
            className="pl-9"
          />
        </div>
        <Button variant="outline" onClick={load}>
          Refresh
        </Button>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="border-b border-slate-100 bg-slate-50 text-xs uppercase text-slate-400">
              <tr>
                <th className="p-4">Customer</th>
                <th className="p-4">Request</th>
                <th className="p-4">Type</th>
                <th className="p-4">Priority</th>
                <th className="p-4">Status</th>
                <th className="p-4" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.length ? (
                filtered.map((item, i) => (
                  <tr key={item.id ?? item.email ?? i}>
                    <td className="p-4">
                      <strong>{item.customer_name}</strong>
                      <span className="mt-1 block text-xs text-slate-500">
                        {item.phone || item.email}
                      </span>
                    </td>
                    <td className="p-4 font-semibold">{item.request_text}</td>
                    <td className="p-4 text-slate-500">{item.type}</td>
                    <td className="p-4">
                      <select
                        value={item.priority || "Normal"}
                        onChange={(e) => update(item, { priority: e.target.value })}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        <option>Low</option>
                        <option>Normal</option>
                        <option>High</option>
                        <option>Urgent</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <select
                        value={item.status}
                        onChange={(e) => update(item, { status: e.target.value })}
                        className="rounded border px-2 py-1 text-xs"
                      >
                        <option>New</option>
                        <option>Contacted</option>
                        <option>Quoted</option>
                        <option>Negotiating</option>
                        <option>Won</option>
                        <option>Closed</option>
                      </select>
                    </td>
                    <td className="p-4">
                      <Button size="sm" variant="outline" onClick={() => setSelected(item)}>
                        <CheckCircle2 /> Open
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-sm text-slate-500">
                    No inquiries found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
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
      {!live && !loading && (
        <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-5 text-sm text-slate-600">
          Live inquiry data is unavailable. Configure the API and sign in with an authorized admin
          account.
        </div>
      )}
      {selected && (
        <div
          className="fixed inset-0 z-[80] flex items-end justify-center bg-slate-950/60 p-0 backdrop-blur-sm sm:items-center sm:p-6"
          role="dialog"
          aria-modal="true"
          aria-labelledby="inquiry-detail-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelected(null);
          }}
        >
          <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white p-5 shadow-2xl sm:rounded-3xl sm:p-7">
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-5">
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">
                  Inquiry details
                </p>
                <h2
                  id="inquiry-detail-title"
                  className="mt-1 text-2xl font-extrabold text-slate-900"
                >
                  {selected.customer_name}
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  {selected.created_at
                    ? new Date(selected.created_at).toLocaleString()
                    : "Date not provided"}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close inquiry details"
                onClick={() => setSelected(null)}
                className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {selected.phone && (
                <a
                  href={`tel:${selected.phone}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-700 hover:border-primary"
                >
                  <Phone className="h-4 w-4 text-primary" /> {selected.phone}
                </a>
              )}
              {selected.email && (
                <a
                  href={`mailto:${selected.email}`}
                  className="flex items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-semibold text-slate-700 hover:border-primary"
                >
                  <Mail className="h-4 w-4 text-primary" /> {selected.email}
                </a>
              )}
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Type
                <span className="mt-1 block rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold normal-case text-slate-800">
                  {selected.type || "Quote"}
                </span>
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Priority
                <select
                  value={selected.priority || "Normal"}
                  onChange={(event) => void update(selected, { priority: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-800"
                >
                  <option>Low</option>
                  <option>Normal</option>
                  <option>High</option>
                  <option>Urgent</option>
                </select>
              </label>
              <label className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                Status
                <select
                  value={selected.status}
                  onChange={(event) => void update(selected, { status: event.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold normal-case text-slate-800"
                >
                  <option>New</option>
                  <option>Contacted</option>
                  <option>Quoted</option>
                  <option>Negotiating</option>
                  <option>Won</option>
                  <option>Closed</option>
                </select>
              </label>
            </div>
            <div className="mt-6 rounded-2xl bg-slate-50 p-5">
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Customer request
              </p>
              <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                {selected.request_text}
              </p>
            </div>
            <div className="mt-6 flex justify-end">
              <Button variant="outline" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </section>
        </div>
      )}
    </AdminModuleShell>
  );
}
