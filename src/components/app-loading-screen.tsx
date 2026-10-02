import { useEffect, useState } from "react";
import logo from "@/assets/awa-logo.png";

export function AppLoadingScreen() {
  const [visible, setVisible] = useState(true);
  useEffect(() => {
    const timer = window.setTimeout(() => setVisible(false), 850);
    return () => window.clearTimeout(timer);
  }, []);
  if (!visible) return null;
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-white px-8 text-center transition-opacity"
      aria-label="Loading AWA AUTO MALL"
      role="status"
    >
      <div className="flex flex-col items-center">
        <img src={logo} alt="AWA AUTO MALL" className="h-auto w-52 max-w-[72vw] object-contain" />
        <div className="mt-8 flex items-center gap-2" aria-hidden="true">
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:150ms]" />
          <span className="h-2 w-2 animate-pulse rounded-full bg-primary [animation-delay:300ms]" />
        </div>
        <p className="mt-4 text-xs font-bold uppercase tracking-[.22em] text-slate-400">
          Loading your vehicle desk
        </p>
      </div>
    </div>
  );
}
