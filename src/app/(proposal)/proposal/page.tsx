// Tab 3 — "Work With Me"
// Data-dense aesthetic: compact, monospace values, sharp borders, flat surfaces.
// No shadows, no rounded-xl, no glassmorphism. Indigo primary.
// Section order: Hero → Proof of Work → How I Work → Skills → CTA

import Link from "next/link";
import { ExternalLink, TrendingUp } from "lucide-react";
import { proposalData } from "@/data/proposal";

export default function ProposalPage() {
  const { hero, portfolioProjects, approach, skills, cta } = proposalData;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-6 py-6 space-y-8">

      {/* ── Section 1: Hero (Project Brief) ─────────────────────────────── */}
      <section
        className="rounded overflow-hidden"
        style={{ background: "oklch(0.10 0.02 var(--primary-h, 260))" }}
      >
        <div className="p-6 md:p-8 space-y-4">

          {/* "Built this demo for your project" badge — mandatory in all aesthetics */}
          <span className="inline-flex items-center gap-2 text-xs font-mono tracking-widest uppercase text-white/60 border border-white/15 bg-white/5 px-2.5 py-1 rounded-sm">
            <span className="relative inline-flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[color:var(--success)]" />
            </span>
            {hero.badge}
          </span>

          {/* Role prefix — data-dense: monospace, compact */}
          <p className="font-mono text-xs tracking-widest uppercase text-white/40">
            Node.js · Railway · Deployment Verification
          </p>

          {/* Name with weight contrast */}
          <h1 className="text-3xl md:text-4xl tracking-tight leading-none">
            <span className="font-light text-white/70">Hi, I&apos;m</span>{" "}
            <span className="font-black text-white">{hero.name}</span>
          </h1>

          {/* Tailored value prop — specific to this job, references Tab 1 */}
          <p className="text-sm md:text-base text-white/65 max-w-2xl leading-relaxed">
            {hero.valueProp}
          </p>
        </div>

        {/* Stats shelf — data-dense: compact, monospace values, flat divider */}
        <div className="border-t border-white/10 bg-white/5 px-6 py-3">
          <div className="grid grid-cols-3 gap-4">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <div className="font-mono text-xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="font-mono text-xs text-white/45 tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Section 2: Proof of Work ─────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Proof of Work
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            Relevant Projects
          </h2>
        </div>

        <div className="grid gap-3 md:grid-cols-2">
          {portfolioProjects.map((project) => (
            <div
              key={project.id}
              className="aesthetic-card p-4 space-y-2.5"
            >
              {/* Title + external link */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="text-sm font-semibold leading-snug">
                  {project.name}
                </h3>
                {project.url && (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground hover:text-primary transition-colors shrink-0"
                    style={{ transitionDuration: "var(--dur-fast)" }}
                    aria-label={`View ${project.name} live`}
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {project.description}
              </p>

              {/* Outcome badge — required, exact text from developer-profile.md */}
              <div className="flex items-start gap-1.5 text-xs text-[color:var(--success)]">
                <TrendingUp className="w-3 h-3 mt-0.5 shrink-0" />
                <span className="leading-snug">{project.outcome}</span>
              </div>

              {/* Tech tags — monospace, data-dense pill style */}
              <div className="flex flex-wrap gap-1">
                {project.tech.map((t) => (
                  <span
                    key={t}
                    className="px-1.5 py-px rounded-sm border border-border/60 text-xs font-mono text-muted-foreground bg-muted/40"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Relevance note — why this project maps to this specific job */}
              {project.relevance && (
                <p className="text-xs text-primary/70 leading-snug border-t border-border/40 pt-2">
                  {project.relevance}
                </p>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 3: How I Work ─────────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Process
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            How I Work — Deployment Jobs
          </h2>
        </div>

        {/* data-dense: 2-column grid of flat bordered step cards */}
        <div className="grid gap-3 sm:grid-cols-2">
          {approach.map((step) => (
            <div key={step.step} className="aesthetic-card p-4 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs tracking-widest uppercase text-muted-foreground">
                  Step {step.step}
                </span>
                <span className="font-mono text-xs text-muted-foreground/60 bg-muted/50 px-1.5 py-px rounded-sm border border-border/40">
                  {step.timeline}
                </span>
              </div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 4: Skills Grid ────────────────────────────────────────── */}
      <section className="space-y-3">
        <div>
          <p className="font-mono text-xs tracking-widest uppercase text-muted-foreground mb-1">
            Tech Stack
          </p>
          <h2 className="text-lg font-semibold tracking-tight">
            What I Build With
          </h2>
        </div>

        {/* data-dense: flat bordered category cards, monospace tags, compact */}
        <div className="grid gap-3 sm:grid-cols-2">
          {skills.map((category) => (
            <div key={category.category} className="aesthetic-card p-3.5 space-y-2">
              <p className="font-mono text-xs font-medium text-muted-foreground uppercase tracking-widest">
                {category.category}
              </p>
              <div className="flex flex-wrap gap-1">
                {category.items.map((skill) => (
                  <span
                    key={skill}
                    className="px-1.5 py-px rounded-sm border border-border/60 text-xs font-mono text-foreground/75 bg-muted/30"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Section 5: CTA (Dark Panel) ──────────────────────────────────── */}
      <section
        className="rounded overflow-hidden"
        style={{ background: "oklch(0.10 0.02 var(--primary-h, 260))" }}
      >
        <div className="p-6 md:p-8 space-y-4">

          {/* Pulsing availability indicator — mandatory, uses var(--success) */}
          <div className="flex items-center gap-2">
            <span className="relative inline-flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[color:var(--success)] opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[color:var(--success)]" />
            </span>
            <span className="font-mono text-xs text-white/55 tracking-wide">
              {cta.availability}
            </span>
          </div>

          {/* CTA headline — tailored to this job, not generic */}
          <h2 className="text-xl font-bold text-white leading-snug">
            {cta.headline}
          </h2>

          {/* CTA body — specific, references the demo in Tab 1 */}
          <p className="text-sm text-white/65 max-w-lg leading-relaxed">
            {cta.body}
          </p>

          {/* "Done =" statement — maps to client's own acceptance criteria */}
          <div className="border border-white/10 bg-white/5 rounded-sm px-4 py-3 space-y-1">
            <p className="font-mono text-xs text-white/40 uppercase tracking-widest">
              Done =
            </p>
            <p className="text-xs text-white/60 leading-relaxed font-mono">
              Password gate live · Login authenticates · Bill draft generates with DOCX download · Env vars documented · Local copy deleted
            </p>
          </div>

          {/* Primary action — text, not a dead-end button */}
          <p className="text-base font-semibold text-white">
            {cta.action}
          </p>

          {/* Back to demo link */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/60 transition-colors"
            style={{ transitionDuration: "var(--dur-fast)" }}
          >
            ← Back to the deployment verification dashboard
          </Link>

          {/* Divider + signature */}
          <p className="pt-3 text-xs text-white/30 border-t border-white/10 font-mono">
            — Humam
          </p>
        </div>
      </section>

    </div>
  );
}
