import { useRef, useState } from "react";

export function Vehicle360Viewer({ frames, title }: { frames: string[]; title: string }) {
  const [index, setIndex] = useState(0);
  const startX = useRef<number | null>(null);
  const frameCount = frames.length;
  function move(clientX: number) {
    if (startX.current === null || frameCount < 2) return;
    const delta = clientX - startX.current;
    if (Math.abs(delta) < 18) return;
    setIndex((current) => (current + (delta < 0 ? 1 : -1) + frameCount) % frameCount);
    startX.current = clientX;
  }
  return (
    <div
      className="border border-border bg-secondary p-3"
      onMouseDown={(event) => {
        startX.current = event.clientX;
      }}
      onMouseMove={(event) => move(event.clientX)}
      onMouseUp={() => {
        startX.current = null;
      }}
      onMouseLeave={() => {
        startX.current = null;
      }}
      onTouchStart={(event) => {
        startX.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchMove={(event) => {
        if (event.touches[0]) move(event.touches[0].clientX);
      }}
      onTouchEnd={() => {
        startX.current = null;
      }}
    >
      <img
        src={frames[index]}
        alt={`${title} 360 degree view`}
        className="aspect-[16/10] w-full select-none object-cover"
        draggable={false}
      />
      <p className="mt-2 text-center text-xs font-bold uppercase text-muted-foreground">
        360° view · frame {index + 1} of {frameCount}
      </p>
    </div>
  );
}
