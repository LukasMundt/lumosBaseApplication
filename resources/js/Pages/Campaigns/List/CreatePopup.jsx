import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/Components/ui/form";
import { Checkbox } from "@/Components/ui/checkbox";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useState } from "react";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import LoadingIcon from "@/Components/LoadingIcon";
import ListForm from "./partials/ListForm";

const formSchema = z.object({
    name: z.string().min(2).max(255),
    filtersDistricts: z.array(z.string()).optional(),
    ignoreDistricts: z.boolean(),
    filtersZipCodes: z.array(z.string()).optional(),
    ignoreZipCodes: z.boolean(),
    filtersStreets: z.array(z.string()).optional(),
    ignoreStreets: z.boolean(),
});

export default function CreatePopup({ domain, toggleReload = null }) {
    const [open, setOpen] = useState(false);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            filtersDistricts: [],
            ignoreDistricts: false,
            filtersZipCodes: [],
            ignoreZipCodes: true,
            filtersStreets: [],
            ignoreStreets: true,
        },
    });

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Liste erstellen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Erstelle eine Liste</DialogTitle>
                </DialogHeader>
                <ListForm
                    form={form}
                    toggleReload={toggleReload}
                    open={open}
                    setOpen={setOpen}
                    domain={domain}
                    buttonText="Liste erstellen"
                />
            </DialogContent>
        </Dialog>
    );
}
