"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { LoadingState } from "@/components/loading-state";
import { ErrorState } from "@/components/error-state";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GeneratedAvatar } from "@/components/generated-avatar";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { NewAgentDialog } from "../components/new-agent-dialog";


export const AgentsView = () => {
  const trpc = useTRPC();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { data } = useSuspenseQuery(trpc.agents.getMany.queryOptions());

  return (
    <>
      <NewAgentDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
      <div className="px-4 pb-8 md:px-8">
        {data.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed bg-background py-16">
            <GeneratedAvatar seed="empty-state" variant="botttsNeutral" className="size-16" />
            <div className="space-y-1 text-center">
              <h3 className="text-lg font-semibold">No agents yet</h3>
              <p className="max-w-md text-sm text-muted-foreground">
                Create your first AI assistant by defining its name and instructions. Meet.AI will use OpenAI to bring it to life.
              </p>
            </div>
            <Button onClick={() => setIsDialogOpen(true)}>Create an agent</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-3">
            {data.map((agent) => (
              <Card key={agent.id} className="h-full">
                <CardHeader className="flex flex-row items-center gap-4">
                  <GeneratedAvatar seed={agent.name} variant="botttsNeutral" className="size-12 border" />
                  <div className="space-y-1">
                    <CardTitle className="text-xl font-semibold">{agent.name}</CardTitle>
                    <Badge variant="secondary" className="capitalize">
                      OpenAI Agent
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="line-clamp-3 text-sm leading-relaxed text-muted-foreground">{agent.instructions}</p>
                  <div className="text-xs text-muted-foreground">
                    Created on {agent.createdAt ? new Date(agent.createdAt).toLocaleDateString() : "Just now"}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export const AgentsViewLoading = () => {
  return <LoadingState title="Loading Agents" description="This may take a few Seconds" />;
};

export const AgentsViewError = () => {
  return <ErrorState title="Error Loading Agents" description="Something Went Wrong" />;
};
