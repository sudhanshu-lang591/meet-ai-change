import { NextResponse } from "next/server";

const slugifyAgent = (name?: string) =>
  (name ?? "agent")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agentName = searchParams.get("agent") ?? undefined;
  const meetingLink = `https://stream.meet.ai/${slugifyAgent(agentName) || "agent"}`;

  return NextResponse.json({ meetingLink });
}
