import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { parts } from "@/lib/inventory";
export const Route = createFileRoute("/spare-parts/$slug")({
  loader: ({ params }) => {
    const part = parts.find((p) => p.slug === params.slug);
    if (!part) throw notFound();
    return part;
  },
  head: ({ loaderData: p }) => {
    const title = p ? `${p.name} | AWA AUTO MALL` : `Part Not Found | AWA AUTO MALL`;
    const description = p
      ? `Request ${p.name} and compatible automotive parts through AWA AUTO MALL.`
      : "The requested automotive part is unavailable.";
    return {
      meta: [
        { title },
        { name: "description", content: description },
        { property: "og:title", content: title },
        { property: "og:description", content: description },
        { property: "og:type", content: "product" },
        { name: "twitter:card", content: "summary_large_image" },
      ],
      links: p ? [{ rel: "canonical", href: `/spare-parts/${p.slug}` }] : [],
    };
  },
  component: PartDetail,
});
function PartDetail() {
  const p = Route.useLoaderData();
  return (
    <section className="section-pad">
      <div className="container-shell">
        <Link to="/spare-parts" className="mb-8 inline-flex items-center gap-2 text-sm">
          <ArrowLeft />
          Back to spare parts
        </Link>
        <div className="grid gap-10 lg:grid-cols-2">
          <img
            src={p.image}
            alt={p.name}
            width={1600}
            height={1000}
            className="aspect-[16/10] w-full object-cover"
          />
          <div>
            <span className="text-sm font-bold uppercase text-primary">{p.category}</span>
            <h1 className="mt-3 text-5xl font-extrabold uppercase leading-none">{p.name}</h1>
            <p className="mt-6 leading-7 text-muted-foreground">{p.description}</p>
            <dl className="mt-7 border-y border-border py-5 text-sm">
              <div className="flex justify-between gap-5">
                <dt>Compatibility</dt>
                <dd className="font-bold">{p.compatible}</dd>
              </div>
              <div className="mt-3 flex justify-between gap-5">
                <dt>Availability</dt>
                <dd className="flex items-center gap-2 font-bold">
                  <CheckCircle2 className="h-4 w-4 text-primary" />
                  {p.availability}
                </dd>
              </div>
              <div className="mt-3 flex justify-between gap-5">
                <dt>Price</dt>
                <dd className="font-bold">{p.price}</dd>
              </div>
            </dl>
            <Button asChild variant="automotive" size="lg" className="mt-7 w-full">
              <Link to="/request-vehicle">Request Part</Link>
            </Button>
            <p className="mt-4 text-xs text-muted-foreground">
              Provide your vehicle identification details or part number when available so
              compatibility can be confirmed.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
