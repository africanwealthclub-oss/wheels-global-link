import { createFileRoute } from "@tanstack/react-router";
import { Check, Edit3, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import { useEffect, useMemo, useState, type ChangeEvent, type FormEvent } from "react";
import { AdminModuleShell } from "@/components/admin-shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  adminCreate,
  adminDelete,
  adminList,
  adminUpdate,
  adminUploadFiles,
} from "@/lib/vehicle-platform";

export const Route = createFileRoute("/admin/vehicles")({
  head: () => ({ meta: [{ title: "Vehicles | AWA Admin" }] }),
  component: VehicleAdminPage,
});
type Vehicle = {
  id?: number;
  slug?: string;
  brand: string;
  model: string;
  year?: number;
  category?: string;
  condition_name?: string;
  condition?: string;
  fuel?: string;
  transmission?: string;
  drive_type?: string;
  price?: string | number;
  currency?: string;
  availability?: string;
  mileage?: string;
  description?: string;
  image?: string;
  is_published?: number | boolean;
  featured?: number | boolean;
};
type FormState = Record<string, string | number | boolean>;
const emptyForm: FormState = {
  brand: "",
  model: "",
  year: new Date().getFullYear(),
  category: "SUV",
  condition_name: "New",
  fuel: "Petrol",
  transmission: "Automatic",
  drive_type: "",
  price: "",
  currency: "GHS",
  availability: "Available",
  mileage: "",
  description: "",
  image: "",
  is_published: true,
  featured: false,
};

function VehicleAdminPage() {
  const [items, setItems] = useState<Vehicle[]>([]);
  const [query, setQuery] = useState("");
  const [form, setForm] = useState<FormState | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const load = async () => {
    setLoading(true);
    try {
      const result = await adminList<Vehicle>("vehicles");
      setItems(result.data);
      setConnected(true);
    } catch (error) {
      setConnected(false);
      setMessage(error instanceof Error ? error.message : "Unable to load vehicles");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    void load();
  }, []);
  const filtered = useMemo(
    () =>
      items.filter((vehicle) =>
        `${vehicle.brand} ${vehicle.model} ${vehicle.slug}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      ),
    [items, query],
  );
  const startCreate = () => {
    setEditingId(null);
    setForm({ ...emptyForm });
    setImageFiles([]);
    setMessage("");
  };
  const startEdit = (vehicle: Vehicle) => {
    setEditingId(vehicle.id ?? null);
    setForm({
      ...emptyForm,
      ...vehicle,
      condition_name: vehicle.condition_name ?? vehicle.condition ?? "New",
      is_published: Boolean(vehicle.is_published),
      featured: Boolean(vehicle.featured),
    });
    setImageFiles([]);
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const closeForm = () => {
    setForm(null);
    setEditingId(null);
    setImageFiles([]);
  };
  const update = (key: string, value: string | boolean) =>
    setForm((current) => (current ? { ...current, [key]: value } : current));
  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!form || !String(form.brand).trim() || !String(form.model).trim()) {
      setMessage("Brand and model are required.");
      return;
    }
    setSaving(true);
    setMessage("");
    const payload = {
      ...form,
      year: Number(form.year) || new Date().getFullYear(),
      price: form.price === "" ? null : Number(form.price),
      is_published: form.is_published ? 1 : 0,
      featured: form.featured ? 1 : 0,
      slug: `${form.brand}-${form.model}-${form.year}`.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    };
    try {
      const result = editingId
        ? await adminUpdate("vehicles", editingId, payload).then(() => ({ id: editingId }))
        : await adminCreate("vehicles", payload);
      if (imageFiles.length) {
        const uploaded = await adminUploadFiles(imageFiles, "vehicles", result.id);
        const urls = uploaded.data.map((file) => file.url);
        await adminUpdate("vehicles", result.id, {
          image: urls[0] ?? "",
          images_json: JSON.stringify(urls),
        });
      }
      closeForm();
      await load();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save vehicle");
    } finally {
      setSaving(false);
    }
  };
  const remove = async (vehicle: Vehicle) => {
    if (
      !vehicle.id ||
      !window.confirm(`Delete ${vehicle.brand} ${vehicle.model}? This cannot be undone.`)
    )
      return;
    try {
      await adminDelete("vehicles", vehicle.id);
      setItems((current) => current.filter((item) => item.id !== vehicle.id));
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to delete vehicle");
    }
  };
  const field = (key: string, label: string, type = "text") => (
    <label className="block">
      <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
        {label}
      </span>
      <Input
        type={type}
        value={String(form?.[key] ?? "")}
        onChange={(event) => update(key, event.target.value)}
      />
    </label>
  );
  return (
    <AdminModuleShell title="Vehicle inventory" eyebrow="Catalog management">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-slate-500">
            Create, edit, publish, and remove vehicles directly in the workspace.
          </p>
          <p className="mt-1 text-xs font-semibold text-slate-400">
            {loading ? "Syncing…" : connected ? "Live API data" : "API unavailable"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => void load()}>
            <RefreshCw /> Refresh
          </Button>
          <Button variant="automotive" onClick={startCreate}>
            <Plus /> Add vehicle
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
                {editingId ? "Edit vehicle" : "New vehicle"}
              </p>
              <h2 className="mt-1 text-2xl font-extrabold">
                {editingId ? "Update inventory details" : "Add inventory"}
              </h2>
            </div>
            <Button type="button" variant="ghost" size="icon" onClick={closeForm}>
              <X />
            </Button>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {field("brand", "Brand")}
            {field("model", "Model")}
            {field("year", "Year", "number")}
            {field("category", "Category")}
            {field("condition_name", "Condition")}
            {field("fuel", "Fuel")}
            {field("transmission", "Transmission")}
            {field("drive_type", "Drive type")}
            {field("price", "Price", "number")}
            {field("currency", "Currency")}
            {field("availability", "Availability")}
            {field("mileage", "Mileage")}
            {field("image", "Image URL")}
          </div>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Vehicle images
            </span>
            <Input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={(event: ChangeEvent<HTMLInputElement>) =>
                setImageFiles(Array.from(event.target.files ?? []))
              }
            />
            <span className="mt-1 block text-xs text-slate-500">
              Select multiple JPG, PNG, or WebP images. Maximum 12 MB per image.
            </span>
            {imageFiles.length > 0 && (
              <span className="mt-2 block text-xs font-semibold text-primary">
                {imageFiles.length} image{imageFiles.length === 1 ? "" : "s"} ready to upload
              </span>
            )}
          </label>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-500">
              Description
            </span>
            <Textarea
              value={String(form.description ?? "")}
              onChange={(event) => update("description", event.target.value)}
            />
          </label>
          <div className="mt-4 flex flex-wrap gap-5 text-sm font-semibold text-slate-700">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.is_published)}
                onChange={(event) => update("is_published", event.target.checked)}
              />{" "}
              Published
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={Boolean(form.featured)}
                onChange={(event) => update("featured", event.target.checked)}
              />{" "}
              Featured
            </label>
          </div>
          <div className="mt-6 flex flex-wrap justify-end gap-2">
            <Button type="button" variant="outline" onClick={closeForm}>
              Cancel
            </Button>
            <Button type="submit" disabled={saving}>
              <Check /> {saving ? "Saving…" : editingId ? "Save changes" : "Create vehicle"}
            </Button>
          </div>
        </form>
      )}
      <div className="mb-5 flex gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search brand, model, or slug"
            className="pl-9"
          />
        </div>
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="hidden grid-cols-[1.4fr_.7fr_.8fr_.8fr_auto] gap-4 border-b border-slate-100 px-5 py-3 text-xs font-bold uppercase tracking-wide text-slate-400 md:grid">
          <span>Vehicle</span>
          <span>Status</span>
          <span>Price</span>
          <span>Availability</span>
          <span>Actions</span>
        </div>
        {filtered.map((vehicle) => (
          <div
            key={vehicle.id ?? vehicle.slug}
            className="grid gap-3 border-b border-slate-100 p-5 last:border-0 md:grid-cols-[1.4fr_.7fr_.8fr_.8fr_auto] md:items-center md:gap-4 md:px-5"
          >
            <div>
              <p className="text-xs font-bold uppercase text-primary">
                {vehicle.brand} · {vehicle.year}
              </p>
              <p className="text-lg font-extrabold">{vehicle.model}</p>
              <p className="text-xs text-slate-500">{vehicle.slug || "No slug"}</p>
            </div>
            <div>
              <Badge variant={vehicle.is_published ? "default" : "secondary"}>
                {vehicle.is_published ? "Published" : "Draft"}
              </Badge>
            </div>
            <div className="text-sm font-semibold">
              {vehicle.price
                ? `${vehicle.currency ?? "GHS"} ${vehicle.price}`
                : "Contact for price"}
            </div>
            <div className="text-sm text-slate-600">{vehicle.availability ?? "Available"}</div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={() => startEdit(vehicle)}>
                <Edit3 /> Edit
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => void remove(vehicle)}
                aria-label={`Delete ${vehicle.model}`}
              >
                <Trash2 />
              </Button>
            </div>
          </div>
        ))}
        {!filtered.length && (
          <div className="p-10 text-center text-sm text-slate-500">
            {loading ? "Loading vehicles…" : "No vehicles found."}
          </div>
        )}
      </div>
    </AdminModuleShell>
  );
}
