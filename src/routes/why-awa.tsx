import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, Globe2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { WhySection } from "@/components/home-page";
import image from "@/assets/awa-cars-category.jpg";

export const Route = createFileRoute("/why-awa")({
  head: () => ({
    meta: [
      { title: "Why Choose AWA AUTO MALL" },
      {
        name: "description",
        content:
          "See what makes AWA AUTO MALL a dependable vehicle sourcing partner in Guangzhou, China.",
      },
    ],
  }),
  component: WhyAwaPage,
});

function WhyAwaPage() {
  return (
    <>
      <PageIntro
        eyebrow="Why AWA"
        title="A Better Way To Source Your Next Car"
        copy="Professional guidance, clear updates, and a global sourcing perspective from Guangzhou, China."
        image={image}
      />
      <WhySection />
      <section className="section-pad bg-secondary">
        <div className="container-shell">
          <SectionHeading eyebrow="Our difference" title="Built Around Confidence" />
          <div className="grid gap-6 md:grid-cols-3">
            <div className="border-t-2 border-primary pt-5">
              <ShieldCheck className="text-primary" />
              <h2 className="mt-4 text-2xl font-bold uppercase">Thoughtful selection</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                We match vehicle options to real requirements, including intended use and
                destination.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-5">
              <Globe2 className="text-primary" />
              <h2 className="mt-4 text-2xl font-bold uppercase">International view</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                Our sourcing perspective is shaped by customers and markets beyond Guangzhou.
              </p>
            </div>
            <div className="border-t-2 border-primary pt-5">
              <CheckCircle2 className="text-primary" />
              <h2 className="mt-4 text-2xl font-bold uppercase">Clear next steps</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                You always know what information is available and what happens next.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-background">
        <div className="container-shell grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="For every brief"
              title="Personal, Family, Business"
              copy="Whether you are replacing a daily driver, planning a family purchase, or sourcing for a business, the process begins with the same attention to detail."
            />
          </div>
          <div className="border-l-2 border-destructive pl-6">
            <p className="text-2xl font-bold uppercase">
              The right question is often more valuable than the biggest inventory.
            </p>
            <p className="mt-4 leading-7 text-muted-foreground">
              Tell us what matters most and we will help narrow the path.
            </p>
          </div>
        </div>
      </section>
      <section className="section-pad bg-navy text-primary-foreground">
        <div className="container-shell">
          <SectionHeading
            eyebrow="A better conversation"
            title="Less Guesswork. More Direction."
            copy="AWA keeps vehicle sourcing direct, understandable, and focused on the decision in front of you."
            inverse
          />
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="container-shell flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-bold uppercase text-primary">Ready when you are</p>
            <h2 className="mt-3 text-4xl font-extrabold uppercase leading-none">
              Bring Us Your Vehicle Brief
            </h2>
          </div>
          <Button asChild size="lg">
            <Link to="/contact">
              Talk To Our Team
              <ArrowRight />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
