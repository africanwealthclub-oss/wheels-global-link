import { useState, type FormEvent } from "react";
import {
  Bot,
  CarFront,
  ChevronRight,
  CircleHelp,
  GitCompareArrows,
  Heart,
  MessageCircle,
  Send,
  Ship,
  Sparkles,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatMessage = { role: "user" | "assistant"; content: string };

type HelpTopic = { label: string; prompt: string; icon: typeof CarFront };
const topics: HelpTopic[] = [
  { label: "Find a vehicle", prompt: "How do I find the right vehicle?", icon: CarFront },
  { label: "Prices & currency", prompt: "How do prices and currencies work?", icon: Sparkles },
  { label: "Sourcing & shipping", prompt: "How does sourcing and shipping work?", icon: Ship },
  {
    label: "Saved cars & compare",
    prompt: "How do favorites and compare work?",
    icon: GitCompareArrows,
  },
];

const welcome =
  "I can help you use AWA AUTO MALL, understand vehicle listings, compare options, prepare a sourcing request, and know what information to provide before contacting the team. What would you like to do?";

function helpReply(question: string): string {
  const q = question.toLowerCase();
  if (
    q.includes("price") ||
    q.includes("currency") ||
    q.includes("usd") ||
    q.includes("ghs") ||
    q.includes("exchange")
  )
    return "Prices may be live inventory prices or indicative sourcing estimates. Use the currency selector on the Cars page to view the display currency; changing it updates the visible vehicle prices, while the final invoice is confirmed by the AWA team. A range usually reflects supplier, specification, shipping, duty, or availability differences. Before paying, ask for a written quote that confirms the vehicle, condition, mileage, shipping, destination, duties, port fees, and delivery timeline.";
  if (
    q.includes("ship") ||
    q.includes("import") ||
    q.includes("delivery") ||
    q.includes("custom") ||
    q.includes("port")
  )
    return "AWA sources vehicles internationally, including from Guangzhou, China. Shipping time and total landed cost depend on the vehicle, destination country, port, shipping method, customs rules, duties, port charges, insurance, and local delivery. To receive a useful estimate, prepare your destination city or port, preferred vehicle, budget, and whether you need door-to-door delivery. Treat any displayed delivery wording as an estimate until the team confirms it for your destination.";
  if (
    q.includes("find") ||
    q.includes("search") ||
    q.includes("filter") ||
    q.includes("vehicle") ||
    q.includes("car")
  )
    return "Open Cars to browse the inventory. You can search by make or model and narrow results by vehicle type, condition, year, and other available filters. Open a vehicle card for its specifications, images, price, availability, and request options. If you do not see the exact model you want, use Request a Vehicle and include make, model, year range, condition, budget, destination, and any must-have features.";
  if (
    q.includes("favorite") ||
    q.includes("save") ||
    q.includes("compare") ||
    q.includes("shortlist")
  )
    return "Use the heart icon to save vehicles to Saved, then use the comparison tools to review shortlisted vehicles side by side. Compare price, year, condition, mileage, fuel, transmission, availability, and key specifications. Saving a vehicle does not reserve it; availability and pricing still need to be confirmed by AWA before purchase.";
  if (
    q.includes("request") ||
    q.includes("inquir") ||
    q.includes("quote") ||
    q.includes("buy") ||
    q.includes("order")
  )
    return "For a quote or sourcing request, provide your full name, email or phone, target vehicle, budget, destination, preferred condition, and timing. Mention whether you need financing, shipping, customs guidance, or a trade-in discussion. The team can then check availability, validate the specification, and return a clearer quote. Do not send passwords, card numbers, or sensitive identity documents in chat.";
  if (q.includes("part") || q.includes("spare") || q.includes("accessor"))
    return "For spare parts, share the vehicle make, model, year, engine or chassis number if available, the exact part name, quantity, and destination. Compatibility should be confirmed against the vehicle details before ordering. If the part is not listed, submit a request and the sourcing team can check supplier availability.";
  if (q.includes("contact") || q.includes("human") || q.includes("agent") || q.includes("whatsapp"))
    return "You can contact the team through the Contact page, the phone details in the footer, or WhatsApp for a direct conversation. Include the vehicle link or model, your destination, budget, and the specific question so the team can respond faster. WhatsApp is a contact option—not the only way to get help; this assistant can explain the site and prepare your request first.";
  if (q.includes("admin") || q.includes("api") || q.includes("login"))
    return "The customer-facing site does not require an admin login. Admin tools are for authorized AWA staff to manage vehicles, parts, inquiries, orders, articles, and settings. Customers should use the public Cars, Request a Vehicle, Contact, Saved, and Compare features.";
  return "I can help with vehicle search, live or indicative prices, currency display, sourcing, shipping, spare parts, saved cars, comparison, and preparing a quote request. Try one of the topic buttons above, or ask a specific question such as ‘What should I include in a sourcing request?’";
}

export function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [busy, setBusy] = useState(false);

  async function ask(content: string) {
    const question = content.trim();
    if (!question || busy) return;
    const next = [...messages, { role: "user" as const, content: question }];
    setMessages(next);
    setInput("");
    setBusy(true);
    try {
      const response = await fetch("/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      const data = await response.json().catch(() => ({}));
      const answer =
        response.ok && typeof data.message === "string" && data.message.trim()
          ? data.message
          : helpReply(question);
      setMessages([...next, { role: "assistant", content: answer }]);
    } catch {
      setMessages([...next, { role: "assistant", content: helpReply(question) }]);
    } finally {
      setBusy(false);
    }
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void ask(input);
  }
  return (
    <>
      {open && (
        <section
          className="fixed bottom-[calc(10.5rem+env(safe-area-inset-bottom))] right-4 z-50 flex max-h-[min(620px,calc(100dvh-8rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl sm:bottom-24 sm:right-5"
          aria-label="AWA AUTO MALL AI chat"
        >
          <div className="flex items-center justify-between bg-navy p-4 text-primary-foreground">
            <div className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              <div>
                <strong className="block text-sm uppercase">AWA Assistant</strong>
                <span className="text-[11px] text-primary-foreground/70">
                  Vehicle and website help
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1 hover:bg-white/10"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="border-b border-border bg-secondary/50 p-3">
            <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-muted-foreground">
              <CircleHelp className="h-3.5 w-3.5" /> Quick help
            </p>
            <div className="grid grid-cols-2 gap-2">
              {topics.map(({ label, prompt, icon: Icon }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => void ask(prompt)}
                  disabled={busy}
                  className="flex min-h-10 items-center gap-2 rounded-lg border border-border bg-background px-2.5 py-2 text-left text-[11px] font-semibold leading-tight transition-colors hover:border-primary hover:text-primary disabled:opacity-50"
                >
                  <Icon className="h-3.5 w-3.5 shrink-0" />
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className="flex min-h-32 flex-1 flex-col gap-3 overflow-y-auto p-4 text-sm">
            {messages.length === 0 && (
              <div className="space-y-3">
                <p className="bg-secondary px-3 py-2 leading-5 text-foreground">{welcome}</p>
                <div className="flex flex-wrap gap-2 text-xs">
                  <a
                    href="/cars"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    Browse cars <ChevronRight className="h-3 w-3" />
                  </a>
                  <a
                    href="/request-vehicle"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    Request a vehicle <ChevronRight className="h-3 w-3" />
                  </a>
                  <a
                    href="/favorites"
                    className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
                  >
                    <Heart className="h-3 w-3" /> Saved cars
                  </a>
                </div>
              </div>
            )}
            {messages.map((message, index) => (
              <p
                key={`${message.role}-${index}`}
                className={
                  message.role === "user"
                    ? "max-w-[88%] self-end rounded-lg bg-primary px-3 py-2 leading-5 text-primary-foreground"
                    : "max-w-[94%] rounded-lg bg-secondary px-3 py-2 leading-5 text-foreground"
                }
              >
                {message.content}
              </p>
            ))}
            {busy && <p className="text-muted-foreground">Checking that for you…</p>}
          </div>
          <form onSubmit={submit} className="flex gap-2 border-t border-border p-3">
            <input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Ask about cars, prices, shipping…"
              aria-label="Chat message"
              className="min-w-0 flex-1 rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-primary focus:ring-1 focus:ring-primary"
            />
            <Button
              type="submit"
              size="icon"
              aria-label="Send message"
              disabled={busy || !input.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
          <div className="flex items-center justify-between border-t border-border px-4 py-2 text-[10px] text-muted-foreground">
            <span>Do not send passwords or payment details.</span>
            <a
              href="/contact"
              className="inline-flex items-center gap-1 font-bold text-primary hover:underline"
            >
              <MessageCircle className="h-3 w-3" /> Contact team
            </a>
          </div>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label={open ? "Close AI chat" : "Open AI chat"}
        className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-20 z-40 grid h-12 w-12 place-items-center rounded-full bg-navy text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-5 sm:right-24 sm:h-14 sm:w-14"
      >
        <Bot className="h-6 w-6" />
      </button>
    </>
  );
}
