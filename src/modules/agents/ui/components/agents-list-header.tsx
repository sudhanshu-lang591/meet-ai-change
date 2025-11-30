"use client";

import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";

interface AgentsListHeaderProps {
  onNewAgent: () => void;
}

export const AgentsListHeader = ({ onNewAgent }: AgentsListHeaderProps) => {
  return (
    <div className="flex flex-col gap-y-4 px-4 py-4 md:px-8">
      <div className="flex items-center justify-between">
        <h5 className="text-xl font-medium">My Agents</h5>
        <Button
          type="button"
          onClick={onNewAgent}
          className="gap-2"
          aria-label="Create a new agent"
        >
          <PlusIcon className="size-4" />
          New Agent
        </Button>
      </div>
    </div>
  );
};
