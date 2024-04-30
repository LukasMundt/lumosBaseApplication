import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Plus } from "lucide-react";
import { Card, CardContent } from "@/Components/ui/card";
import PersonSelectOrCreate from "./PersonSelectOrCreate";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { ScrollArea } from "@/Components/ui/scroll-area";
import Create_Form from "@/Pages/Ci/Akquise/partials/Create_Form";

const formSchema = z.object({
    name: z.string().min(2).max(300),
    website: z.string().url().optional().or(z.literal("")),
    phone: z.string().optional(),
    email: z.string().email().optional().or(z.literal("")),
});

export function OrganisationForm({}) {
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            website: "",
            phone: "",
            email: "",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                            <FormControl>
                                <Input placeholder="Muster GmbH" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Card>
                    <CardContent className="p-3 flex items-center justify-between">
                        <span>Ansprechpartner</span>
                        <PersonSelectOrCreate />
                    </CardContent>
                </Card>
                <FormField
                    control={form.control}
                    name="website"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Website</FormLabel>
                            {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                            <FormControl>
                                <Input placeholder="muster.de" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Telefon</FormLabel>
                            {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                            <FormControl>
                                <Input
                                    placeholder="+49 1234 56789"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                            <FormControl>
                                <Input
                                    placeholder="max@muster.de"
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Card>
                    <CardContent className="p-3 flex items-center justify-between">
                        <span>Adresse</span>
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button size="icon" variant="outline">
                                    <Plus className="w-5" />
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Adresse verbinden</DialogTitle>
                                </DialogHeader>
                                <ScrollArea className="h-96">
                                    <Create_Form className="m-3" />
                                </ScrollArea>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>
                {/* <div className="flex items-center justify-between"></div> */}
                {/* <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Geschlecht</FormLabel>
                            <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                            >
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Wähle ein Geschlecht" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="female">
                                        weiblich
                                    </SelectItem>
                                    <SelectItem value="male">
                                        männlich
                                    </SelectItem>
                                    <SelectItem value="diverse">
                                        divers
                                    </SelectItem>
                                </SelectContent>
                            </Select>

                            <FormMessage />
                        </FormItem>
                    )}
                /> */}
                <Button type="submit">Erstellen und verbinden</Button>
            </form>
        </Form>
    );
}
