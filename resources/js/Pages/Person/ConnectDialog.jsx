import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import React from "react";
import { PersonForm } from "./partials/PersonForm";
import { GroupForm } from "./partials/GroupForm";
import { OrganisationForm } from "./partials/OrganisationForm";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { useEffect } from "react";

export default function ConnectDialog({
    domain,
    getContactData = null,
    thisModel,
    button = null,
    toggleReload = null,
}) {
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(1);
    const [contact, setContact] = React.useState(null);

    const nextStep = () => {
        setStep(2);
    };

    const handleSavedForm = (data) => {
        setContact(data);
        // console.log(data);
    };

    const handleSavedConnection = () => {
        setStep(1);
        setContact({});
        if (toggleReload != null) {
            toggleReload();
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {button === null ? <Button>Kontakt verknüpfen</Button> : button}
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Kontakt verknüpfen</DialogTitle>
                    {/* <DialogDescription>
                                Hier kann eine Person, Personengruppe oder
                                Organisation .
                            </DialogDescription> */}
                </DialogHeader>
                {step === 1 ? (
                    <Tabs defaultValue="person" className="w-full">
                        <TabsList className="grid w-full grid-cols-1 mb-6">
                            <TabsTrigger value="person">Person</TabsTrigger>
                            {/* <TabsTrigger value="group">
                                Personengruppe
                            </TabsTrigger>
                            <TabsTrigger value="organisation">
                                Unternehmen
                            </TabsTrigger> */}
                        </TabsList>
                        <TabsContent value="person">
                            <ScrollArea className="h-96 px-3">
                                <PersonForm
                                    domain={domain}
                                    nextStep={nextStep}
                                    getPersonData={handleSavedForm}
                                />
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="group">
                            <ScrollArea className="h-96 px-3">
                                <GroupForm />
                            </ScrollArea>
                        </TabsContent>
                        <TabsContent value="organisation">
                            <ScrollArea className="h-96 px-3">
                                <OrganisationForm />
                            </ScrollArea>
                        </TabsContent>
                    </Tabs>
                ) : (
                    <RelationForm
                        thisModel={thisModel}
                        contactModel={contact}
                        setOpen={setOpen}
                        domain={domain}
                        handleSavedConnection={handleSavedConnection}
                    />
                )}
            </DialogContent>
        </Dialog>
    );
}

const formSchema = z.object({
    type: z.string().max(255).optional(),
    this_id: z.string(),
    this_type: z.string(),
    contact_id: z.string(),
    contact_type: z.string(),
});

function RelationForm({
    thisModel = null,
    contactModel,
    setOpen,
    domain,
    handleSavedConnection,
}) {
    useEffect(() => {
        if (contactModel != null) {
            form.setValue("contact_id", contactModel.id);
            form.setValue("contact_type", contactModel.type);
        }

        // console.log(contactModel);
    }, [contactModel]);

    // console.log(contactModel);

    async function handleServerError(error) {
        // console.log(error);
        const errors = error.response.data.errors;

        if (errors) {
            Object.keys(errors).map((value) => {
                var message = "";
                errors[value].map((errorMessage) => {
                    message = message + errorMessage;
                });
                form.setError(value, {
                    type: "costum",
                    message: message.trim(),
                });
            });
        }
    }

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            type: "",
            this_id: thisModel.id,
            this_type: thisModel.type,
            contact_id: "",
            contact_type: "",
        },
        mode: "onChange",
    });

    function onSubmit(values) {
        // toast.success("Person verknüpft.");
        // console.log(values);

        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        toast.promise(
            axios.post(
                route("api.v1.contacts.connect", { domain: domain }),
                values
            ),
            //     // .catch((error) => console.log(error)),
            {
                loading: "Wird gespeichert...",
                success: (response) => {
                    // console.log(response);
                    setOpen(false);
                    form.reset();
                    handleSavedConnection();
                    return "Person verknüpft";
                },
                error: (error) => {
                    // console.log(error);
                    handleServerError(error);
                    if (error.response.status === 500) {
                        return "Interner Serverfehler";
                    }
                    return "Fehler";
                },
            }
        );
    }
    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 mx-1"
            >
                <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                        <FormItem className="grow">
                            <FormLabel>Verbindung</FormLabel>
                            <FormControl>
                                <Input placeholder="Nachbar" {...field} />
                            </FormControl>

                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Verbinden</Button>
            </form>
        </Form>
    );
}
