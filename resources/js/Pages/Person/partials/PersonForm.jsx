import { setErrorMap, z } from "zod";
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
import { Card, CardContent } from "@/Components/ui/card";
import Create_Form from "@/Pages/Ci/Akquise/partials/Create_Form";
import { ChevronsUpDown } from "lucide-react";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { toast } from "sonner";
import axios from "axios";
import AddressForm from "@/Pages/Address/AddressForm";
import React from "react";

const formSchema = z.object({
    title: z.string().max(255).optional(),
    prename: z.string().max(255).optional(),
    additional_prenames: z.string().max(255).optional(),
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
    email: z.string().email().max(255).optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
});

export function PersonForm({
    domain,
    closeForm = null,
    getPersonData = null,
    nextStep = null,
}) {
    const [addressData, setAddressData] = React.useState([]);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prename: "",
            additional_prenames: "",
            lastname: "",
            title: "",
            gender: "not specified",
            phone: "",
            email: "",
            address: "",
        },
        mode: "onChange",
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
                route("api.v1.contacts.persons.store", { domain: domain }),
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
                    return "Person gespeichert";
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
        // console.log(values);
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-5 mx-1"
            >
                <Collapsible>
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
                                        <Input placeholder="Max" {...field} />
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
                        <CollapsibleTrigger asChild>
                            <div className="shrink mt-8">
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
                <Collapsible>
                    <CollapsibleTrigger asChild className="my-3">
                        <div className="flex justify-between cursor-pointer items-center">
                            <span>Weitere Informationen hinzufügen</span>
                            <Button
                                variant="secondary"
                                size="icon"
                                type="button"
                            >
                                <ChevronsUpDown className="w-5" />
                            </Button>
                        </div>
                    </CollapsibleTrigger>
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
                                        addressData.length === 0
                                            ? "add"
                                            : "edit"
                                    }
                                />
                            </CardContent>
                        </Card>
                    </CollapsibleContent>
                </Collapsible>

                <Button type="submit">Erstellen und verbinden</Button>
            </form>
        </Form>
    );
}
