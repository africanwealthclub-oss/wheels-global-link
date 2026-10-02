import { createFileRoute } from "@tanstack/react-router";
import { FormEvent, useState } from "react";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { API_BASE_URL, submitInquiry } from "@/lib/vehicle-platform";
import image from "@/assets/awa-global.jpg";
export const Route = createFileRoute("/request-vehicle")({
  validateSearch: (search) => ({
    vehicle: typeof search.vehicle === "string" ? search.vehicle : "",
  }),
  head: () => ({ meta: [{ title: "Request a Vehicle | AWA AUTO MALL" }] }),
  component: RequestVehiclePage,
});
function RequestVehiclePage() {
  const { vehicle } = Route.useSearch();
  const [status, setStatus] = useState("");
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("Sending your vehicle brief...");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());
    try {
      if (API_BASE_URL) {
        await submitInquiry({
          ...payload,
          customer_name: payload.name,
          source: "vehicle-request",
          type: "vehicle_request",
          request_text: `${payload.brand || "Vehicle"} ${payload.model || "sourcing request"}; year: ${payload.year || "any"}; condition: ${payload.condition || "any"}; budget: ${payload.budget || "not specified"}; destination: ${payload.market || "not specified"}; quantity: ${payload.quantity || "1"}; requirements: ${payload.requirements || "none"}`,
        });
        setStatus("Your request has been sent. Our team will review it and contact you shortly.");
      } else {
        setStatus("The live request service is not configured. Please try again later.");
      }
      (event.target as HTMLFormElement).reset();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "We could not save your request.");
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
              <Input name="brand" placeholder="Toyota" defaultValue={vehicle.split(" ")[0] || ""} />
            </Field>
            <Field label="Model">
              <Input
                name="model"
                placeholder="Land Cruiser"
                defaultValue={vehicle.split(" ").slice(1).join(" ")}
              />
            </Field>
            <Field label="Year">
              <Input
                name="year"
                type="number"
                min="1990"
                max="2030"
                defaultValue={vehicle.match(/\b20\d{2}\b/)?.[0] || ""}
              />
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
                defaultValue={
                  vehicle
                    ? `Please provide availability, inspection details, final pricing, and shipping options for ${vehicle}.`
                    : ""
                }
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
