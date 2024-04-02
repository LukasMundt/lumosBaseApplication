import * as React from "react";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandLinkItem,
    CommandList,
} from "@/Components/ui/command";
import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Link, router } from "@inertiajs/react";
import { Building2 } from "lucide-react";
import { useEffect } from "react";

export function TeamCombobox({ teams = [], className = "", currentTeam }) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");
    const [selectedStatus, setSelectedStatus] = React.useState(currentTeam);

    const currentTeamElement = teams.find(
        (team) => team.id + "" === currentTeam
    );

    useEffect(() => {
        console.log(selectedStatus);
    }, [selectedStatus]);

    if (isDesktop) {
        return (
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="secondary"
                        className={"w-full justify-start " + className}
                    >
                        <Building2 className="h-5 w-5 mr-3" />
                        {currentTeam && currentTeamElement ? (
                            <>Team: {currentTeamElement.name}</>
                        ) : (
                            <>Team festlegen</>
                        )}
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0" align="start">
                    <TeamList
                        setOpen={setOpen}
                        setSelectedStatus={setSelectedStatus}
                        teams={teams}
                    />
                </PopoverContent>
            </Popover>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="secondary"
                    className={"mt-3 text-lg w-full justify-start " + className}
                >
                    <Building2 className="h-5 w-5 mr-3" />
                    {currentTeam && currentTeamElement ? (
                        <>Team: {currentTeamElement.name}</>
                    ) : (
                        <>Team festlegen</>
                    )}
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <TeamList
                        setOpen={setOpen}
                        setSelectedStatus={setSelectedStatus}
                        teams={teams}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}

function TeamList({ setOpen, setSelectedTeam, teams = [] }) {
    return (
        <Command>
            <CommandInput placeholder="Filter teams..." />
            <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup>
                    {teams.map((team) => (
                        <CommandLinkItem
                            key={team.id}
                            value={team.id}
                            href={route("domain.dashboard", { domain: team.id })}
                            // onSelect={(value) => {
                            //     // router.get(
                            //     //     route("domain.dashboard", { domain: value })
                            //     // );
                            //     setSelectedTeam(value);
                            //     setOpen(false);
                            // }}
                        >
                            {team.name}
                        </CommandLinkItem>
                    ))}
                </CommandGroup>
            </CommandList>
            
        </Command>
    );
}
