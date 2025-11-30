"use client";

import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandResponsiveDialog,
  CommandSeparator,
} from "@/components/ui/command";
import { CompassIcon, Mic2Icon, SparklesIcon, UsersIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction } from "react";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

export const DashboardCommand = ({ open, setOpen }: Props) => {
  const router = useRouter();

  const handleSelect = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  return (
    <CommandResponsiveDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Find a meeting or agent" />
      <CommandList>
        <CommandEmpty>No matches found.</CommandEmpty>
        <CommandGroup heading="Workspace">
          <CommandItem onSelect={() => handleSelect("/")}>
            <SparklesIcon className="size-4" />
            Home
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/agents")}>
            <UsersIcon className="size-4" />
            Agents
          </CommandItem>
          <CommandItem onSelect={() => handleSelect("/meetings")}>
            <Mic2Icon className="size-4" />
            Live calls
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Shortcuts">
          <CommandItem onSelect={() => handleSelect("/agents?new=true")}>
            <CompassIcon className="size-4" />
            Create a new agent
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandResponsiveDialog>
  );
};
