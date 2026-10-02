import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { PageIntro, PartsGrid, SectionHeading } from "@/components/marketplace";
import { Input } from "@/components/ui/input";
import { partCategories, parts } from "@/lib/inventory";
import image from "@/assets/awa-parts-category.jpg";

export const Route = createFileRoute("/spare-parts")({
  head: () => ({
    meta: [
      { title: "Automotive Spare Parts | AWA AUTO MALL" },
      {
        name: "description",
        content:
          "Request engine, brake, suspension, electrical, body and transmission parts sourced from Guangzhou, China.",
      },
      { property: "og:title", content: "Automotive Spare Parts | AWA AUTO MALL" },
      {
        property: "og:description",
        content: "Quality automotive parts sourced for customers and businesses worldwide.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "/spare-parts" }],
  }),
  component: PartsPage,
});
function PartsPage() {
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () =>
      parts.filter((p) =>
        `${p.name} ${p.category} ${p.compatible}`.toLowerCase().includes(query.toLowerCase()),
      ),
    [query],
  );
  return (
    <>
      <PageIntro
        eyebrow="Parts sourcing"
        title="Automotive Spare Parts"
        copy="Tell us the vehicle, model, year or part number and we will help source a compatible product."
        image={image}
      />
      <section className="section-pad">
        <div className="container-shell">
          <SectionHeading eyebrow="Product categories" title="Parts For Every System" />
          <div className="mb-12 grid grid-cols-2 border-l border-t border-border sm:grid-cols-3 lg:grid-cols-5">
            {partCategories.map((x, i) => (
              <div key={x} className="border-b border-r border-border p-5">
                <span className="text-xs font-bold text-destructive">0{i + 1}</span>
                <h2 className="mt-4 font-display text-xl font-bold uppercase">{x}</h2>
              </div>
            ))}
          </div>
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search parts or compatibility"
            className="mb-8 max-w-xl"
          />
          <PartsGrid items={shown} />
        </div>
      </section>
    </>
  );
}
