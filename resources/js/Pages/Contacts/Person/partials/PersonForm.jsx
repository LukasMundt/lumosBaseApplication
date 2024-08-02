import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Input } from "@/Components/ui/input";
import { Card, CardContent } from "@/Components/ui/card";
import { ChevronsUpDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { toast } from "sonner";
import axios from "axios";
import AddressForm from "@/Pages/Address/AddressForm";
import React, { useEffect, useState } from "react";
import { Skeleton } from "@/Components/ui/skeleton";
import { Badge } from "@/Components/ui/badge";

const formSchema = z.object({
    title: z.string().max(255).optional().nullable(),
    prename: z.string().max(255).optional(),
    additional_prenames: z.string().max(255).optional().nullable(),
    lastname: z.string().max(255).optional(),
    gender: z.enum(["female", "male", "diverse", "not specified"]),
    phone: z
        .string()
        .refine((data) => {
            const inputSet = new Set(data.split(""));
            const alowedSet = new Set("0123456789+ ;".split(""));
            return inputSet.intersection(alowedSet).size === inputSet.size;
        }, "Mindestens ein Zeichen in diesem Feld ist nicht erlaubt.")
        .optional()
        .or(z.literal("")),
    email: z.string().email().max(255).optional().or(z.literal("")).nullable(),
    address: z.string().optional().or(z.literal("")),
});

export function PersonForm({
    domain,
    closeForm = null,
    getPersonData = null,
    nextStep = null,
    triggerReload = null,
    submitButtonText = "Erstellen und verbinden",
    personId = null,
}) {
    const [addressData, setAddressData] = React.useState([]);
    const [loading, setLoading] = useState(false);
    const [loaded, setLoaded] = useState(false);
    const [person, setPerson] = useState(null);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prename: person?.prename ?? "",
            additional_prenames: person?.additional_prenames ?? "",
            lastname: person?.lastname ?? "",
            title: person?.title ?? "",
            gender: person?.gender ?? "not specified",
            phone: "",
            email: person?.email ?? "",
            address: person?.address_id ?? "",
        },
        mode: "onChange",
    });

    useEffect(() => {
        if (!loaded && !loading && personId != null) {
            setLoading(true);
            axios
                .get(
                    route("api.v1.contacts.persons.show", {
                        domain: domain,
                        person: personId,
                    })
                )
                .then((response) => {
                    setPerson(response.data);
                    setLoading(false);
                    setLoaded(true);

                    Object.keys(form.getValues()).forEach((key) => {
                        // console.log(key);
                        if (key == "address") {
                            form.setValue(key, response.data[key].id);
                        } else {
                            form.setValue(key, response.data[key]);
                        }
                    });
                })
                .catch((error) => {
                    if (error?.response?.status == 403) {
                        toast.error("Die Aktion ist nicht erlaubt.");
                    } else {
                        toast.error("Etwas ist schiefgelaufen.");
                    }
                });
        }
    });

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

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        toast.promise(
            axios.post(
                personId != null
                    ? route("api.v1.contacts.persons.update", {
                          domain: domain,
                          person: personId,
                      })
                    : route("api.v1.contacts.persons.store", {
                          domain: domain,
                      }),
                values
            ),
            // .catch((error) => console.log(error)),
            {
                loading: "Wird gespeichert...",
                success: (response) => {
                    if (closeForm != null) {
                        closeForm(false);
                    }
                    if (nextStep != null) {
                        nextStep();
                    }
                    if (getPersonData != null) {
                        getPersonData(response.data, "person");
                    }
                    setAddressData([]);
                    triggerReload != null && triggerReload();
                    return "Person gespeichert";
                },
                error: (error) => {
                    handleServerError(error);
                    if (error.response.status === 500) {
                        return "Interner Serverfehler";
                    } else if (error.response.status === 403) {
                        return "Die Aktion ist nicht erlaubt.";
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
                <Collapsible>
                    {!loaded && loading && personId != null ? (
                        <div className="flex gap-3 mb-3">
                            <Skeleton className="w-full h-8 rounded-full" />
                            <Skeleton className="w-full h-8 rounded-full" />
                        </div>
                    ) : (
                        <div className="flex gap-3 mb-3">
                            <FormField
                                control={form.control}
                                name="prename"
                                render={({ field }) => (
                                    <FormItem className="grow">
                                        <FormLabel>Vorname</FormLabel>
                                        {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                                        <FormControl>
                                            <Input
                                                placeholder="Max"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="lastname"
                                render={({ field }) => (
                                    <FormItem className="grow">
                                        <FormLabel>Nachname</FormLabel>
                                        {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                                        <FormControl>
                                            <Input
                                                placeholder="Mustermann"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className="relative mt-8">
                                <div
                                    className={
                                        form.getFieldState(
                                            "additional_prenames"
                                        ).error == undefined &&
                                        form.getFieldState("title").error ==
                                            undefined
                                            ? "hidden"
                                            : ""
                                    }
                                >
                                    <div className="absolute h-4 w-4 rounded-full animate-ping -top-2 -right-2 bg-destructive"></div>
                                    <div className="absolute h-4 w-4 rounded-full opacity-75 -top-2 -right-2 bg-destructive"></div>
                                </div>

                                <CollapsibleTrigger asChild>
                                    <div className="shrink">
                                        <Button
                                            variant="secondary"
                                            size="icon"
                                            type="button"
                                        >
                                            <ChevronsUpDown className="w-5" />
                                        </Button>
                                    </div>
                                </CollapsibleTrigger>
                            </div>
                        </div>
                    )}
                    <CollapsibleContent className="space-y-3">
                        <FormField
                            control={form.control}
                            name="additional_prenames"
                            render={({ field }) => (
                                <FormItem className="grow">
                                    <FormLabel>Weitere Vornamen</FormLabel>
                                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                                    <FormControl>
                                        <Input placeholder="Max" {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Titel</FormLabel>
                                    {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
                                    <FormControl>
                                        <Input placeholder="Dr." {...field} />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </CollapsibleContent>
                </Collapsible>
                {!loaded && loading && personId != null ? (
                    <div className="flex gap-3 mb-3">
                        <Skeleton className="w-full h-8 rounded-full" />
                    </div>
                ) : (
                    <FormField
                        control={form.control}
                        name="gender"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Geschlecht</FormLabel>
                                {/* <FormDescription>
                    This is your public display name.
                  </FormDescription> */}
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
                                        <SelectItem value="not specified">
                                            Keine Angabe
                                        </SelectItem>
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
                    />
                )}
                {!loaded && loading && personId != null ? (
                    <div className="flex gap-3 mb-3">
                        <Skeleton className="w-full h-8 rounded-full" />
                    </div>
                ) : (
                    <Collapsible>
                        <div className="relative">
                            <div
                                className={
                                    form.getFieldState("email").error ==
                                        undefined &&
                                    form.getFieldState("phone").error ==
                                        undefined &&
                                    form.getFieldState("address").error ==
                                        undefined
                                        ? "hidden"
                                        : ""
                                }
                            >
                                <div className="absolute h-4 w-4 rounded-full animate-ping -top-2 -right-2 bg-destructive"></div>
                                <div className="absolute h-4 w-4 rounded-full opacity-75 -top-2 -right-2 bg-destructive"></div>
                            </div>
                            <CollapsibleTrigger asChild className="my-3">
                                <div className="flex justify-between cursor-pointer items-center">
                                    <span>
                                        Weitere Informationen hinzufügen
                                    </span>
                                    <Button
                                        variant="secondary"
                                        size="icon"
                                        type="button"
                                    >
                                        <ChevronsUpDown className="w-5" />
                                    </Button>
                                </div>
                            </CollapsibleTrigger>
                        </div>
                        <CollapsibleContent className="space-y-3">
                            <FormField
                                control={form.control}
                                name="phone"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Telefonnummer</FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="+49 1234 65498"
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
                                        <FormLabel>E-Mail</FormLabel>
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
                            <Card className="rounded-md">
                                <CardContent className="p-3 flex items-center justify-between">
                                    <div className="grid">
                                        <span className="text-lg">Adresse</span>
                                        <span
                                            className={
                                                "text-sm " +
                                                (addressData.length === 0
                                                    ? "hidden"
                                                    : "")
                                            }
                                        >
                                            {addressData.length === 0
                                                ? ""
                                                : addressData.street +
                                                  " " +
                                                  addressData.housenumber +
                                                  ", " +
                                                  addressData.zip_code +
                                                  " " +
                                                  addressData.city}
                                        </span>
                                    </div>
                                    <AddressForm
                                        getAddressData={(addressData) => {
                                            form.setValue(
                                                "address",
                                                addressData.id
                                            );
                                            setAddressData(addressData);
                                        }}
                                        mode={
                                            addressData.length === 0 &&
                                            form.getValues("address") === null
                                                ? "add"
                                                : "edit"
                                        }
                                    />
                                </CardContent>
                            </Card>
                        </CollapsibleContent>
                    </Collapsible>
                )}

                {!loaded && loading && personId != null ? (
                    <div className="flex gap-3 mb-3">
                        <Skeleton className="w-56 h-8 rounded-full" />
                    </div>
                ) : (
                    ""
                )}
                <Button type="submit">{submitButtonText}</Button>
            </form>
        </Form>
    );
}
