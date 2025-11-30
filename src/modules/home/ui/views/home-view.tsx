"use client";

import Link from "next/link";

export const HomeView = () => {
  return (

    <section className="space-y-10 px-4 py-10 md:px-10 md:py-16">

    <section className="px-4 md:px-10 py-10 md:py-16 space-y-10">

      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-primary">Meet.AI SaaS</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Spin up OpenAI-powered agents for every meeting in seconds.
        </h1>
        <p className="text-lg text-muted-foreground">
          Create reusable AI teammates that follow your instructions, join meetings, and deliver outcomes.

          Build once and let Meet.AI handle the heavy lifting across your team, from async workflows to live video co-pilots.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Link
            className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            href="/sign-up"
          >
            Start for free
          </Link>
          <Link className="inline-flex items-center justify-center text-sm font-semibold text-primary" href="/meetings">
            See a live call demo →
          </Link>
        </div>

          Build once and let Meet.AI handle the heavy lifting across your team.
        </p>

      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {["Create", "Deploy", "Scale"].map((headline, index) => (
          <div key={headline} className="rounded-xl border bg-card p-6 shadow-sm space-y-2">
            <p className="text-sm font-medium text-primary">Step {index + 1}</p>
            <h3 className="text-xl font-semibold">{headline} agents</h3>
            <p className="text-sm text-muted-foreground">
              {index === 0 && "Define your agent’s name and OpenAI instructions."}
              {index === 1 && "Invite it into your workflows and meetings."}
              {index === 2 && "Reuse proven playbooks across every call."}
            </p>
          </div>
        ))}
      </div>


      <div className="grid gap-6 rounded-2xl border bg-card p-6 shadow-sm md:grid-cols-2">
        <div className="space-y-3">
          <p className="text-sm font-semibold text-primary">Live video copilots</p>
          <h2 className="text-2xl font-bold">Let OpenAI-powered agents join your calls in real time.</h2>
          <p className="text-sm leading-relaxed text-muted-foreground">
            Route agents into ongoing video meetings to capture notes, ask clarifying questions, and deliver next steps without
            leaving the conversation. No switching tabs or juggling tools&mdash;just a reliable teammate on camera.
          </p>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Live voice + video presence with on-screen status</li>
            <li>• Instant transcripts and action items tailored to your playbooks</li>
            <li>• Works alongside your team in every customer or internal call</li>
          </ul>
        </div>
        <div className="rounded-xl border bg-muted p-6">
          <div className="mb-4 flex items-center justify-between text-xs font-medium text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-500" aria-hidden />
              Live agent on call
            </span>
            <span className="rounded-full bg-background px-2 py-1">OpenAI Realtime</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {["You", "Meet.AI Agent"].map((label) => (
              <div key={label} className="relative overflow-hidden rounded-lg border bg-background p-4 shadow-sm">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                <div className="relative space-y-3">
                  <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                    <span>{label}</span>
                    <span className="rounded-full bg-primary/10 px-2 py-1 text-primary">Live</span>
                  </div>
                  <div className="aspect-video rounded-md bg-muted" />
                  <p className="text-xs text-muted-foreground">
                    {label === "You"
                      ? "Camera and mic connected."
                      : "OpenAI agent is monitoring, summarizing, and ready to respond in voice."}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


    </section>
  );
};
