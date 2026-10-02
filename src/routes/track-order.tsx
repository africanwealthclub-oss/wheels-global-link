import { createFileRoute } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { ArrowRight, CheckCircle2, Clock3, PackageCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PageIntro, SectionHeading } from "@/components/marketplace";
import { publicTrackOrder } from "@/lib/vehicle-platform";
import image from "@/assets/awa-global.jpg";

type Order = { status?: string; order_number?: string };
const stages = ["Processing", "Shipped", "Arrived"];

export const Route = createFileRoute("/track-order")({
  head: () => ({
    meta: [
      { title: "Track Your Order | AWA AUTO MALL" },
      {
        name: "description",
        content:
          "Track an AWA AUTO MALL vehicle order with your order number and confirmation contact.",
      },
    ],
  }),
  component: TrackOrderPage,
});

function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [order, setOrder] = useState<Order | null>(null);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    setOrder(null);
    try {
      setOrder(await publicTrackOrder(orderNumber.trim(), confirmation.trim()));
    } catch {
      setError(
        "We couldn't find a matching order — check the order number or contact us on WhatsApp",
      );
    } finally {
      setBusy(false);
    }
  }
  const current = order
    ? Math.max(
        0,
        stages.findIndex((stage) => order.status?.toLowerCase().includes(stage.toLowerCase())),
      )
    : -1;
  return (
    <>
      <PageIntro
        eyebrow="Order tracking"
        title="Know Where Your Order Stands"
        copy="Enter your order number and the phone number or email used for confirmation."
        image={image}
      />
      <section className="section-pad">
        <div className="container-shell grid gap-12 lg:grid-cols-[.75fr_1.25fr]">
          <form
            onSubmit={submit}
            className="grid h-fit gap-4 border border-border bg-secondary p-6"
          >
            <SectionHeading
              eyebrow="Track an order"
              title="Order Details"
              copy="Both fields are required to protect order information."
            />
            <label>
              <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                Order number
              </span>
              <Input
                value={orderNumber}
                onChange={(event) => setOrderNumber(event.target.value)}
                required
              />
            </label>
            <label>
              <span className="mb-2 block text-xs font-bold uppercase text-muted-foreground">
                Phone or email
              </span>
              <Input
                value={confirmation}
                onChange={(event) => setConfirmation(event.target.value)}
                required
              />
            </label>
            {error && (
              <p role="alert" className="text-sm font-semibold text-destructive">
                {error}
              </p>
            )}
            <Button type="submit" size="lg" disabled={busy}>
              {busy ? "Checking..." : "Track Order"}
              <ArrowRight />
            </Button>
          </form>
          <div>
            {order ? (
              <div className="border border-border p-6">
                <p className="text-xs font-bold uppercase text-primary">
                  Order {order.order_number || orderNumber}
                </p>
                <div className="mt-10 grid gap-8 md:grid-cols-3">
                  {stages.map((stage, index) => (
                    <div key={stage} className="relative text-center">
                      <span
                        className={`mx-auto grid h-12 w-12 place-items-center rounded-full ${index <= current ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}
                      >
                        {index === 0 ? (
                          <Clock3 />
                        ) : index === 1 ? (
                          <PackageCheck />
                        ) : (
                          <CheckCircle2 />
                        )}
                      </span>
                      <strong className="mt-4 block uppercase">{stage}</strong>
                      {index < stages.length - 1 && (
                        <span
                          className={`absolute left-[calc(50%+2rem)] right-[calc(-50%+2rem)] top-6 hidden h-0.5 md:block ${index < current ? "bg-primary" : "bg-border"}`}
                        />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="border-l-2 border-primary bg-secondary p-7">
                <SectionHeading
                  eyebrow="Secure lookup"
                  title="Your Tracking Result Will Appear Here"
                  copy="We only look up an order after both the order number and confirmation contact are submitted."
                />
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
