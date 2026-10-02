import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Globe2, Search, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import guangzhou from "@/assets/awa-global.jpg";
import showroom from "@/assets/awa-showroom.jpg";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About AWA AUTO MALL" },
      {
        name: "description",
        content:
          "Learn how AWA AUTO MALL sources quality vehicles from Guangzhou, China for customers worldwide.",
      },
    ],
  }),
  component: AboutPage,
});

function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About AWA AUTO MALL"
        title="Built In Guangzhou. Connected To The World."
        copy="AWA AUTO MALL helps customers source quality vehicles from Guangzhou, China with clear communication and dependable support."
        image={guangzhou}
      />
      <section className="section-pad bg-background">
        <div className="container-shell grid gap-10 lg:grid-cols-[1.1fr_.9fr] lg:items-center">
          <div>
            <SectionHeading
              eyebrow="Our story"
              title="A Direct Line To Better Vehicles"
              copy="Our work is grounded in practical sourcing: understanding what a customer needs, checking the available options, and communicating the details clearly before a purchase decision."
            />
            <p className="max-w-2xl leading-7 text-muted-foreground">
              From individual buyers to business requirements, we coordinate the search from our
              base in Guangzhou and help customers move from a vehicle brief to a confirmed sourcing
              plan.
            </p>
          </div>
          <img
            src={showroom}
            alt="Vehicle sourcing and inspection environment in Guangzhou"
            width={1600}
            height={1000}
            className="min-h-[360px] w-full object-cover"
          />
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="container-shell">
          <SectionHeading eyebrow="How we work" title="A Clear Sourcing Process" />
          <div className="grid border-l border-t border-border md:grid-cols-3">
            <ProcessStep
              icon={Search}
              title="Understand"
              copy="We start with your preferred make, model, year, budget, and intended use."
            />
            <ProcessStep
              icon={ShieldCheck}
              title="Source"
              copy="We search the Guangzhou market and review suitable vehicle options against your requirements."
            />
            <ProcessStep
              icon={CheckCircle2}
              title="Confirm"
              copy="You receive the available details and next steps before moving forward."
            />
          </div>
        </div>
      </section>
      <section className="section-pad bg-background">
        <div className="container-shell">
          <SectionHeading eyebrow="Our standard" title="Clarity At Every Handoff" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-t-2 border-primary pt-5">
              <h2 className="text-2xl font-bold uppercase">Listen first</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Every search starts with the customer brief, not a generic list of stock.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-5">
              <h2 className="text-2xl font-bold uppercase">Show the detail</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We make the important vehicle information easy to review before a commitment.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-5">
              <h2 className="text-2xl font-bold uppercase">Stay available</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Clear updates keep the sourcing conversation moving across time zones.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="container-shell grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Our base"
              title="Guangzhou Gives Us Reach"
              copy="Our location places the team close to a major automotive and trading center, helping us respond to a wide range of vehicle briefs."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-background p-5">
              <strong className="text-3xl text-primary">01</strong>
              <p className="mt-3 text-sm font-bold uppercase">Market access</p>
            </div>
            <div className="bg-background p-5">
              <strong className="text-3xl text-primary">02</strong>
              <p className="mt-3 text-sm font-bold uppercase">Global perspective</p>
            </div>
            <div className="bg-background p-5">
              <strong className="text-3xl text-primary">03</strong>
              <p className="mt-3 text-sm font-bold uppercase">Practical guidance</p>
            </div>
            <div className="bg-background p-5">
              <strong className="text-3xl text-primary">04</strong>
              <p className="mt-3 text-sm font-bold uppercase">Dependable contact</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-navy text-primary-foreground">
        <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <SectionHeading
              eyebrow="Start a conversation"
              title="Tell Us What You Need"
              copy="Our team can help turn a vehicle requirement into a practical sourcing plan."
              inverse
            />
          </div>
          <Button asChild size="lg" variant="inverse">
            <Link to="/contact">
              Contact AWA
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

function ProcessStep({
  icon: Icon,
  title,
  copy,
}: {
  icon: typeof Search;
  title: string;
  copy: string;
}) {
  return (
    <article className="border-b border-r border-border p-7">
      <Icon className="h-8 w-8 text-primary" />
      <h2 className="mt-6 text-2xl font-bold uppercase">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-muted-foreground">{copy}</p>
    </article>
  );
}
