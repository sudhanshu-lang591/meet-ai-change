"use client";

export const HomeView = () => {
  return (
    <section className="px-4 md:px-10 py-10 md:py-16 space-y-10">
      <div className="max-w-3xl space-y-4">
        <p className="text-sm font-semibold text-primary">Meet.AI SaaS</p>
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Spin up OpenAI-powered agents for every meeting in seconds.
        </h1>
        <p className="text-lg text-muted-foreground">
          Create reusable AI teammates that follow your instructions, join meetings, and deliver outcomes.
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
    </section>
  );
};
