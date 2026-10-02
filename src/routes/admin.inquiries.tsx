import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, MessageCircle, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { AdminModuleShell } from "@/components/admin-shell";
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
};
const demo: Inquiry[] = [
  {
    customer_name: "Kwame Mensah",
    phone: "+233 592 656 665",
    email: "kwame@example.com",
    request_text: "2024 Toyota Land Cruiser",
    type: "Vehicle quote",
    status: "New",
    priority: "High",
  },
  {
    customer_name: "Sarah Okafor",
    phone: "+234 801 000 1222",
    email: "sarah@example.com",
    request_text: "2023 Lexus RX 350",
    type: "Sourcing request",
    status: "Contacted",
    priority: "Normal",
  },
];
function InquiryAdminPage() {
  const [items, setItems] = useState(demo);
  const [query, setQuery] = useState("");
  const [live, setLive] = useState(false);
  const [loading, setLoading] = useState(Boolean(API_BASE_URL));
  const load = () => {
    if (!API_BASE_URL) {
      setLoading(false);
      return;
    }
    setLoading(true);
    adminList<Inquiry>("inquiries")
      .then((r) => {
        setItems(r.data);
        setLive(true);
      })
      .catch(() => setLive(false))
      .finally(() => setLoading(false));
  };
  useEffect(load, []);
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
            {loading ? "Syncing…" : live ? "Live API data" : "Demo data"}
          </p>
        </div>
        <Button variant="automotive">
          <MessageCircle /> Open WhatsApp
        </Button>
      </div>
      <div className="mb-5 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
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
              {filtered.map((item, i) => (
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
                    <Button size="sm" variant="outline">
                      <CheckCircle2 /> Open
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {!live && (
        <div className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/[.04] p-5 text-sm text-slate-600">
          <strong className="block text-slate-900">Demo data mode</strong>Configure{" "}
          <code>VITE_API_BASE_URL</code> and an admin key/session to enable live inquiry management.
        </div>
      )}
    </AdminModuleShell>
  );
}
