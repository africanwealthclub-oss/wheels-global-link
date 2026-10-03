import { createFileRoute } from "@tanstack/react-router";
import {
  Check,
  Edit3,
  PackageCheck,
  Plus,
  RefreshCw,
  Search,
  Ship,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { AdminModuleShell } from "@/components/admin-shell";
import { AdminPagination } from "@/components/admin-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { adminCreate, adminDelete, adminList, adminUpdate } from "@/lib/vehicle-platform";

export const Route = createFileRoute("/admin/orders")({
  head: () => ({ meta: [{ title: "Orders | AWA Admin" }] }),
  component: OrderAdminPage,
});
type Order = {
  id?: number;
  order_number?: string;
  customer_name: string;
  email?: string;
  phone?: string;
  item_summary: string;
  destination?: string;
  total_amount?: string | number;
  currency?: string;
  status: string;
  payment_status?: string;
  estimated_arrival?: string;
  notes?: string;
};
type FormState = Record<string, string>;
const emptyForm: FormState = {
  customer_name: "",
  email: "",
  phone: "",
  item_summary: "",
  destination: "",
  total_amount: "",
  currency: "GHS",
  status: "Processing",
  payment_status: "Unpaid",
  estimated_arrival: "",
  notes: "",
};
const statuses = ["Processing", "Shipped", "Arrived"];

function OrderAdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [query, setQuery] = useState("");
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
      const result = await adminList<Order>("orders", `?per_page=12&page=${requestedPage}`);
      setOrders(result.data);
      setPagination(
        result.meta ?? { page: requestedPage, pages: 1, total: result.data.length, per_page: 12 },
      );
      setLive(true);
    } catch (error) {
      setLive(false);
      setMessage(error instanceof Error ? error.message : "Unable to load orders");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load(page);
  }, [page]);
  const filtered = useMemo(
    () =>
      orders.filter((order) =>
        `${order.order_number} ${order.customer_name} ${order.item_summary} ${order.destination}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [orders, query],
  );
  const startCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setMessage("");
  };
  const startEdit = (order: Order) => {
    setEditingId(order.id ?? null);
    setForm({
      ...emptyForm,
      ...Object.fromEntries(
        Object.keys(emptyForm).map((key) => [key, String(order[key as keyof Order] ?? "")]),
      ),
    });
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeForm = () => {
    setForm(null);
    setEditingId(null);
  };
  const update = (key: string, value: string) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form?.customer_name.trim() || !form.item_summary.trim()) {
      setMessage("Customer name and item summary are required.");
      return;
    }
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      total_amount: form.total_amount === "" ? null : Number(form.total_amount),
    };
    try {
      if (editingId) await adminUpdate("orders", editingId, payload);
      else await adminCreate("orders", payload);
      closeForm();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save order");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (order: Order) => {
    if (
      !order.id ||
      !window.confirm(`Delete order ${order.order_number ?? order.id}? This cannot be undone.`)
    )
      return;
    try {
      await adminDelete("orders", order.id);
      setOrders((current) => current.filter((item) => item.id !== order.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete order");
    }
  };
  const changeStatus = async (order: Order, status: string) => {
    if (!order.id) return;
    try {
      await adminUpdate("orders", order.id, { status });
      setOrders((current) =>
        current.map((item) => (item.id === order.id ? { ...item, status } : item)),
      );
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to update status");
    }
  };
  const field = (key: string, label: string, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <Input
        type={type}
        value={form?.[key] ?? ""}
        onChange={(event) => update(key, event.target.value)}
      />
    </label>
  );
  return (
    <AdminModuleShell title="Orders & tracking" eyebrow="Post-purchase">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Create orders and manage customer, payment, and shipping status in one place.
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
            <Plus /> Create order
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
                {editingId ? "Edit order" : "New order"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {editingId ? "Update order details" : "Create customer order"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={closeForm}>
              <X />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {field("customer_name", "Customer name")}
            {field("email", "Email", "email")}
            {field("phone", "Phone")}
            {field("destination", "Destination")}
            {field("item_summary", "Vehicle / item")}
            {field("total_amount", "Total amount", "number")}
            {field("currency", "Currency")}
            {field("payment_status", "Payment status")}
            {field("estimated_arrival", "Estimated arrival", "date")}
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Notes
            </span>
            <Textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
            />
          </label>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Check /> {saving ? "Saving…" : editingId ? "Save changes" : "Create order"}
            </Button>
          </div>
        </form>
      )}
      <div className="mb-5 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => {
              setPage(1);
              setQuery(event.target.value);
            }}
            placeholder="Search order, customer, vehicle, or destination"
            className="pl-9"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.1fr_1.4fr_1.2fr_.8fr_.9fr_auto] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
          <span>Order</span>
          <span>Customer</span>
          <span>Item</span>
          <span>Status</span>
          <span>Payment</span>
          <span>Actions</span>
        </div>
        {filtered.map((order) => (
          <div
            key={order.id ?? order.order_number}
            className="grid gap-3 border-b border-slate-100 p-5 last:border-0 md:grid-cols-[1.1fr_1.4fr_1.2fr_.8fr_.9fr_auto] md:items-center md:gap-4 md:px-5"
          >
            <div>
              <p className="text-xs font-bold uppercase text-primary">
                {order.order_number || `Order #${order.id}`}
              </p>
              <p className="text-xs text-slate-500">{order.destination || "No destination"}</p>
            </div>
            <div>
              <p className="font-bold">{order.customer_name}</p>
              <p className="text-xs text-slate-500">{order.email || order.phone || "No contact"}</p>
            </div>
            <div className="text-sm text-slate-600">{order.item_summary}</div>
            <div>
              <select
                value={order.status}
                onChange={(event) => void changeStatus(order, event.target.value)}
                className="h-9 rounded-md border border-slate-200 px-2 text-xs font-bold"
              >
                <option>Processing</option>
                <option>Shipped</option>
                <option>Arrived</option>
              </select>
            </div>
            <div>
              <Badge variant="secondary">{order.payment_status || "Unpaid"}</Badge>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(order)}>
                <Edit3 /> Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => void remove(order)}
                aria-label="Delete order"
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="p-10 text-center text-sm text-slate-500">
            {loading ? "Loading orders…" : "No orders found."}
          </div>
        )}
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
