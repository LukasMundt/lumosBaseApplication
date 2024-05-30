import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/Components/ui/button";
import { useState } from "react";
import { useEffect } from "react";
import { ArrowBigRight, UploadCloud } from "lucide-react";
import { Textarea } from "@/Components/ui/textarea";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/Components/ui/card";

const formSchema = z.object({
    logo: z
        .any()
        .refine(
            (files) => {
                return Array.from(files).every((file) => file instanceof File);
            },
            { message: "Datei erwartet." }
        )
        .refine(
            (files) =>
                Array.from(files).every((file) =>
                    ["jpg", "jpeg", "png"].includes(file.type.toLowerCase())
                ),
            "Nur diese Dateitypen sind erlaubt: .jpg, .jpeg, .png"
        )
        .refine((files) =>
            Array.from(files).every((file) => file.size <= 10_000),"Die Datei darf maximal 10 MB groß sein."
        )
        .optional(),
    // .refine(
    //     (files) =>
    //         Array.from(files).every((file) => {
    //             file.size < 3;
    //         }),
    //     "Nur Größe bis 3 erlaubt."
    // ),
    sender: z.string().max(255).min(2),
    footer: z.string(),
});

export default function Settings({ auth, domain, settings }) {
    const [logoData, setLogoData] = useState(null);
    const [randForLogoRefresh, setRandForLogoRefresh] = useState(0);

    const triggerReload = () => {
        router.reload({ only: ["settings"] });
        form.resetField("logo");
        setLogoData(null);
        setRandForLogoRefresh(Math.random());
    };

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            sender: settings.sender ?? "",
            logo: [],
            footer: settings.footer ?? "",
        },
    });

    async function handleServerError(error) {
        // console.log(error);
        const errors = error.response.data.errors;

        if (errors) {
            Object.keys(errors).map((value) => {
                var message = "";
                errors[value].map((errorMessage) => {
                    message = message + " " + errorMessage;
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

        // console.log(values);
        toast.promise(
            axios.post(
                route("api.v1.campaigns.settings.store", {
                    domain: domain,
                }),
                values,
                { headers: { "Content-Type": "multipart/form-data" } }
            ),
            {
                loading: "Wird gespeichert...",
                success: () => {
                    triggerReload();
                    return "Änderungen gespeichert.";
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
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between w-full">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Einstellungen
                    </h2>
                    <Button type="submit" form="settings-form">
                        Änderung speichern
                    </Button>
                </div>
            }
        >
            <Head title="Einstellungen" />

            <main>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8 flex flex-col h-full"
                        id="settings-form"
                    >
                        <FormField
                            control={form.control}
                            name="sender"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Absender</FormLabel>
                                    {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                    <FormControl>
                                        <Input
                                            placeholder="Max Mustermann | Musterstraße 1 | 12345 Musterstadt"
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="logo"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Logo
                                        <div className="relative flex flex-col items-center justify-center w-full py-6 border-2 border-gray-500 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 dark:bg-gray-700 dark:hover:bg-gray-800">
                                            <div className=" text-center">
                                                <div className="flex">
                                                    <div className="bg-gray-300 p-2 rounded-md w-20 mx-auto self-center">
                                                        {/* <UploadCloud size={20} /> */}
                                                        <img
                                                            src={route(
                                                                "team.logo",
                                                                {
                                                                    domain: domain,
                                                                    rand: randForLogoRefresh,
                                                                }
                                                            )}
                                                            className="w-full"
                                                        />
                                                    </div>
                                                    {logoData && (
                                                        <>
                                                            <div className="self-center">
                                                                <ArrowBigRight
                                                                    size={40}
                                                                />
                                                            </div>

                                                            <div className="bg-gray-300 p-2 rounded-md w-20 mx-auto self-center">
                                                                {/* <UploadCloud size={20} /> */}
                                                                <img
                                                                    src={
                                                                        logoData
                                                                    }
                                                                    className="w-full"
                                                                />
                                                            </div>
                                                        </>
                                                    )}
                                                </div>

                                                <p className="mt-2 text-sm ">
                                                    <span className="font-semibold">
                                                        Dateien hineinziehen
                                                    </span>
                                                </p>
                                                <p className="text-xs ">
                                                    Click to upload files
                                                    &#40;files should be under
                                                    10 MB &#41;
                                                </p>
                                                {/* {form.getFieldState("logo")} */}
                                            </div>
                                        </div>
                                    </FormLabel>
                                    {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                    <FormControl>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                setLogoData(
                                                    URL.createObjectURL(
                                                        e.target.files[0]
                                                    )
                                                );
                                                form.setValue(
                                                    "logo",
                                                    e.target.files[0]
                                                );
                                            }}
                                            className="hidden"
                                            // onValueChange={}
                                            // onValueChange={(event) => {
                                            //     console.log(event.target);
                                            //     field.setValue(
                                            //         event.target.files[0]
                                            //     );
                                            //     // field.onChange(
                                            //     //     event.target?.files?.[0] ??
                                            //     //         undefined
                                            //     // );
                                            // }}
                                            // placeholder="Max Mustermann | Musterstraße 1 | 12345 Musterstadt"
                                            // {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="footer"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Fußzeile</FormLabel>
                                    {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                    <FormControl>
                                        <Textarea
                                            rows={3}
                                            placeholder="Musterfirma GmbH | Alle Rechte vorbehalten."
                                            {...field}
                                        />
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <Card>
                            <CardHeader>
                                Anrede
                                <CardDescription>
                                    Diese Anrede wird in der Pdf angezeigt. ({" "}
                                    <span>//anrede//</span> wird ersetzt)
                                </CardDescription>
                            </CardHeader>
                            {/* TODO: Error message anzeigen */}

                            <CardContent className="grid gap-3 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="salutation_not_specified"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Keine Angabe</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sehr geehrte Damen und Herren"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="salutation_female"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Weiblich</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sehr geehrte Frau //nachname//"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="salutation_male"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Männlich</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sehr geehrter Herr //nachname//"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <FormField
                                    control={form.control}
                                    name="salutation_diverse"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Divers</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder="Sehr geehrt* //nachname//"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </CardContent>
                        </Card>
                    </form>
                </Form>
            </main>
        </AuthenticatedLayout>
    );
}
