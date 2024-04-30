import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Plus } from "lucide-react";
import PersonSelectPlain from "./PersonSelectPlain";
import { PersonForm } from "./PersonForm";
import { ScrollArea } from "@/Components/ui/scroll-area";

export default function ({
    onlyCreate = false,
    title = "Auswählen oder neu erstellen",
    command = false,
}) {
    return (
        <Dialog>
            <DialogTrigger asChild>
                {command ? (
                    <div className="p-2 flex gap-1 items-center cursor-pointer">
                        <Plus className="mr-2 h-4 w-4" />
                        <span>Neu erstellen</span>
                    </div>
                ) : (
                    <Button size="icon" variant="outline" title={title}>
                        <Plus className="w-5" />
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>
                        {onlyCreate
                            ? "Neue Person erstellen"
                            : "Neue Person auswählen oder erstellen"}
                    </DialogTitle>
                    {onlyCreate ? (
                        ""
                    ) : (
                        <DialogDescription>
                            Wähle eine Person aus oder erstell eine Neue.
                        </DialogDescription>
                    )}
                </DialogHeader>

                {onlyCreate ? (
                    <ScrollArea className="h-96">
                        <PersonForm />
                    </ScrollArea>
                ) : (
                    <Tabs defaultValue="search" className="w-full">
                        <TabsList className="grid w-full grid-cols-2 mb-6">
                            <TabsTrigger value="search">Suchen</TabsTrigger>
                            <TabsTrigger value="create">Erstellen</TabsTrigger>
                        </TabsList>
                        <TabsContent value="search">
                            <ScrollArea className="h-96">
                                <PersonSelectPlain showCreateButton={false} />
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="create">
                            <ScrollArea className="h-96">
                                <PersonForm />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                )}
            </DialogContent>
        </Dialog>
    );
}
