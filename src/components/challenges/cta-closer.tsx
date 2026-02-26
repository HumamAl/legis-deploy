"use client";

import Link from "next/link";

export function CtaCloser() {
  return (
    <section className="aesthetic-card border border-border p-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-sm font-semibold">Ready to discuss the deployment plan?</h3>
          <p className="text-xs text-muted-foreground mt-0.5 max-w-sm">
            I&apos;ve thought through the Railway config, volume mount, and verification steps. Happy to walk through any of it before you commit.
          </p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/proposal"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-100 font-mono whitespace-nowrap"
          >
            See the proposal →
          </Link>
          <span
            className="text-xs font-mono font-medium px-2.5 py-1.5 rounded border whitespace-nowrap"
            style={{
              backgroundColor: "color-mix(in oklch, var(--primary) 8%, transparent)",
              borderColor: "color-mix(in oklch, var(--primary) 20%, transparent)",
              color: "var(--primary)",
            }}
          >
            Reply on Upwork to start
          </span>
        </div>
      </div>
    </section>
  );
}
