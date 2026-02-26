"use client";

import type { ReactNode } from "react";
import { challenges, executiveSummary } from "@/data/challenges";
import { ChallengeCard } from "@/components/challenges/challenge-card";
import { ExecutiveSummary } from "@/components/challenges/executive-summary";
import { CtaCloser } from "@/components/challenges/cta-closer";
import { EnvVarFlow } from "@/components/challenges/env-var-flow";
import { SqlitePersistence } from "@/components/challenges/sqlite-persistence";
import { VerificationChecklist } from "@/components/challenges/verification-checklist";

// Visualization mapping — keyed by challenge.id
const VISUALIZATIONS: Record<string, ReactNode> = {
  "challenge-env-vars": <EnvVarFlow />,
  "challenge-sqlite-persistence": <SqlitePersistence />,
  "challenge-verification-checklist": <VerificationChecklist />,
};

export default function ChallengesPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-4 py-6 md:px-6 space-y-5">

        {/* Page heading */}
        <div>
          <h1 className="text-xl font-semibold tracking-tight">My Approach</h1>
          <p className="text-xs text-muted-foreground mt-0.5 font-mono">
            How I would tackle the key deployment challenges for this project
          </p>
        </div>

        {/* Executive summary */}
        <ExecutiveSummary
          commonApproach={executiveSummary.commonApproach}
          differentApproach={executiveSummary.differentApproach}
          accentWord={executiveSummary.accentWord}
        />

        {/* Challenge cards */}
        <div className="flex flex-col gap-4">
          {challenges.map((challenge, index) => (
            <ChallengeCard
              key={challenge.id}
              index={index}
              title={challenge.title}
              description={challenge.description}
              outcome={challenge.outcome}
              visualization={VISUALIZATIONS[challenge.id]}
            />
          ))}
        </div>

        {/* CTA closer */}
        <CtaCloser />

      </div>
    </div>
  );
}
