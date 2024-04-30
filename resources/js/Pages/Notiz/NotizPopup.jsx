import * as React from "react";

import { useMediaQuery } from "@uidotdev/usehooks";
import { Button } from "@/Components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger } from "@/Components/ui/drawer";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { useEffect } from "react";
import Form from "./Form";
import { Dialog, DialogContent, DialogTrigger } from "@/Components/ui/dialog";

export default function NotizPopup({
    className = "",
    creationUrl,
    toggleReload = null,
}) {
    const [open, setOpen] = React.useState(false);
    const isDesktop = useMediaQuery("(min-width: 768px)");

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen} className="w-96">
                <DialogTrigger asChild>
                    <Button
                        variant="outline"
                        className={"justify-start " + className}
                    >
                        Neue Notiz
                    </Button>
                </DialogTrigger>
                <DialogContent className=" p-0" align="start">
                    <Form
                        creationUrl={creationUrl}
                        toggleReload={toggleReload}
                    />
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button
                    variant="outline"
                    className={"mt-3 text-lg justify-start " + className}
                >
                    Neue Notiz
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <div className="mt-4 border-t">
                    <Form
                        creationUrl={creationUrl}
                        toggleReload={toggleReload}
                    />
                </div>
            </DrawerContent>
        </Drawer>
    );
}
