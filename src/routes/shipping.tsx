import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Clock3, Globe2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import image from "@/assets/awa-global.jpg";

export const Route = createFileRoute("/shipping")({
  head: () => ({
    meta: [
      { title: "Vehicle Shipping & Export | AWA AUTO MALL" },
      {
        name: "description",
        content:
          "Understand how AWA AUTO MALL coordinates vehicle sourcing and export from Guangzhou.",
      },
    ],
  }),
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <>
      <PageIntro
        eyebrow="Shipping & export"
        title="From Guangzhou To Your Market"
        copy="We help customers understand the sourcing, confirmation, and delivery steps involved in bringing a vehicle across borders."
        image={image}
      />
      <section className="section-pad bg-background">
        <div className="container-shell">
          <SectionHeading eyebrow="The journey" title="What Happens After You Inquire?" />
          <div className="grid border-l border-t border-border md:grid-cols-3">
            <Info
              icon={Globe2}
              title="Source"
              copy="We review available vehicles in Guangzhou against your make, model, year, and specification."
            />
            <Info
              icon={CheckCircle2}
              title="Confirm"
              copy="Vehicle details, condition, pricing, and availability are checked with you before purchase arrangements begin."
            />
            <Info
              icon={Clock3}
              title="Deliver"
              copy="Export and delivery timing depends on destination, documentation, vessel schedules, and the confirmed vehicle."
            />
          </div>
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="container-shell grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Timing"
              title="Set Expectations Early"
              copy="There is no single delivery timeline for every destination. We share the practical next steps once the vehicle and destination are known."
            />
            <ul className="grid gap-4 text-sm leading-6 text-muted-foreground">
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                Vehicle availability and inspection are confirmed first.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                Export documentation and destination requirements are reviewed.
              </li>
              <li className="flex gap-3">
                <CheckCircle2 className="mt-1 h-4 w-4 shrink-0 text-primary" />
                Shipping arrangements are coordinated after the purchase plan is agreed.
              </li>
            </ul>
          </div>
          <div className="border-l-2 border-primary bg-background p-7">
            <p className="text-xs font-bold uppercase text-primary">Available to source</p>
            <h2 className="mt-4 text-3xl font-bold uppercase">A Starting Point, Not A Guarantee</h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              This status means we can search for a suitable vehicle. Final availability,
              specification, condition, price, and delivery details are confirmed during inquiry.
            </p>
          </div>
        </div>
      </section>
      <section className="section-pad bg-navy text-primary-foreground">
        <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Need a quote?"
            title="Tell Us Your Destination"
            copy="Share the vehicle you want and where it needs to go."
            inverse
          />
          <Button asChild size="lg" variant="inverse">
            <Link to="/contact">
              Start An Inquiry
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function Info({ icon: Icon, title, copy }: { icon: typeof Globe2; title: string; copy: string }) {
  return (
    <article className="border-b border-r border-border p-7">
      <Icon className="h-8 w-8 text-primary" />
      <h2 className="mt-6 text-2xl font-bold uppercase">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
    </article>
  );
}
