import { Link } from "@tanstack/react-router";
import { CarFront, Home, MapPin, Menu, MessageCircle, Phone, X } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import logo from "@/assets/awa-logo.png";

const nav = [
  { to: "/", label: "Home" },
  { to: "/cars", label: "Cars" },
  { to: "/request-vehicle", label: "Request a Vehicle" },
  { to: "/news", label: "News" },
  { to: "/about", label: "About Us" },
  { to: "/why-awa", label: "Why AWA" },
  { to: "/contact", label: "Contact" },
] as const;
export const whatsappUrl = (message = "Hello AWA AUTO MALL, I would like to make an inquiry.") =>
  `https://wa.me/971586106612?text=${encodeURIComponent(message)}`;

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur-xl">
      <div className="hidden bg-navy py-2 text-primary-foreground md:block">
        <div className="container-shell flex items-center justify-between text-xs">
          <span>Guangzhou, China · Global vehicle sourcing</span>
          <div className="flex gap-6">
            <a href="tel:+8613026895234">+86 130 2689 5234</a>
          </div>
        </div>
      </div>
      <div className="container-shell grid h-16 grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:h-20 lg:flex">
        <Link to="/" aria-label="AWA AUTO MALL home" className="min-w-0 lg:mr-auto">
          <img
            src={logo}
            alt="AWA AUTO MALL"
            className="h-11 w-auto max-w-[155px] object-contain sm:h-14 sm:max-w-[190px]"
          />
        </Link>
        <nav aria-label="Primary navigation" className="hidden items-center gap-5 lg:flex">
          {nav.map((x) => (
            <Link
              key={x.to}
              to={x.to}
              activeOptions={{ exact: x.to === "/" }}
              className="text-sm font-semibold text-foreground/75 transition-colors hover:text-primary data-[status=active]:text-primary"
            >
              {x.label}
            </Link>
          ))}
        </nav>
        <Button asChild variant="automotive" className="ml-4 hidden lg:inline-flex">
          <Link to="/cars">Find Your Car</Link>
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="lg:hidden"
        >
          {open ? <X /> : <Menu />}
        </Button>
      </div>
      {open && (
        <div className="max-h-[calc(100svh-4rem)] overflow-y-auto border-t bg-background lg:hidden">
          <nav className="container-shell grid py-3">
            {nav.map((x) => (
              <Link
                key={x.to}
                to={x.to}
                onClick={() => setOpen(false)}
                className="border-b border-border py-3 font-semibold"
              >
                {x.label}
              </Link>
            ))}
            <Button asChild variant="automotive" size="lg" className="mt-4">
              <Link to="/cars" onClick={() => setOpen(false)}>
                Find Your Car
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
export function MobileAppNav() {
  const items = [
    { to: "/", label: "Home", icon: Home },
    { to: "/cars", label: "Cars", icon: CarFront },
    { to: "/request-vehicle", label: "Request", icon: MessageCircle },
    { to: "/contact", label: "Contact", icon: Phone },
  ];
  return (
    <nav
      aria-label="Mobile app navigation"
      className="site-mobile-nav fixed inset-x-0 bottom-0 z-40 grid grid-cols-5 border-t border-border/80 bg-background/95 pb-[env(safe-area-inset-bottom)] shadow-[0_-10px_30px_rgba(15,23,42,.10)] backdrop-blur-xl lg:hidden"
    >
      {items.map(({ to, label, icon: Icon }) => (
        <Link
          key={to}
          to={to}
          activeOptions={{ exact: to === "/" }}
          className="flex min-h-16 flex-col items-center justify-center gap-1 text-[10px] font-bold text-muted-foreground transition-colors data-[status=active]:text-primary"
        >
          <Icon className="h-5 w-5" />
          {label}
        </Link>
      ))}
    </nav>
  );
}
export function SiteFooter() {
  return (
    <footer className="bg-surface-dark text-primary-foreground">
      <div className="container-shell grid gap-10 py-14 md:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <img src={logo} alt="AWA AUTO MALL" className="h-20 w-auto bg-transparent p-0" />
          <p className="mt-5 max-w-sm text-sm text-primary-foreground/65">
            Cars sourced from Guangzhou, China for customers around the world.
          </p>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase">Navigate</h2>
          <div className="mt-4 grid gap-2 text-sm text-primary-foreground/70">
            {nav.map((x) => (
              <Link key={x.to} to={x.to} className="hover:text-primary-foreground">
                {x.label}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-lg font-bold uppercase">Contact</h2>
          <div className="mt-4 grid gap-2 text-sm text-primary-foreground/70">
            <span>Guangzhou, China</span>
            <a href="tel:+8613026895234">+86 130 2689 5234</a>
            <a href="tel:+233592656665">+233 592 656 665</a>
            <span>TikTok: AWA Legit Plug</span>
          </div>
        </div>
      </div>
      <div className="border-t border-primary-foreground/10 py-5">
        <div className="container-shell text-xs text-primary-foreground/50">
          © 2026 AWA AUTO MALL. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
}
export function WhatsAppFloat() {
  return (
    <a
      href={whatsappUrl()}
      target="_blank"
      rel="noreferrer"
      aria-label="Chat with AWA AUTO MALL on WhatsApp"
      className="fixed bottom-[calc(5.5rem+env(safe-area-inset-bottom))] right-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 sm:bottom-5 sm:right-5 sm:h-14 sm:w-14"
    >
      <MessageCircle />
    </a>
  );
}
export function ContactStrip() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {[
        [Phone, "China phone", "+86 130 2689 5234", "tel:+8613026895234"],
        [Phone, "Ghana phone", "+233 592 656 665", "tel:+233592656665"],
        [
          MapPin,
          "Location",
          "Guangzhou, China",
          "https://www.google.com/maps/search/?api=1&query=Guangzhou%2C%20China",
        ],
        [
          MessageCircle,
          "TikTok",
          "AWA Legit Plug",
          "https://www.tiktok.com/search?q=AWA%20Legit%20Plug",
        ],
      ].map(([Icon, label, value, href]) => (
        <a
          key={String(label)}
          href={String(href)}
          className="border border-border bg-card p-5 transition-colors hover:border-primary"
        >
          <Icon className="mb-5 text-primary" />
          <span className="block text-xs font-bold uppercase text-muted-foreground">
            {String(label)}
          </span>
          <strong className="mt-1 block text-sm">{String(value)}</strong>
        </a>
      ))}
    </div>
  );
}
