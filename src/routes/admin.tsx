import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  Activity,
  ArrowUpRight,
  BarChart3,
  Bell,
  CarFront,
  ChevronRight,
  ClipboardList,
  FileText,
  LayoutDashboard,
  PackageCheck,
  Plus,
  Search,
  Settings,
  ShieldCheck,
  Users,
} from "lucide-react";
import { AdminModuleShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { API_BASE_URL, apiRequest, checkApiReady } from "@/lib/vehicle-platform";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Dashboard | AWA AUTO MALL" }] }),
  component: AdminLayout,
});

type Summary = {
  totalVehicles: number;
  availableVehicles: number;
  inquiries: number;
  newInquiries?: number;
  activeOrders: number;
};
const emptySummary: Summary = {
  totalVehicles: 0,
  availableVehicles: 0,
  inquiries: 0,
  activeOrders: 0,
};
const inquiries: Array<{
  name: string;
  type: string;
  vehicle: string;
  time: string;
  status: string;
}> = [];
const orders: Array<{
  reference: string;
  customer: string;
  vehicle: string;
  status: string;
  progress: number;
}> = [];
function AdminOverview() {
  const [summary, setSummary] = useState<Summary>(emptySummary);
  const [loading, setLoading] = useState(Boolean(API_BASE_URL));
  const [connected, setConnected] = useState(false);
  useEffect(() => {
    if (!API_BASE_URL) {
      setLoading(false);
      return;
    }
    checkApiReady()
      .then((ready) => {
        setConnected(ready);
        if (!ready) return;
        return apiRequest<{ ok: true; data: Summary }>("/admin/summary")
          .then((payload) =>
            setSummary({
              ...payload.data,
              inquiries: payload.data.newInquiries ?? payload.data.inquiries ?? 0,
            }),
          )
          .catch(() => setConnected(false));
      })
      .finally(() => setLoading(false));
  }, []);
  return (
    <AdminModuleShell title="Dashboard" eyebrow="Good morning, AWA team">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <Badge variant={connected ? "default" : "secondary"}>
              {connected ? "LIVE API" : "DEV PREVIEW"}
            </Badge>
            <span className="text-xs font-semibold text-slate-500">
              {loading
                ? "Syncing with PHP API…"
                : connected
                  ? "Last synced just now"
                  : "API unavailable"}
            </span>
          </div>
          <p className="mt-2 text-sm text-slate-500">
            Here is what is happening across your vehicle business today.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <FileText /> Export
          </Button>
          <Button variant="automotive" size="sm">
            <Plus /> <span className="hidden sm:inline">Add vehicle</span>
          </Button>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:gap-4 xl:grid-cols-4">
        <Metric
          label="Total vehicles"
          value={summary.totalVehicles}
          change="—"
          icon={CarFront}
          tone="blue"
        />
        <Metric
          label="Available vehicles"
          value={summary.availableVehicles}
          change="—"
          icon={ShieldCheck}
          tone="green"
        />
        <Metric
          label="New inquiries"
          value={summary.inquiries}
          change="—"
          icon={ClipboardList}
          tone="orange"
        />
        <Metric
          label="Active orders"
          value={summary.activeOrders}
          change="—"
          icon={PackageCheck}
          tone="purple"
        />
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.6fr_1fr]">
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Performance overview
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Inquiry conversion</h2>
            </div>
            <select className="rounded-lg border border-slate-200 bg-white px-2 py-2 text-xs">
              <option>Last 30 days</option>
              <option>Last 90 days</option>
            </select>
          </div>
          <div className="mt-6 flex h-48 items-end gap-2 sm:gap-4">
            {[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0].map((height, index) => (
              <div key={index} className="group flex flex-1 flex-col items-center gap-2">
                <div
                  className="relative w-full rounded-t-md bg-primary/15 transition-colors group-hover:bg-primary"
                  style={{ height: `${height}%` }}
                >
                  <span className="absolute -top-6 left-1/2 hidden -translate-x-1/2 text-xs font-bold group-hover:block">
                    {height}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400">
                  {["May 1", "5", "10", "15", "20", "25", "30"][index % 7]}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-500">
            <span>
              <i className="mr-2 inline-block h-2 w-2 rounded-full bg-primary" />
              Inquiries received
            </span>
            <span>
              <i className="mr-2 inline-block h-2 w-2 rounded-full bg-emerald-400" />
              Quotes sent
            </span>
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Inventory health
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Vehicle status</h2>
            </div>
            <CarFront className="text-primary" />
          </div>
          <div className="mt-6 space-y-5">
            <StatusBar
              label="Available"
              value={summary.availableVehicles}
              total={summary.totalVehicles}
              color="bg-emerald-500"
            />
            <StatusBar
              label="Reserved"
              value={2}
              total={summary.totalVehicles}
              color="bg-amber-400"
            />
            <StatusBar label="Sold" value={1} total={summary.totalVehicles} color="bg-primary" />
            <StatusBar
              label="Made to order"
              value={1}
              total={summary.totalVehicles}
              color="bg-violet-500"
            />
          </div>
          <Button variant="outline" className="mt-6 w-full">
            Manage inventory <ChevronRight />
          </Button>
        </section>
      </div>
      <div className="mt-6 grid gap-6 xl:grid-cols-[1.2fr_.8fr]">
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Needs attention
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Recent inquiries</h2>
            </div>
            <Button variant="ghost" size="sm">
              View all <ChevronRight />
            </Button>
          </div>
          <div className="divide-y divide-slate-100">
            {inquiries.length ? (
              inquiries.map((item) => (
                <div key={item.name} className="flex items-center gap-3 p-4 sm:gap-4 sm:px-6">
                  <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {item.name
                      .split(" ")
                      .map((part) => part[0])
                      .join("")}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">{item.name}</p>
                    <p className="truncate text-xs text-slate-500">
                      {item.type} · {item.vehicle}
                    </p>
                  </div>
                  <div className="hidden text-right sm:block">
                    <Badge variant={item.status === "New" ? "default" : "secondary"}>
                      {item.status}
                    </Badge>
                    <p className="mt-1 text-[11px] text-slate-400">{item.time}</p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-slate-300 sm:hidden" />
                </div>
              ))
            ) : (
              <p className="p-6 text-sm text-slate-500">No inquiries have been received yet.</p>
            )}
          </div>
        </section>
        <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 p-5 sm:p-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                Post-purchase
              </p>
              <h2 className="mt-1 text-xl font-extrabold">Active orders</h2>
            </div>
            <PackageCheck className="text-primary" />
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            {orders.length ? (
              orders.map((order) => (
                <div key={order.reference}>
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-bold text-primary">{order.reference}</p>
                      <p className="mt-1 text-sm font-bold">{order.customer}</p>
                      <p className="text-xs text-slate-500">{order.vehicle}</p>
                    </div>
                    <span className="text-right text-[11px] font-semibold text-slate-500">
                      {order.progress}%<br />
                      complete
                    </span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                    <div
                      className="h-full rounded-full bg-primary"
                      style={{ width: `${order.progress}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-slate-500">{order.status}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-500">No active orders have been created yet.</p>
            )}
            <Button variant="outline" className="w-full">
              Track all orders <ChevronRight />
            </Button>
          </div>
        </section>
      </div>
      <section className="mt-6 rounded-2xl border border-dashed border-primary/30 bg-primary/[.04] p-5 sm:p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex gap-3">
            <Activity className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <h2 className="font-extrabold">API-ready development view</h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                Connect <code className="font-bold">VITE_API_BASE_URL</code> and sign in with an
                authorized admin account to load live vehicles, inquiries, orders, and metrics from
                the PHP API.
              </p>
            </div>
          </div>
          <Button variant="outline" className="shrink-0">
            API mapping guide <ArrowUpRight />
          </Button>
        </div>
      </section>
    </AdminModuleShell>
  );
}
function AdminLayout() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  // /admin is the overview; /admin/vehicles, /admin/orders, ... render through the Outlet.
  if (pathname.replace(/\/+$/, "") !== "/admin") return <Outlet />;
  return <AdminOverview />;
}
function Metric({
  label,
  value,
  change,
  icon: Icon,
  tone,
}: {
  label: string;
  value: number;
  change: string;
  icon: typeof CarFront;
  tone: string;
}) {
  const toneClass =
    tone === "green"
      ? "bg-emerald-50 text-emerald-600"
      : tone === "orange"
        ? "bg-orange-50 text-orange-600"
        : tone === "purple"
          ? "bg-violet-50 text-violet-600"
          : "bg-blue-50 text-blue-600";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
      <div className="flex items-start justify-between">
        <div className={`grid h-10 w-10 place-items-center rounded-xl ${toneClass}`}>
          <Icon className="h-5 w-5" />
        </div>
        <span className="flex items-center gap-1 text-xs font-bold text-emerald-600">
          <ArrowUpRight className="h-3 w-3" />
          {change}
        </span>
      </div>
      <p className="mt-3 text-xs font-semibold text-slate-500 sm:mt-5">{label}</p>
      <p className="mt-1 text-2xl font-extrabold tracking-tight sm:text-3xl">{value}</p>
      <p className="mt-1 text-[11px] text-slate-400">vs last month</p>
    </div>
  );
}
function StatusBar({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percentage = Math.max(8, Math.round((value / Math.max(total, 1)) * 100));
  return (
    <div>
      <div className="mb-2 flex justify-between text-sm">
        <span className="font-semibold">{label}</span>
        <span className="text-slate-500">{value}</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-slate-100">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
}
