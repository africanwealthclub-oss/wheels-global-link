import { createFileRoute } from "@tanstack/react-router";
import { ContactStrip } from "@/components/site-shell";
import { InquirySection } from "@/components/home-page";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import image from "@/assets/awa-global.jpg";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact AWA AUTO MALL" },
      {
        name: "description",
        content: "Contact AWA AUTO MALL in Guangzhou, China about sourcing your next vehicle.",
      },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  return (
    <>
      <PageIntro
        eyebrow="Contact AWA AUTO MALL"
        title="Let's Talk About Your Next Vehicle"
        copy="Reach our team in Guangzhou for sourcing questions, vehicle requirements, and purchase guidance."
        image={image}
      />
      <section className="section-pad bg-background">
        <div className="container-shell">
          <SectionHeading eyebrow="Reach us directly" title="Choose The Way That Works For You" />
          <ContactStrip />
        </div>
      </section>
      <InquirySection />
      <section className="section-pad bg-background">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Before you reach out"
            title="Bring A Useful Brief"
            copy="The more context you share, the more precisely we can search."
          />
          <div className="grid gap-4 md:grid-cols-4">
            <div className="border border-border p-5">
              <strong className="text-primary">01</strong>
              <p className="mt-3 text-sm font-bold uppercase">Make or model</p>
            </div>
            <div className="border border-border p-5">
              <strong className="text-primary">02</strong>
              <p className="mt-3 text-sm font-bold uppercase">Budget range</p>
            </div>
            <div className="border border-border p-5">
              <strong className="text-primary">03</strong>
              <p className="mt-3 text-sm font-bold uppercase">Destination</p>
            </div>
            <div className="border border-border p-5">
              <strong className="text-primary">04</strong>
              <p className="mt-3 text-sm font-bold uppercase">Timing</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-navy text-primary-foreground">
        <div className="container-shell grid gap-8 md:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="What happens next"
              title="A Direct Reply From Our Team"
              copy="We review your request, confirm what we need to know, and respond with the clearest available options."
              inverse
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="border-l-2 border-primary p-4">
              <strong>Review</strong>
              <p className="mt-2 text-sm text-primary-foreground/65">
                Your requirements are read by the sourcing team.
              </p>
            </div>
            <div className="border-l-2 border-primary p-4">
              <strong>Respond</strong>
              <p className="mt-2 text-sm text-primary-foreground/65">
                We come back with practical next steps.
              </p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad bg-secondary">
        <div className="container-shell">
          <SectionHeading
            eyebrow="Find us"
            title="Guangzhou, China"
            copy="Our sourcing work is based in Guangzhou, one of the world's major automotive and trading centers."
          />
          <iframe
            title="AWA AUTO MALL location in Guangzhou"
            src="https://www.google.com/maps?q=Guangzhou%2C%20China&output=embed"
            className="h-[420px] w-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </section>
    </>
  );
}
