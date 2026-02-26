// No "use client" — no hooks

import Link from "next/link";

interface ExecutiveSummaryProps {
  commonApproach: string;
  differentApproach: string;
  accentWord?: string;
}

export function ExecutiveSummary({
  commonApproach,
  differentApproach,
  accentWord,
}: ExecutiveSummaryProps) {
  const renderDifferentApproach = () => {
    if (!accentWord) return <span>{differentApproach}</span>;
    const escaped = accentWord.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const parts = differentApproach.split(new RegExp(`(${escaped})`, "i"));
    return (
      <>
        {parts.map((part, i) =>
          part.toLowerCase() === accentWord.toLowerCase() ? (
            <span key={i} className="text-primary font-semibold">
              {part}
            </span>
          ) : (
            <span key={i}>{part}</span>
          )
        )}
      </>
    );
  };

  return (
    <div
      className="relative overflow-hidden rounded border p-4 md:p-5 space-y-3"
      style={{
        background: "oklch(0.10 0.02 260)",
        borderColor: "oklch(0.20 0.03 260)",
      }}
    >
      {/* Back link */}
      <p className="text-[10px] font-mono text-white/40">
        <Link
          href="/"
          className="hover:text-white/70 transition-colors duration-100 underline underline-offset-2"
        >
          ← Back to the live demo
        </Link>
      </p>

      {/* Common approach — muted contrast, what devs typically do wrong */}
      <p className="text-xs md:text-sm leading-relaxed text-white/50 font-mono">
        {commonApproach}
      </p>

      <hr
        className="border-0 h-px"
        style={{ backgroundColor: "oklch(0.30 0.02 260)" }}
      />

      {/* Different approach — confident, specific */}
      <p className="text-sm md:text-base leading-relaxed font-medium text-white/90">
        {renderDifferentApproach()}
      </p>

      {/* Subtle radial highlight */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "radial-gradient(ellipse at 20% 50%, oklch(0.52 0.14 260 / 0.15), transparent 65%)",
        }}
        aria-hidden
      />
    </div>
  );
}
