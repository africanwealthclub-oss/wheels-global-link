import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Check,
  Fuel,
  Gauge,
  GitCompareArrows,
  Heart,
  Settings2,
  X,
} from "lucide-react";
import { createContext, useContext, useState, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { getVehicleFallbackImage, type Part, type Vehicle } from "@/lib/inventory";
import { getFavoriteSlugs, toggleFavorite, trackAnalytics } from "@/lib/vehicle-platform";

type CompareContextValue = {
  selected: string[];
  toggle: (slug: string) => void;
  clear: () => void;
};
const CompareContext = createContext<CompareContextValue | undefined>(undefined);
export function CompareProvider({ children }: { children: ReactNode }) {
  const [selected, setSelected] = useState<string[]>([]);
  function toggle(slug: string) {
    setSelected((current) => {
      const alreadySelected = current.includes(slug);
      trackAnalytics("compare", "vehicle", undefined, {
        slug,
        action: alreadySelected ? "remove" : "add",
      });
      return alreadySelected
        ? current.filter((item) => item !== slug)
        : current.length < 3
          ? [...current, slug]
          : current;
    });
  }
  return (
    <CompareContext.Provider value={{ selected, toggle, clear: () => setSelected([]) }}>
      {children}
    </CompareContext.Provider>
  );
}
function useCompare() {
  const context = useContext(CompareContext);
  if (!context) throw new Error("CompareProvider is required");
  return context;
}

export function SectionHeading({
  eyebrow,
  title,
  copy,
  inverse = false,
}: {
  eyebrow?: string;
  title: string;
  copy?: string;
  inverse?: boolean;
}) {
  return (
    <div className="mb-10 max-w-2xl">
      <div className="mb-4 flex items-center gap-3">
        <span className="h-0.5 w-10 bg-destructive" />
        {eyebrow && (
          <span
            className={`text-xs font-bold uppercase ${inverse ? "text-primary-foreground/65" : "text-primary"}`}
          >
            {eyebrow}
          </span>
        )}
      </div>
      <h2
        className={`text-4xl font-extrabold uppercase leading-none sm:text-5xl ${inverse ? "text-primary-foreground" : "text-foreground"}`}
      >
        {title}
      </h2>
      {copy && (
        <p
          className={`mt-4 leading-7 ${inverse ? "text-primary-foreground/65" : "text-muted-foreground"}`}
        >
          {copy}
        </p>
      )}
    </div>
  );
}

export function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const { selected, toggle } = useCompare();
  const isSelected = selected.includes(vehicle.slug);
  const [saved, setSaved] = useState(() => getFavoriteSlugs().includes(vehicle.slug));
  return (
    <article className="group overflow-hidden border border-border bg-card">
      <Link
        to="/cars/$slug"
        params={{ slug: vehicle.slug }}
        preload="intent"
        className="block overflow-hidden bg-muted"
      >
        <img
          src={vehicle.image}
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getVehicleFallbackImage(vehicle.category);
          }}
          alt={`${vehicle.year} ${vehicle.brand} ${vehicle.model}`}
          width={1200}
          height={760}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="p-5">
        <div className="flex justify-between gap-4">
          <div>
            <span className="text-xs font-bold uppercase text-primary">{vehicle.brand}</span>
            <h3 className="mt-1 text-2xl font-bold uppercase">{vehicle.model}</h3>
          </div>
          <span className="text-sm font-bold">{vehicle.year}</span>
        </div>
        <div className="my-5 grid grid-cols-3 border-y border-border py-3 text-xs text-muted-foreground">
          <span>
            <Gauge className="mb-1 h-4 w-4 text-primary" />
            {vehicle.condition}
          </span>
          <span>
            <Fuel className="mb-1 h-4 w-4 text-primary" />
            {vehicle.fuel}
          </span>
          <span>
            <Settings2 className="mb-1 h-4 w-4 text-primary" />
            {vehicle.transmission}
          </span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <strong>{vehicle.price}</strong>
          <button
            type="button"
            onClick={() => {
              const next = toggleFavorite(vehicle.slug);
              setSaved(next.includes(vehicle.slug));
              trackAnalytics("favorite", "vehicle", undefined, {
                slug: vehicle.slug,
                saved: next.includes(vehicle.slug),
              });
            }}
            className="inline-flex items-center gap-1 text-xs font-bold uppercase text-primary"
            aria-pressed={saved}
          >
            <Heart className={`h-4 w-4 ${saved ? "fill-current" : ""}`} />
            {saved ? "Saved" : "Save"}
          </button>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline">
            <Link to="/cars/$slug" params={{ slug: vehicle.slug }} preload="intent">
              Details
            </Link>
          </Button>
          <Button
            type="button"
            variant={isSelected ? "default" : "automotive"}
            onClick={() => toggle(vehicle.slug)}
            aria-pressed={isSelected}
          >
            <GitCompareArrows />
            Compare
          </Button>
        </div>
      </div>
    </article>
  );
}
export function VehicleGrid({ items }: { items: Vehicle[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {items.map((v) => (
        <VehicleCard key={v.slug} vehicle={v} />
      ))}
    </div>
  );
}

export function CompareTray() {
  const { selected, clear } = useCompare();
  if (!selected.length) return null;
  return (
    <div className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] left-4 z-40 max-w-[calc(100vw-2rem)] border border-border bg-background p-3 shadow-xl sm:bottom-5 sm:left-5 sm:max-w-[calc(100vw-7rem)]">
      <div className="flex flex-wrap items-center gap-3">
        <GitCompareArrows className="h-5 w-5 text-primary" />
        <div>
          <span className="block text-xs font-bold uppercase">{selected.length}/3 vehicles</span>
          {selected.length === 1 && (
            <span className="block text-xs text-muted-foreground">
              Suggestion: add one more vehicle to compare.
            </span>
          )}
        </div>
        <a
          href={`/compare?ids=${selected.join(",")}`}
          className="inline-flex items-center gap-2 bg-primary px-3 py-2 text-xs font-bold uppercase text-primary-foreground"
        >
          Compare
          <ArrowRight className="h-4 w-4" />
        </a>
        <button
          type="button"
          onClick={clear}
          aria-label="Clear comparison"
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function PartsCard({ part }: { part: Part }) {
  return (
    <article className="group overflow-hidden border border-border bg-card">
      <Link to="/spare-parts/$slug" params={{ slug: part.slug }} className="block overflow-hidden">
        <img
          src={part.image}
          alt={part.name}
          width={1600}
          height={1000}
          loading="lazy"
          className="aspect-[16/10] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </Link>
      <div className="p-5">
        <span className="text-xs font-bold uppercase text-primary">{part.category}</span>
        <h3 className="mt-1 text-2xl font-bold uppercase">{part.name}</h3>
        <p className="mt-2 text-sm text-muted-foreground">Compatible: {part.compatible}</p>
        <div className="mt-4 flex items-center gap-2 text-sm">
          <Check className="h-4 w-4 text-primary" />
          {part.availability}
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button asChild variant="outline">
            <Link to="/spare-parts/$slug" params={{ slug: part.slug }}>
              View Product
            </Link>
          </Button>
          <Button asChild variant="automotive">
            <a href={whatsappUrl(`Hello AWA AUTO MALL, I would like to request the ${part.name}.`)}>
              Request Part
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}
export function PartsGrid({ items }: { items: Part[] }) {
  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      {items.map((p) => (
        <PartsCard key={p.slug} part={p} />
      ))}
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  copy,
  image,
}: {
  eyebrow: string;
  title: string;
  copy: string;
  image: string;
}) {
  return (
    <section className="relative min-h-[440px] overflow-hidden bg-navy">
      <img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40" />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/75 to-transparent" />
      <div className="container-shell relative flex min-h-[440px] items-end py-16">
        <div className="max-w-3xl">
          <span className="text-sm font-bold uppercase text-primary-foreground/70">{eyebrow}</span>
          <h1 className="mt-3 text-5xl font-extrabold uppercase leading-[0.92] text-primary-foreground sm:text-7xl">
            {title}
          </h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-primary-foreground/70">{copy}</p>
        </div>
      </div>
    </section>
  );
}
export function ArrowLink({
  to,
  label,
}: {
  to: "/cars" | "/spare-parts" | "/about" | "/contact";
  label: string;
}) {
  return (
    <Link
      to={to}
      className="inline-flex items-center gap-2 font-bold text-primary hover:text-destructive"
    >
      {label}
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}
