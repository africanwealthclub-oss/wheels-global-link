import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowRight, Heart, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { vehicles } from "@/lib/inventory";
import { getFavoriteSlugs, setFavoriteSlugs } from "@/lib/vehicle-platform";
import image from "@/assets/awa-cars-category.jpg";
export const Route = createFileRoute("/favorites")({
  head: () => ({ meta: [{ title: "Saved Vehicles | AWA AUTO MALL" }] }),
  component: FavoritesPage,
});
function FavoritesPage() {
  const [slugs, setSlugs] = useState<string[]>([]);
  useEffect(() => setSlugs(getFavoriteSlugs()), []);
  const saved = vehicles.filter((vehicle) => slugs.includes(vehicle.slug));
  function remove(slug: string) {
    const next = slugs.filter((item) => item !== slug);
    setSlugs(next);
    setFavoriteSlugs(next);
  }
  return (
    <>
      <PageIntro
        eyebrow="Your shortlist"
        title="Saved Vehicles"
        copy="Keep the vehicles you are considering in one place before requesting a quote."
        image={image}
      />
      <section className="section-pad">
        <div className="container-shell">
          {saved.length === 0 ? (
            <div className="border border-border bg-secondary p-10 text-center">
              <Heart className="mx-auto h-10 w-10 text-primary" />
              <SectionHeading
                eyebrow="Nothing saved yet"
                title="Build Your Shortlist"
                copy="Use Save Vehicle on any listing to keep it here for comparison and inquiry."
              />
              <Button asChild size="lg">
                <Link to="/cars">
                  Browse vehicles <ArrowRight />
                </Link>
              </Button>
            </div>
          ) : (
            <>
              <div className="mb-8 flex items-end justify-between">
                <SectionHeading
                  eyebrow={`${saved.length} saved vehicle${saved.length === 1 ? "" : "s"}`}
                  title="Your Shortlist"
                />
                <Button asChild variant="outline">
                  <Link to="/compare">
                    Compare selected <ArrowRight />
                  </Link>
                </Button>
              </div>
              <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {saved.map((vehicle) => (
                  <article key={vehicle.slug} className="border border-border bg-card">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="aspect-[16/10] w-full object-cover"
                    />
                    <div className="p-5">
                      <p className="text-xs font-bold uppercase text-primary">
                        {vehicle.year} · {vehicle.condition}
                      </p>
                      <h2 className="mt-2 text-2xl font-extrabold uppercase">
                        {vehicle.brand} {vehicle.model}
                      </h2>
                      <p className="mt-2 text-sm text-muted-foreground">
                        {vehicle.price} · {vehicle.mileage}
                      </p>
                      <div className="mt-5 flex flex-wrap gap-2">
                        <Button asChild>
                          <Link to="/cars/$slug" params={{ slug: vehicle.slug }}>
                            View details
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => remove(vehicle.slug)}
                          aria-label={`Remove ${vehicle.model}`}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        <Button asChild variant="automotive" size="icon" aria-label="Request quote">
                          <Link to="/request-vehicle">
                            <MessageCircle className="h-4 w-4" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
