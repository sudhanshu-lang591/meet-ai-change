"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useSuspenseQuery } from "@tanstack/react-query";
import { Clock3, Link2, RadioTower, Video } from "lucide-react";

import { GeneratedAvatar } from "@/components/generated-avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useTRPC } from "@/trpc/client";

interface TranscriptLine {
  speaker: string;
  content: string;
  tone: "agent" | "user" | "system";
}

export const LiveCallsView = () => {
  const trpc = useTRPC();
  const { data: agents } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  const [selectedAgentId, setSelectedAgentId] = useState<string | undefined>(agents[0]?.id);
  const [isLive, setIsLive] = useState(false);
  const [callStatus, setCallStatus] = useState<"idle" | "connecting" | "live">("idle");
  const [callDuration, setCallDuration] = useState(0);
  const [transcript, setTranscript] = useState<TranscriptLine[]>([
    {
      speaker: "System",
      content: "Pair your agent to join a live video call and begin transcribing.",
      tone: "system",
    },
  ]);

  const activeAgent = useMemo(
    () => agents.find((agent) => agent.id === selectedAgentId) ?? agents[0],
    [agents, selectedAgentId],
  );

  const agentSlug = useMemo(
    () =>
      activeAgent?.name
        ? activeAgent.name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)/g, "")
        : "agent",
    [activeAgent],
  );

  const fallbackMeetingLink = useMemo(() => `https://stream.meet.ai/${agentSlug || "agent"}`, [agentSlug]);
  const [meetingLink, setMeetingLink] = useState(fallbackMeetingLink);
  const [isFetchingMeetingLink, setIsFetchingMeetingLink] = useState(false);

  const formattedDuration = useMemo(() => {
    const minutes = Math.floor(callDuration / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (callDuration % 60).toString().padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [callDuration]);

  const shortInstructions = useMemo(() => {
    if (!activeAgent?.instructions) return "OpenAI agent ready for live calls.";
    if (activeAgent.instructions.length < 140) return activeAgent.instructions;
    return `${activeAgent.instructions.slice(0, 137)}...`;
  }, [activeAgent]);

  useEffect(() => {
    setMeetingLink(fallbackMeetingLink);

    const controller = new AbortController();

    const fetchMeetingLink = async () => {
      if (!activeAgent?.name) return;
      setIsFetchingMeetingLink(true);

      try {
        const response = await fetch(
          `/api/live/meeting-link?agent=${encodeURIComponent(activeAgent.name)}`,
          { signal: controller.signal },
        );

        if (!response.ok) throw new Error("Unable to fetch meeting link");

        const { meetingLink: fetchedLink } = (await response.json()) as { meetingLink?: string };
        if (!controller.signal.aborted && fetchedLink) {
          setMeetingLink(fetchedLink);
        }
      } catch {
        if (!controller.signal.aborted) {
          setMeetingLink(fallbackMeetingLink);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsFetchingMeetingLink(false);
        }
      }
    };

    void fetchMeetingLink();

    return () => controller.abort();
  }, [activeAgent?.name, fallbackMeetingLink]);

  const startCall = () => {
    if (!activeAgent) return;

    setCallDuration(0);
    setIsLive(true);
    setCallStatus("connecting");
    setTranscript((previous) => [
      ...previous,
      {
        speaker: "System",
        content: `${activeAgent.name} is joining with OpenAI-powered voice + video on Stream.`,
        tone: "system",
      },
      {
        speaker: activeAgent.name,
        content: "I'm live on camera and ready to assist. What would you like me to capture?",
        tone: "agent",
      },
      {
        speaker: "System",
        content: `Stream video bridge ready at ${meetingLink}. Captions and speaker tags are enabled for this session.`,
        tone: "system",
      },
    ]);

    window.setTimeout(() => {
      setCallStatus("live");
      setTranscript((previous) => [
        ...previous,
        {
          speaker: "System",
          content: `${activeAgent.name} is now live on video. Audio, captions, and action items will stream automatically.`,
          tone: "system",
        },
      ]);
    }, 800);
  };

  useEffect(() => {
    if (callStatus !== "live") return;

    const startedAt = Date.now();
    const timer = window.setInterval(() => {
      setCallDuration(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    return () => window.clearInterval(timer);
  }, [callStatus]);

  const endCall = () => {
    if (!activeAgent) return;
    setIsLive(false);
    setCallStatus("idle");
    setCallDuration(0);
    setTranscript((previous) => [
      ...previous,
      {
        speaker: "System",
        content: `${activeAgent.name} ended the live video session. A recap will be queued automatically.`,
        tone: "system",
      },
    ]);
  };

  const dropLiveInsight = () => {
    if (!isLive || !activeAgent) return;
    setTranscript((previous) => [
      ...previous,
      {
        speaker: "You",
        content: "Give me a concise status and next actions for this call.",
        tone: "user",
      },
      {
        speaker: activeAgent.name,
        content: `Based on the live transcript, here are the next steps: summarize decisions, assign owners, and send a recap that matches the ${activeAgent.name} playbook.`,
        tone: "agent",
      },
      {
        speaker: "System",
        content: "Live summary delivered. The video agent will keep tracking follow-ups in real time.",
        tone: "system",
      },
    ]);
  };

  return (
    <div className="space-y-8 px-4 pb-10 md:px-8">
      <div className="space-y-3 rounded-2xl border bg-card p-6 shadow-sm">
        <Badge variant="secondary" className="uppercase tracking-wide">OpenAI live</Badge>
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Live video agents</h1>
            <p className="max-w-2xl text-sm text-muted-foreground">
              Launch an OpenAI-powered agent into your meeting with live video presence, streaming transcripts, and smart
              follow-ups. Keep clients and teammates aligned while Meet.AI handles the heavy lifting.
            </p>
          </div>
          <Button asChild size="lg">
            <Link href="/agents">Configure agents</Link>
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <CardTitle className="text-xl font-semibold">Live call room</CardTitle>
              <p className="text-sm text-muted-foreground">Preview the on-camera experience for you and your agent.</p>
            </div>
            <Badge variant={callStatus === "live" ? "default" : "secondary"} className="capitalize">
              {callStatus === "live" ? "Live on video" : callStatus === "connecting" ? "Connecting" : "Offline"}
            </Badge>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {["You", activeAgent?.name ?? "Agent"].map((label, index) => (
                <div key={label} className="relative rounded-xl border bg-muted p-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-primary/5" />
                  <div className="relative space-y-3">
                    <div className="flex items-center justify-between text-xs font-semibold text-muted-foreground">
                      <span className="flex items-center gap-2">
                        <span className={`size-2 rounded-full ${isLive ? "bg-emerald-500" : "bg-muted-foreground"}`} aria-hidden />
                        {label}
                      </span>
                      <span className="rounded-full bg-background px-2 py-1 text-[10px] uppercase tracking-wide text-muted-foreground">
                        {index === 0 ? "Presenter" : "OpenAI agent"}
                      </span>
                    </div>
                    <div className="aspect-video w-full overflow-hidden rounded-lg bg-background shadow-inner">
                      <div className="flex h-full items-center justify-center bg-gradient-to-br from-background via-muted to-primary/5 text-xs font-medium text-muted-foreground">
                        {callStatus === "live"
                          ? "Streaming video"
                          : callStatus === "connecting"
                            ? "Connecting camera and audio"
                            : "Waiting for call to start"}
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {index === 0
                        ? "Your mic and camera stay local; we never record without your consent."
                        : `OpenAI keeps ${label} on-script with your instructions.`}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="rounded-xl border bg-background p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <GeneratedAvatar seed={activeAgent?.name ?? "Live Agent"} variant="botttsNeutral" className="size-10 border" />
                  <div>
                    <p className="text-sm font-semibold">{activeAgent?.name ?? "Select an agent"}</p>
                    <p className="text-xs text-muted-foreground">{shortInstructions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button onClick={startCall} disabled={!activeAgent || isLive}>
                    {callStatus === "connecting"
                      ? "Connecting..."
                      : callStatus === "live"
                        ? "Agent is live"
                        : "Start live video"}
                  </Button>
                  <Button variant="outline" onClick={dropLiveInsight} disabled={!isLive}>
                    Drop OpenAI response
                  </Button>
                  <Button variant="ghost" onClick={endCall} disabled={!isLive}>
                    End call
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Session controls</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Choose an agent</label>
              <select
                value={selectedAgentId}
                onChange={(event) => setSelectedAgentId(event.target.value)}
                className="w-full rounded-md border bg-background px-3 py-2 text-sm shadow-sm"
              >
                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-muted-foreground">Live calls inherit the agent instructions automatically.</p>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Live video session</p>
              <div className="space-y-3 rounded-lg border bg-background p-3 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <Video className="size-4 text-primary" />
                    <span>{callStatus === "live" ? "On-camera with your agent" : "Ready for live video"}</span>
                  </div>
                  <Badge variant={callStatus === "live" ? "default" : "secondary"} className="capitalize">
                    {callStatus === "live" ? "Live" : callStatus === "connecting" ? "Connecting" : "Offline"}
                  </Badge>
                </div>
                <div className="flex flex-wrap items-center gap-2 text-muted-foreground">
                  <div className="flex min-w-0 items-center gap-2">
                    <Link2 className="size-4" />
                    <span className="truncate" title={meetingLink}>
                      {isFetchingMeetingLink ? "Fetching meeting link..." : meetingLink}
                    </span>
                  </div>
                  <Badge variant="outline" className="border-dashed">Stream video link</Badge>
                </div>
                <div className="flex flex-wrap gap-3 text-muted-foreground">
                  <span className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-[11px] font-medium">
                    <RadioTower className="size-4 text-primary" />
                    {callStatus === "live" ? "Streaming with live captions" : "Waiting to connect"}
                  </span>
                  <span className="flex items-center gap-2 rounded-md bg-muted px-2 py-1 text-[11px] font-medium">
                    <Clock3 className="size-4 text-primary" />
                    {callStatus === "live" ? `On call ${formattedDuration}` : "00:00"}
                  </span>
                </div>
              </div>
            </div>
            <Separator />
            <div className="space-y-2">
              <p className="text-sm font-semibold">Transcript + actions</p>
              <div className="space-y-3 rounded-lg border bg-muted/50 p-3 text-xs">
                {transcript.map((line, index) => (
                  <div key={`${line.speaker}-${index}`} className="space-y-1 rounded-md bg-background p-2 shadow-sm">
                    <p className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                      <span className="size-2 rounded-full bg-primary" aria-hidden />
                      {line.speaker}
                    </p>
                    <p className="text-muted-foreground">{line.content}</p>
                  </div>
                ))}
              </div>
              <Button variant="secondary" className="w-full" onClick={dropLiveInsight} disabled={!isLive}>
                Ask agent for a live summary
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export const LiveCallsViewLoading = () => {
  return (
    <div className="space-y-4 px-4 pb-10 md:px-8">
      <div className="h-20 rounded-lg bg-muted" />
      <div className="grid gap-4 lg:grid-cols-[2fr,1fr]">
        <div className="h-96 rounded-lg bg-muted" />
        <div className="h-96 rounded-lg bg-muted" />
      </div>
    </div>
  );
};

export const LiveCallsViewError = () => {
  return (
    <div className="space-y-2 px-4 pb-10 md:px-8 text-center text-sm text-muted-foreground">
      <p>We couldn&apos;t load your agents for live calls.</p>
      <p>Refresh the page or create a new agent to try again.</p>
    </div>
  );
};
