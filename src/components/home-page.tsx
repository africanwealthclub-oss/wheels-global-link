import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Car,
  CheckCircle2,
  Globe2,
  Headphones,
  PackageSearch,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { motion } from "motion/react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import hero from "@/assets/awa-hero.jpg";
import carsCategory from "@/assets/awa-cars-category.jpg";
import showroom from "@/assets/awa-showroom.jpg";
import globalImage from "@/assets/awa-global.jpg";
import { vehicles } from "@/lib/inventory";
import { localArticles } from "@/lib/news";
import { ContactStrip } from "./site-shell";
import { SectionHeading, VehicleGrid } from "./marketplace";
import { NewsGrid, type NewsArticle } from "./news";
import { API_BASE_URL, publicNews, publicVehicles, submitInquiry } from "@/lib/vehicle-platform";

const reveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.16 },
  transition: { duration: 0.55 },
};

export function HomePage() {
  const [catalog, setCatalog] = useState(vehicles);
  const [articles, setArticles] = useState<NewsArticle[]>(localArticles);

  useEffect(() => {
    let active = true;
    void Promise.allSettled([publicVehicles(), publicNews()]).then(
      ([vehicleResult, newsResult]) => {
        if (!active) return;
        if (vehicleResult.status === "fulfilled" && vehicleResult.value.length) {
          setCatalog(vehicleResult.value);
        }
        if (
          newsResult.status === "fulfilled" &&
          Array.isArray(newsResult.value) &&
          newsResult.value.length
        ) {
          setArticles(
            newsResult.value.map((article) => ({
              ...article,
              cover_image: article.cover_image ?? undefined,
            })),
          );
        }
      },
    );
    return () => {
      active = false;
    };
  }, []);

  return (
    <>
      <Hero />
      <SearchSection items={catalog} />
      <BrowseByCategory />
      <motion.section {...reveal} className="section-pad bg-secondary">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Vehicle inventory"
            title="Featured Vehicles"
            copy="Explore vehicles by brand, model, or type. Inventory shown is representative and subject to confirmation."
          />
          <VehicleGrid items={catalog.slice(0, 3)} />
          <div className="mt-10 text-center">
            <Button asChild size="lg">
              <Link to="/cars">
                View All Vehicles
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
      <MarketplacePreview items={catalog} />
      <NewsSection articles={articles} />
      <GlobalSection />
      <WhySection />
      <ProcessSection />
      <motion.section {...reveal} className="section-pad bg-background">
        <div className="container-shell grid items-center gap-10 lg:grid-cols-2">
          <img
            src={showroom}
            alt="Modern vehicle sourcing and inspection environment in Guangzhou"
            width={1600}
            height={1000}
            loading="lazy"
            className="min-h-[420px] w-full object-cover"
          />
          <div>
            <SectionHeading
              eyebrow="About AWA"
              title="Driven By Quality. Built For The Global Market."
              copy="AWA AUTO MALL specializes in the sale of cars globally. Based in Guangzhou, China, we provide customers with access to quality vehicles while focusing on professional service and dependable communication."
            />
            <Button asChild size="lg">
              <Link to="/about">
                Learn More About Us
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </motion.section>
      <InquirySection />
      <section className="section-pad bg-secondary">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Contact"
            title="Let’s Talk Automotive"
            copy="Connect with AWA AUTO MALL in Guangzhou for a vehicle inquiry."
          />
          <ContactStrip />
        </div>
      </section>
    </>
  );
}

function Hero() {
  return (
    <section className="relative min-h-[calc(100svh-5rem)] overflow-hidden bg-navy text-primary-foreground">
      <img
        src={hero}
        alt="Premium SUV in a modern city showroom"
        width={1920}
        height={1080}
        fetchPriority="high"
        className="absolute inset-0 h-full w-full object-cover object-[62%_center]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/70 to-transparent" />
      <div className="container-shell relative flex min-h-[calc(100svh-5rem)] items-center py-16">
        <div className="max-w-3xl">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mb-5 flex items-center gap-3 text-sm font-bold uppercase"
          >
            <span className="h-0.5 w-10 bg-destructive" />
            Guangzhou · Global Automotive Sourcing
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-5xl font-extrabold uppercase leading-[.9] sm:text-7xl lg:text-8xl"
          >
            Your Trusted Source for <span className="text-primary">Cars</span>
          </motion.h1>
          <p className="mt-6 max-w-xl text-base leading-7 text-primary-foreground/75 sm:text-lg">
            Quality vehicles, sourced in China and supplied globally.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link to="/cars">
                Browse Cars
                <ArrowRight />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

function SearchSection({ items }: { items: typeof vehicles }) {
  const [query, setQuery] = useState("");
  const shown = items.filter((vehicle) =>
    `${vehicle.brand} ${vehicle.model} ${vehicle.category ?? ""}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  );

  return (
    <section className="section-pad bg-secondary">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Live vehicle search"
          title="Search By Brand, Model Or Type"
          copy="Search the current representative inventory without leaving this page."
        />
        <div className="relative max-w-2xl">
          <Search className="absolute left-4 top-3 h-5 w-5 text-primary" />
          <Input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try Toyota, Lexus, SUV or Truck..."
            className="h-12 pl-12"
          />
        </div>
        {query && (
          <div className="mt-6">
            {shown.length ? (
              <VehicleGrid items={shown} />
            ) : (
              <p className="border border-border bg-background p-6 text-muted-foreground">
                No matching vehicle in the current gallery. We can source it for you.
              </p>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

const categoryTiles = [
  {
    image: carsCategory,
    title: "By Brand",
    route: "brand",
    copy: "Toyota, Lexus, Mercedes-Benz, BMW, Range Rover, Hyundai and more.",
    chips: ["Toyota", "Lexus", "Mercedes-Benz"],
    search: (value: string) => ({ q: "", brand: value, carType: "All", condition: "All" }),
    seeAll: { q: "", brand: "All", carType: "All", condition: "All" },
  },
  {
    image: showroom,
    title: "By Model",
    route: "model",
    copy: "Land Cruiser, RX 350, E-Class, 5 Series, Sport and Santa Fe.",
    chips: ["Land Cruiser", "RX 350", "Santa Fe"],
    search: (value: string) => ({ q: value, brand: "All", carType: "All", condition: "All" }),
    seeAll: { q: "", brand: "All", carType: "All", condition: "All" },
  },
  {
    image: globalImage,
    title: "By Car Type",
    route: "type",
    copy: "SUVs, sedans and trucks matched to how you'll actually use the vehicle.",
    chips: ["SUV", "Sedan", "Truck"],
    search: (value: string) => ({ q: "", brand: "All", carType: value, condition: "All" }),
    seeAll: { q: "", brand: "All", carType: "All", condition: "All" },
  },
] as const;

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function BrowseByCategory() {
  return (
    <motion.section {...reveal} className="section-pad bg-background">
      <div className="container-shell">
        <SectionHeading
          eyebrow="Browse by category"
          title="What Are You Looking For?"
          copy="Start your search the way that makes sense to you — by brand, by model, or by the type of vehicle you need."
        />
        <div className="grid gap-5 lg:grid-cols-3">
          {categoryTiles.map((tile) => (
            <article
              key={tile.title}
              className="group relative min-h-[430px] overflow-hidden bg-navy"
            >
              <img
                src={tile.image}
                alt={`${tile.title} available through AWA AUTO MALL`}
                width={1600}
                height={1000}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-surface-dark/20 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-7 text-primary-foreground sm:p-9">
                <h3 className="text-3xl font-extrabold uppercase">{tile.title}</h3>
                <p className="mt-2 max-w-md text-sm leading-6 text-primary-foreground/70">
                  {tile.copy}
                </p>
                <div className="mt-5 flex flex-wrap gap-2">
                  {tile.chips.map((chip) =>
                    tile.route === "brand" ? (
                      <Link
                        key={chip}
                        to="/cars/brands/$brand"
                        params={{ brand: slugify(chip) }}
                        className="border border-primary-foreground/40 px-3 py-1.5 text-xs font-bold uppercase transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {chip}
                      </Link>
                    ) : (
                      <Link
                        key={chip}
                        to={tile.route === "model" ? "/cars/models" : "/cars/types"}
                        className="border border-primary-foreground/40 px-3 py-1.5 text-xs font-bold uppercase transition-colors hover:border-primary hover:bg-primary hover:text-primary-foreground"
                      >
                        {chip}
                      </Link>
                    ),
                  )}
                </div>
                <Button asChild variant="inverse" className="mt-6">
                  <Link
                    to={
                      tile.route === "brand"
                        ? "/cars/brands"
                        : tile.route === "model"
                          ? "/cars/models"
                          : "/cars/types"
                    }
                  >
                    See All {tile.title.replace("By ", "")}s
                    <ArrowRight />
                  </Link>
                </Button>
              </div>
            </article>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function MarketplacePreview({ items }: { items: typeof vehicles }) {
  const models = [...new Set(items.map((vehicle) => vehicle.model))].slice(0, 4);

  return (
    <motion.section {...reveal} className="section-pad bg-navy text-primary-foreground">
      <div className="container-shell grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
        <div>
          <p className="mb-4 flex items-center gap-3 text-xs font-bold uppercase text-primary-foreground/65">
            <span className="h-0.5 w-10 bg-destructive" />
            The AWA marketplace
          </p>
          <h2 className="text-4xl font-extrabold uppercase leading-none sm:text-6xl">
            Make Your Search More Specific
          </h2>
          <p className="mt-5 max-w-xl leading-7 text-primary-foreground/70">
            Start broad with a vehicle type, get specific with a model, then compare the options
            that fit your brief.
          </p>
        </div>
        <div className="grid border-l border-t border-primary-foreground/15 sm:grid-cols-2">
          <Link
            to="/cars/types"
            className="group border-b border-r border-primary-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span className="text-xs font-bold uppercase text-primary-foreground/55 group-hover:text-primary-foreground/70">
              Vehicle type
            </span>
            <h3 className="mt-8 text-2xl font-bold uppercase">Shop SUVs</h3>
            <p className="mt-2 text-sm text-primary-foreground/65 group-hover:text-primary-foreground/80">
              Versatile vehicles for family and everyday use.
            </p>
            <ArrowRight className="mt-6 h-5 w-5" />
          </Link>
          <Link
            to="/cars/types"
            className="group border-b border-r border-primary-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
          >
            <span className="text-xs font-bold uppercase text-primary-foreground/55 group-hover:text-primary-foreground/70">
              Vehicle type
            </span>
            <h3 className="mt-8 text-2xl font-bold uppercase">Shop Trucks</h3>
            <p className="mt-2 text-sm text-primary-foreground/65 group-hover:text-primary-foreground/80">
              Commercial options for work and logistics.
            </p>
            <ArrowRight className="mt-6 h-5 w-5" />
          </Link>
          {models.slice(0, 2).map((model) => (
            <Link
              key={model}
              to="/cars/models"
              className="group border-b border-r border-primary-foreground/15 p-6 transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <span className="text-xs font-bold uppercase text-primary-foreground/55 group-hover:text-primary-foreground/70">
                Popular model
              </span>
              <h3 className="mt-8 text-2xl font-bold uppercase">{model}</h3>
              <p className="mt-2 text-sm text-primary-foreground/65 group-hover:text-primary-foreground/80">
                See available listings and specifications.
              </p>
              <ArrowRight className="mt-6 h-5 w-5" />
            </Link>
          ))}
        </div>
      </div>
    </motion.section>
  );
}

function NewsSection({ articles }: { articles: NewsArticle[] }) {
  return (
    <motion.section {...reveal} className="section-pad bg-secondary">
      <div className="container-shell">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHeading
            eyebrow="AWA updates"
            title="News From The Road"
            copy="Sourcing guidance, inspection notes, and practical export updates from our Guangzhou team."
          />
          <Button asChild variant="outline" className="shrink-0">
            <Link to="/news">
              View All News <ArrowRight />
            </Link>
          </Button>
        </div>
        <div className="mt-10">
          <NewsGrid articles={articles.slice(0, 3)} />
        </div>
      </div>
    </motion.section>
  );
}

function GlobalSection() {
  return (
    <motion.section {...reveal} className="relative min-h-[620px] overflow-hidden bg-navy">
      <img
        src={globalImage}
        alt="Vehicles prepared for international automotive logistics"
        width={1600}
        height={1000}
        loading="lazy"
        className="absolute inset-0 h-full w-full object-cover opacity-55"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-surface-dark via-surface-dark/80 to-transparent" />
      <div className="container-shell relative flex min-h-[620px] items-center">
        <div className="max-w-2xl">
          <Globe2 className="mb-6 h-10 w-10 text-destructive" />
          <SectionHeading
            eyebrow="Global automotive sourcing"
            title="Automotive Solutions Without Borders"
            copy="From our base in Guangzhou, China, AWA AUTO MALL connects customers with quality vehicles for markets around the world."
            inverse
          />
          <div className="flex items-center gap-4 border-l-2 border-destructive pl-5 text-sm text-primary-foreground/70">
            <strong className="text-primary-foreground">Guangzhou, China</strong>
            <ArrowRight />
            International markets
          </div>
        </div>
      </div>
    </motion.section>
  );
}

const reasons = [
  [
    ShieldCheck,
    "Quality Selection",
    "Vehicles are sourced around clearly defined customer requirements.",
  ],
  [Globe2, "Global Sourcing", "Internationally focused support from our base in Guangzhou, China."],
  [Wrench, "Automotive Expertise", "Practical knowledge across vehicle sourcing and inspection."],
  [
    CheckCircle2,
    "Reliable Service",
    "Clear updates and dependable communication throughout your inquiry.",
  ],
  [Car, "Quality Cars", "One trusted contact for vehicle requirements."],
  [Headphones, "Customer-Focused Support", "Professional assistance shaped around what you need."],
];
export function WhySection() {
  return (
    <section className="section-pad bg-background">
      <div className="container-shell">
        <SectionHeading eyebrow="Why AWA" title="Why Choose AWA AUTO MALL?" />
        <div className="grid border-l border-t border-border md:grid-cols-2 lg:grid-cols-3">
          {reasons.map(([Icon, title, copy], i) => (
            <article
              key={String(title)}
              className="group border-b border-r border-border p-7 transition-colors hover:border-primary hover:bg-accent"
            >
              <span className="text-sm font-bold text-destructive group-hover:text-primary">
                0{i + 1}
              </span>
              <Icon className="mt-8 h-8 w-8 text-primary transition-colors group-hover:text-destructive" />
              <h3 className="mt-5 text-2xl font-bold uppercase transition-colors group-hover:text-primary">
                {String(title)}
              </h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{String(copy)}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

const steps = [
  ["Tell Us What You Need", "Send us your vehicle requirements."],
  ["We Source It", "Our team searches for the appropriate vehicle."],
  ["Review & Confirm", "Receive vehicle information, images and available details."],
  ["Complete Your Purchase", "Proceed with the agreed purchasing and delivery arrangements."],
];
function ProcessSection() {
  return (
    <section className="section-pad bg-secondary">
      <div className="container-shell">
        <SectionHeading eyebrow="Simple process" title="How It Works" />
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          {steps.map(([title, copy], i) => (
            <article key={title} className="border-t-2 border-primary pt-6">
              <span className="text-5xl font-extrabold text-border">0{i + 1}</span>
              <h3 className="mt-5 text-xl font-bold uppercase">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function InquirySection() {
  const [error, setError] = useState("");
  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const name = String(fd.get("name") || "").trim();
    const phone = String(fd.get("phone") || "").trim();
    const details = String(fd.get("details") || "").trim();
    if (!name || !phone || !details) {
      setError("Please complete your name, phone number, and vehicle details.");
      return;
    }
    if (!API_BASE_URL) {
      setError("The inquiry service is not configured yet. Please try again later.");
      return;
    }
    try {
      await submitInquiry({
        customer_name: name,
        email: String(fd.get("email") || "").trim() || null,
        phone,
        type: "vehicle_quote",
        request_text: `${details}${fd.get("model") ? `; preferred make/model: ${String(fd.get("model"))}` : ""}${fd.get("message") ? `; message: ${String(fd.get("message"))}` : ""}`,
        source: "homepage-inquiry",
      });
      form.reset();
      setError("Your inquiry has been sent to the AWA team. We will contact you shortly.");
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "We could not send your inquiry. Please try again.",
      );
    }
  }
  return (
    <section className="section-pad bg-navy text-primary-foreground" id="inquiry">
      <div className="container-shell grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
        <div>
          <PackageSearch className="mb-7 h-10 w-10 text-destructive" />
          <SectionHeading
            eyebrow="Direct inquiry"
            title="Looking For A Specific Vehicle?"
            copy="Tell us what you need and our team will help you with the available options."
            inverse
          />
          <p className="flex items-center gap-2 font-bold">
            <span className="grid h-10 w-10 place-items-center rounded-full bg-primary">
              <Headphones className="h-5 w-5" />
            </span>
            Send your brief and our team will follow up directly.
          </p>
        </div>
        <form
          onSubmit={submit}
          className="grid gap-4 bg-background p-6 text-foreground sm:grid-cols-2 sm:p-8"
        >
          <Field label="Full Name *">
            <Input name="name" maxLength={100} required />
          </Field>
          <Field label="Phone Number *">
            <Input name="phone" type="tel" maxLength={30} required />
          </Field>
          <Field label="Email">
            <Input name="email" type="email" maxLength={255} />
          </Field>
          <Field label="What Are You Looking For?">
            <select
              name="type"
              className="h-10 w-full border border-input bg-background px-3 text-sm"
            >
              <option>Vehicle</option>
            </select>
          </Field>
          <Field label="Vehicle Details *" wide>
            <Input name="details" maxLength={200} required />
          </Field>
          <Field label="Preferred Make or Model">
            <Input name="model" maxLength={100} />
          </Field>
          <Field label="Message" wide>
            <Textarea name="message" maxLength={1000} className="min-h-28" />
          </Field>
          {error && (
            <p role="alert" className="text-sm font-semibold text-destructive sm:col-span-2">
              {error}
            </p>
          )}
          <Button type="submit" variant="automotive" size="lg" className="sm:col-span-2">
            Send Inquiry
            <ArrowRight />
          </Button>
        </form>
      </div>
    </section>
  );
}
function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={wide ? "sm:col-span-2" : ""}>
      <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">{label}</span>
      {children}
    </label>
  );
}
