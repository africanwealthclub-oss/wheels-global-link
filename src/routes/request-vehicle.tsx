import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { API_BASE_URL, checkApiReady, submitInquiry } from "@/lib/vehicle-platform";
import { whatsappUrl } from "@/components/site-shell";
import image from "@/assets/awa-global.jpg";
export const Route = createFileRoute("/request-vehicle")({
  head: () => ({ meta: [{ title: "Request a Vehicle | AWA AUTO MALL" }] }),
  component: RequestVehiclePage,
});
function RequestVehiclePage() {
  const [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending your vehicle brief...");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      const apiReady = await checkApiReady();
      if (API_BASE_URL && apiReady) {
        await submitInquiry({
          ...payload,
          customer_name: payload.name,
          source: "vehicle-request",
          type: "vehicle_request",
          request_text: `${payload.brand || "Vehicle"} ${payload.model || "sourcing request"}; year: ${payload.year || "any"}; condition: ${payload.condition || "any"}; budget: ${payload.budget || "not specified"}; destination: ${payload.market || "not specified"}; quantity: ${payload.quantity || "1"}; requirements: ${payload.requirements || "none"}`,
        });
        setStatus("Your request has been sent. Our team will review it and contact you shortly.");
      } else {
        setStatus(
          "The request service is unavailable. Please continue on WhatsApp so our team can help.",
        );
      }
      (event.target as HTMLFormElement).reset();
    } catch {
      setStatus("We could not reach the request service. Please continue on WhatsApp.");
    }
  }
  return (
    <>
      <PageIntro
        eyebrow="Vehicle sourcing"
        title="Can't Find Your Dream Car?"
        copy="Send us the exact brief and AWA will search its trusted markets for a suitable match."
        image={image}
      />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <SectionHeading
              eyebrow="A structured brief"
              title="Tell Us What To Source"
              copy="The more detail you share, the more accurately our team can search and quote."
            />
            <div className="grid gap-4">
              {[
                "Search beyond the published inventory",
                "Receive vehicle details and inspection information",
                "Discuss shipping options for your destination",
              ].map((item) => (
                <p key={item} className="flex gap-3 text-sm font-semibold">
                  <CheckCircle2 className="shrink-0 text-primary" />
                  {item}
                </p>
              ))}
            </div>
          </div>
          <form
            onSubmit={submit}
            className="grid gap-4 border border-border bg-secondary p-6 sm:grid-cols-2 sm:p-8"
          >
            <Field label="Full name">
              <Input name="name" required />
            </Field>
            <Field label="Phone / WhatsApp">
              <Input name="phone" type="tel" required />
            </Field>
            <Field label="Email">
              <Input name="email" type="email" required />
            </Field>
            <Field label="Preferred market">
              <Input name="market" placeholder="Ghana, Nigeria, UAE..." />
            </Field>
            <Field label="Preferred make">
              <Input name="brand" placeholder="Toyota" />
            </Field>
            <Field label="Model">
              <Input name="model" placeholder="Land Cruiser" />
            </Field>
            <Field label="Year">
              <Input name="year" type="number" min="1990" max="2030" />
            </Field>
            <Field label="Budget">
              <Input name="budget" placeholder="USD 30,000" />
            </Field>
            <Field label="Condition">
              <select
                name="condition"
                className="h-10 w-full border border-input bg-background px-3 text-sm"
              >
                <option>New</option>
                <option>Pre-owned</option>
                <option>Either</option>
              </select>
            </Field>
            <Field label="Quantity">
              <Input name="quantity" type="number" min="1" defaultValue="1" />
            </Field>
            <Field label="Additional requirements" wide>
              <Textarea
                name="requirements"
                className="min-h-28"
                placeholder="Mileage, fuel, transmission, colour, delivery timing..."
              />
            </Field>
            {status && (
              <p role="status" className="text-sm font-semibold text-primary sm:col-span-2">
                {status}
              </p>
            )}
            <div className="flex flex-wrap gap-3 sm:col-span-2">
              <Button type="submit" size="lg" variant="automotive">
                Submit sourcing request <ArrowRight />
              </Button>
              <Button asChild type="button" variant="outline" size="lg">
                <a href={whatsappUrl("I would like help sourcing a vehicle.")}>
                  Continue on WhatsApp
                </a>
              </Button>
            </div>
          </form>
        </div>
      </section>
    </>
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
