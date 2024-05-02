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
import { ArrowRight, LoaderCircleIcon, Plus, Search, User } from "lucide-react";
import axios from "axios";
import { Card, CardContent } from "@/Components/ui/card";

export default function ConnectDialog({
    domain,
    getContactData = null,
    thisModel,
    button = null,
    toggleReload = null,
}) {
    const [open, setOpen] = React.useState(false);
    const [step, setStep] = React.useState(0);
    const [contact, setContact] = React.useState(null);

    const nextStep = () => {
        setStep(2);
    };

    const handleSavedForm = (data) => {
        setContact(data);
        console.log(data);
    };

    const handleSavedConnection = () => {
        setStep(1);
        setContact({});
        if (toggleReload != null) {
            toggleReload();
        }
    };

    const setOpenAndReset = (value) => {
        setOpen(value);
        setStep(0);
    };

    return (
        <Dialog open={open} onOpenChange={setOpenAndReset}>
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
                {step === 0 ? (
                    <SelectContact
                        domain={domain}
                        setStep={setStep}
                        getContactData={handleSavedForm}
                    />
                ) : step === 2 ? (
                    <RelationForm
                        thisModel={thisModel}
                        contactModel={contact}
                        setOpen={setOpen}
                        domain={domain}
                        handleSavedConnection={handleSavedConnection}
                    />
                ) : (
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

function SelectContact({ setStep, getContactData = null, domain }) {
    const [loading, setLoading] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [contacts, setContacts] = React.useState([]);

    const handleSelection = (index, type) => {
        if (getContactData === null) {
            console.error(
                "Function to send the contact data to parent component not provided."
            );
        }
        if (type === "person") {
            getContactData(contacts.persons[index]);
            setStep(2);
        }
    };

    const handleClick = () => {
        setLoading(true);
        axios
            .get(
                route("api.v1.contacts.index", {
                    domain: domain,
                    search: search,
                })
            )
            .catch((error) => console.log(error))
            .then((response) => {
                setContacts(response.data);
                setLoading(false);
            });
        console.log("request");
        // console.log(e.target.value);
    };

    const createNew = () => {
        setStep(1);
    };

    return (
        <>
            <div className="flex gap-3">
                <Input
                    title="Kontakt suchen"
                    onChange={(e) => setSearch(e.target.value)}
                    name="search"
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            handleClick();
                        }
                    }}
                />
                <Button onClick={handleClick} size="icon">
                    <Search className="w-6 h-6 mx-2" />
                </Button>
            </div>
            <ScrollArea className="h-32">
                {loading ? (
                    <div className="flex justify-center h-32 items-center">
                        <LoaderCircleIcon className="animate-spin" />
                    </div>
                ) : (
                    <ul className="grid gap-3">
                        {contacts.persons
                            ? contacts.persons.map((person, index) => (
                                  <li key={person.id}>
                                      <Card
                                          className="hover:dark:border-white hover:border-black rounded-md cursor-pointer group"
                                          type="button"
                                          id={index}
                                          onClick={() =>
                                              handleSelection(index, "person")
                                          }
                                      >
                                          <CardContent className="p-3 flex justify-between gap-3">
                                              <User />
                                              <span className="grow">
                                                  {person.name}
                                              </span>
                                              <ArrowRight className="invisible group-hover:visible ease-in"/>
                                          </CardContent>
                                      </Card>
                                  </li>
                              ))
                            : ""}
                    </ul>
                )}
                {loading ? (
                    ""
                ) : (
                    <div className="mt-3">
                        <Card
                            className="hover:dark:border-white hover:border-black rounded-md cursor-pointer"
                            type="button"
                            onClick={createNew}
                        >
                            <CardContent className="p-3 flex justify-between gap-3">
                                <User />
                                <span className="grow">Neu erstellen</span>
                                <Plus />
                            </CardContent>
                        </Card>
                    </div>
                )}
            </ScrollArea>
        </>
    );
}
