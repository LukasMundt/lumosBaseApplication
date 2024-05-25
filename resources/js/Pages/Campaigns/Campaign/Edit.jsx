import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import grapesjs from "grapesjs";
import GjsEditor, { useEditor } from "@grapesjs/react";
import {
    ArrowBigRight,
    CheckIcon,
    CircleHelp,
    Eye,
    Monitor,
    RefreshCw,
    Smartphone,
} from "lucide-react";
import { Head, router } from "@inertiajs/react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import {
    Form,
    FormControl,
    FormDescription,
    FormDescriptionPopover,
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
import { useMediaQuery } from "@uidotdev/usehooks";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import { Badge } from "@/Components/ui/badge";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { CaretSortIcon } from "@radix-ui/react-icons";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import LoadingIcon from "@/Components/LoadingIcon";
import "../../../../../node_modules/grapesjs/dist/css/grapes.min.css";
import "../../../../css/grapes.css";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
} from "@/Components/ui/card";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/Components/ui/alert-dialog";

const formSchema = z.object({
    name: z.string().min(2).max(255),
    content: z.string(),
    date_for_print: z.string().min(1),
    list_id: z.string().max(26),
    salutation_not_specified: z.string().max(255).optional(),
    salutation_male: z.string().max(255).optional(),
    salutation_female: z.string().max(255).optional(),
    salutation_diverse: z.string().max(255).optional(),
    line1_no_owner: z.string().max(40).optional(),
    salutation_no_owner: z.string().max(255).optional(),
});

export default function Edit({ auth, domain, campaign }) {
    const [content, setContent] = useState(null);
    const isDesktop = useMediaQuery("(min-width: 1000px)");
    const [lists, setLists] = useState(null);

    useEffect(() => {
        if (content) {
            form.setValue("content", content, { shouldDirty: true });
        }
    }, [content]);

    const triggerReload = () => {
        router.reload({ only: ["campaign"] });
    };

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: campaign.name,
            content: campaign.content,
            date_for_print: campaign.date_for_print,
            list_id: campaign.list_id ?? "",
            line1_no_owner: campaign.line1_no_owner ?? "",
            salutation_no_owner: campaign.salutation_no_owner ?? "",
        },
    });

    async function handleServerError(error) {
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
    /**
     * @param {String[]} fields
     */
    function howManyErrors(fields) {
        var count = 0;
        Array.from(fields).forEach((field) => {
            count += form.getFieldState(field).error ? 1 : 0;
        });
        return count;
    }

    function loadLists(force = false) {
        if (!lists || force) {
            axios
                .get(route("api.v1.campaigns.lists.index", { domain: domain }))
                .then((response) => {
                    // console.log(response);
                    setLists({ last_load: Date.now(), data: response.data });
                })
                .catch((error) =>
                    toast.error("Fehler beim Laden der Listen aufgetreten.")
                );
        }
    }

    function sendCampaign() {
        axios
            .patch(
                route("api.v1.campaigns.campaigns.send", {
                    campaign: campaign.id,
                    domain: domain,
                })
            )
            .then((response) => {
                // console.log(response);
                triggerReload();
                form.clearErrors();
            })
            .catch((error) => {
                handleServerError(error);
                // console.log(error);
            });
    }

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // if (content) {
        //     form.setValue("content", content);
        // }

        // console.log(values);
        toast.promise(
            axios.post(
                route("api.v1.campaigns.campaigns.update", {
                    domain: domain,
                    campaign: campaign.id,
                }),
                values
            ),
            {
                loading: "Wird gespeichert...",
                success: () => {
                    triggerReload();
                    return "Änderungen gespeichert.";
                },
                error: (error) => {
                    console.log(error);
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
                <div className="w-full flex justify-between">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        {"Kampagne: " + form.watch("name")}
                    </h2>
                    <div className="flex gap-3">
                        {!campaign.send && (
                            <a
                                target="_blank"
                                href={route("campaigns.campaigns.preview", {
                                    domain: domain,
                                    campaign: campaign.id,
                                })}
                            >
                                <Button title="Vorschau" size="icon">
                                    <Eye size={20} />
                                </Button>
                            </a>
                        )}
                        {!campaign.send && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button>Abschließen</Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            Sind Sie sicher?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Nachdem Sie die Kampagne
                                            abgeschlossen haben können sie keine
                                            Änderungen mehr vornehmen!
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        <AlertDialogCancel>
                                            Abbrechen
                                        </AlertDialogCancel>
                                        <AlertDialogAction asChild>
                                            <Button
                                                type="button"
                                                onClick={sendCampaign}
                                            >
                                                Abschließen
                                            </Button>
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}

                        {campaign.send ? (
                            <a
                                href={route("campaigns.campaigns.download", {
                                    domain: domain,
                                    campaign: campaign.id,
                                })}
                            >
                                <Button>Download</Button>
                            </a>
                        ) : (
                            ""
                        )}

                        {!campaign.send && (
                            <Button
                                type="submit"
                                form="campaign-form"
                                disabled={!form.formState.isDirty}
                            >
                                Alle Änderung speichern
                            </Button>
                        )}
                        {!campaign.send && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button size="icon">
                                        <CircleHelp size={20} />
                                    </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>
                                            An wen wird diese Kampagne gesendet?
                                        </AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Diese Kampagne wird an folgende
                                            Parteien gesendet:
                                            <ul className="list-disc list-outside mt-5 ms-9">
                                                <li>
                                                    zugeordnete Eigentümer
                                                    (entweder an die Adresse des
                                                    Projektes oder wenn
                                                    vorhanden die Wohnadresse)
                                                </li>
                                                <li>
                                                    Nachbarn (nur, wenn eine
                                                    Wohnadresse und ein Nachname
                                                    angegeben ist)
                                                </li>
                                                <li>
                                                    generell die Eigentümer,
                                                    wenn keine Person verknüpft
                                                    ist
                                                </li>
                                            </ul>
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                        {/* <AlertDialogCancel>
                                            Abbrechen
                                        </AlertDialogCancel> */}
                                        <AlertDialogAction>
                                            Schließen
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            </AlertDialog>
                        )}
                    </div>
                </div>
            }
        >
            <Head title={campaign.name} />
            <Tabs
                defaultValue="content"
                className="w-full h-full flex flex-col"
            >
                <TabsList className="w-full">
                    <TabsTrigger value="content" className="w-full">
                        Inhalt
                    </TabsTrigger>
                    <TabsTrigger value="settings" className="w-full">
                        Weitere Einstellungen
                        <Badge
                            variant="destructive"
                            className={
                                "ml-3 animate-pulse " +
                                (howManyErrors([
                                    "date_for_print",
                                    "salutations",
                                    "list_id",
                                    "line1_no_owner",
                                    "salutation_no_owner",
                                ]) == 0
                                    ? "hidden"
                                    : "")
                            }
                        >
                            {howManyErrors([
                                "date_for_print",
                                "salutations",
                                "list_id",
                                "line1_no_owner",
                                "salutation_no_owner",
                            ])}
                        </Badge>
                    </TabsTrigger>
                </TabsList>
                <TabsContent value="content" className="h-full">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 flex flex-col h-full"
                            id="campaign-form"
                        >
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                        <FormControl>
                                            <Input
                                                placeholder="Beispiel Kampagne"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {isDesktop ? (
                                <FormField
                                    control={form.control}
                                    name="content"
                                    className="grow"
                                    render={({ field }) => (
                                        <FormItem className="grow">
                                            {/* <FormLabel>Name</FormLabel> */}
                                            {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                            <FormControl>
                                                <Editor
                                                    setContent={setContent}
                                                    projectData={
                                                        campaign.content
                                                    }
                                                    // handleChange={(value) =>
                                                    //     form.setValue("content", value)
                                                    // }
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ) : (
                                <div className="h-full w-full relative flex-col items-center justify-center py-6 border-2 border-gray-500 border-dashed rounded-lg bg-gray-50  dark:bg-gray-700 grid content-center">
                                    <div className="flex justify-center">
                                        <Smartphone size={40} />
                                        <ArrowBigRight size={40} />
                                        <Monitor size={40} />
                                    </div>
                                    <span className="text-center p-3">
                                        Bitte wechsle auf ein größeres Gerät um
                                        den Inhalt der Kampagne zu bearbeiten.
                                    </span>
                                </div>
                            )}
                        </form>
                    </Form>
                </TabsContent>
                <TabsContent value="settings">
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            className="space-y-8 flex flex-col h-full"
                            id="campaign-form"
                        >
                            <FormField
                                control={form.control}
                                name="date_for_print"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Datum</FormLabel>
                                        {/* <FormDescription>
                                    Dies ist der Name der Liste. Er wird überall
                                    angezeigt, wo die Liste verwendet wird.
                                </FormDescription> */}
                                        <FormControl>
                                            <Input
                                                placeholder={new Date().toLocaleDateString()}
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="list_id"
                                render={({ field }) => (
                                    <FormItem className="flex flex-col">
                                        <FormLabel>Liste / Verteiler</FormLabel>
                                        <div className="flex gap-3">
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <FormControl>
                                                        <Button
                                                            variant="outline"
                                                            role="combobox"
                                                            className={cn(
                                                                "w-[200px] justify-between",
                                                                !field.value &&
                                                                    "text-muted-foreground"
                                                            )}
                                                            onClick={() =>
                                                                loadLists()
                                                            }
                                                        >
                                                            {/* TODO: load list that is currently related in the lists table */}
                                                            {field.value &&
                                                            lists
                                                                ? lists?.data?.find(
                                                                      (list) =>
                                                                          list.id ===
                                                                          field.value
                                                                  )?.name
                                                                : field.value
                                                                ? campaign.list
                                                                      .name
                                                                : "Liste"}
                                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                        </Button>
                                                    </FormControl>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-[200px] p-0">
                                                    <Command loop>
                                                        <CommandInput
                                                            placeholder="Liste suchen..."
                                                            className="h-9"
                                                        />
                                                        <CommandList>
                                                            {lists ? (
                                                                <CommandEmpty>
                                                                    Keine Liste
                                                                    gefunden.
                                                                </CommandEmpty>
                                                            ) : (
                                                                <CommandEmpty>
                                                                    <div className="w-full flex justify-center items-center">
                                                                        <LoadingIcon />
                                                                    </div>
                                                                </CommandEmpty>
                                                            )}

                                                            <CommandGroup>
                                                                {lists?.data &&
                                                                    lists.data.map(
                                                                        (
                                                                            list
                                                                        ) => (
                                                                            <CommandItem
                                                                                value={
                                                                                    list.name
                                                                                }
                                                                                key={
                                                                                    list.id
                                                                                }
                                                                                onSelect={() => {
                                                                                    form.setValue(
                                                                                        "list_id",
                                                                                        list.id,
                                                                                        {
                                                                                            shouldDirty: true,
                                                                                        }
                                                                                    );
                                                                                }}
                                                                            >
                                                                                {
                                                                                    list.name
                                                                                }
                                                                                <CheckIcon
                                                                                    className={cn(
                                                                                        "ml-auto h-4 w-4",
                                                                                        list.id ===
                                                                                            field.value
                                                                                            ? "opacity-100"
                                                                                            : "opacity-0"
                                                                                    )}
                                                                                />
                                                                            </CommandItem>
                                                                        )
                                                                    )}
                                                            </CommandGroup>
                                                        </CommandList>
                                                    </Command>
                                                </PopoverContent>
                                            </Popover>
                                            <Button
                                                type="button"
                                                size="icon"
                                                variant="secondary"
                                                onClick={() => loadLists(true)}
                                                title="Listen neu laden"
                                                aria-label="Listen neu laden"
                                            >
                                                <RefreshCw size={20} />
                                            </Button>
                                        </div>
                                        {/* <FormDescription>
                                            This is the language that will be
                                            used in the dashboard.
                                        </FormDescription> */}
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            {/* TODO: anzeigen, ob es einstellungen für das gesamte team gibt, und sagen, dass die hier für diesen serienbrief überschrieben werden können -> auch änderungen in settings (voreinstellung für die ganze app auch vorhanden) */}
                            <Card>
                                <CardHeader>
                                    Anrede
                                    <CardDescription>
                                        Diese Anrede wird in der PDF angezeigt.
                                        Achtung: Diese Anrede wird ggf. auch für
                                        Nachbarn benutzt. ({" "}
                                        <span>//anrede//</span> wird ersetzt)
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="grid gap-3 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="salutation_not_specified"
                                        on
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Keine Angabe
                                                </FormLabel>
                                                <FormDescription>
                                                    //nachname// wird durch den
                                                    tatsächlichen Nachnamen
                                                    ersetzt.
                                                </FormDescription>
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
                                                <FormDescription>
                                                    //nachname// wird durch den
                                                    tatsächlichen Nachnamen
                                                    ersetzt.
                                                </FormDescription>
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
                                                <FormDescription>
                                                    //nachname// wird durch den
                                                    tatsächlichen Nachnamen
                                                    ersetzt.
                                                </FormDescription>
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
                                                <FormDescription>
                                                    //nachname// wird durch den
                                                    tatsächlichen Nachnamen
                                                    ersetzt.
                                                </FormDescription>
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

                            <FormField
                                control={form.control}
                                name="line1_no_owner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            1. Addresszeile (kein Eigentümer)
                                            <FormDescriptionPopover>
                                                Diese Zeile wird im Addressblock
                                                angezeigt, wenn der Eigentümer
                                                nicht verknüpft ist oder für
                                                diesen kein Nachname angegeben
                                                ist.
                                            </FormDescriptionPopover>
                                        </FormLabel>

                                        <FormControl>
                                            <Input
                                                placeholder="An die Eigentümer"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="salutation_no_owner"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>
                                            Anrede (kein Eigentümer)
                                            <FormDescriptionPopover>
                                                Diese Anrede wird verwendet,
                                                wenn kein Eigentümer mit dem
                                                Projekt verknüpft ist. Der
                                                Eigentümer wird auch mit dieser
                                                Anrede angesprochen, wenn für
                                                ihn kein Nachname hinterlegt
                                                ist. Da meistens für eine
                                                Mehrzahl der Projekte keine
                                                Eigentümer gespeichert sind wird
                                                diese Anrede in der Regel häufig
                                                verwendet.
                                            </FormDescriptionPopover>
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                placeholder="An die Eigentümer"
                                                {...field}
                                            />
                                        </FormControl>

                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </form>
                    </Form>
                </TabsContent>
            </Tabs>
        </AuthenticatedLayout>
    );
}

function Editor({ setContent, projectData }) {
    const inlineStorage = (editor) => {
        editor.Storage.add("inline", {
            // load() {
            //     return JSON.parse(projectDataEl.value || "{}");
            // },
            store(data) {
                setContent(`<html>
              <head>
                <style>${editor.getCss()}</style>
              </head>
              ${editor.getHtml()}
            <html>`);
            },
        });
    };

    return (
        <>
            <GjsEditor
                // Pass the core GrapesJS library to the wrapper (required).
                // You can also pass the CDN url (eg. "https://unpkg.com/grapesjs")
                grapesjs={grapesjs}
                // onChange={handleChange(editor ? editor.getHtml() : "")}
                // Load the GrapesJS CSS file asynchronously from URL.
                // This is an optional prop, you can always import the CSS directly in your JS if you wish.
                // grapesjsCss="https://unpkg.com/grapesjs/dist/css/grapes.min.css" // is imported localy
                // GrapesJS init options
                options={{
                    height: "100%",

                    storageManager: {
                        type: "inline",
                    },
                    projectData: {
                        pages: [
                            {
                                component: projectData,
                            },
                        ],
                    },
                    cssIcons: "",
                    showDevices: false,
                    selectorManager: false,
                    jsInHtml: false,
                    styleManager: {
                        custom: true,
                        sectors: [
                            {
                                name: "Generell",
                                open: true,
                                properties: [
                                    {
                                        extend: "width",
                                        units: ["%", "px"],
                                        label: "Breite",
                                        type: "slider",
                                        default: "100%",
                                        min: 0,
                                    },
                                    {
                                        extend: "height",
                                        units: ["px"],
                                        label: "Höhe",
                                        type: "slider",
                                        default: "20px",
                                        min: 0,
                                    },
                                ],
                            },
                            {
                                name: "Text",
                                properties: [
                                    {
                                        // Default options
                                        // id: 'padding', // The id of the property, if missing, will be the same as `property` value
                                        type: "radio",
                                        label: "Ausrichtung", // Label for the property
                                        property: "text-align", // CSS property to change
                                        options: [
                                            { id: "left", label: "Links" },
                                            {
                                                id: "center",
                                                label: "Zentriert",
                                            },
                                            { id: "right", label: "Rechts" },
                                        ],
                                        default: "left", // Default value to display
                                    },
                                    {
                                        type: "color",
                                        label: "Textfarbe",
                                        property: "color",
                                        default: "#ffffff",
                                    },
                                ],
                            },
                            {
                                name: "Bild",
                                // properties: [
                                //     {
                                //         // Default options
                                //         // id: 'padding', // The id of the property, if missing, will be the same as `property` value
                                //         type: "radio",
                                //         label: "Ausrichtung", // Label for the property
                                //         property: "display", // CSS property to change
                                //         options: [
                                //             { id: "", label: "Links" },
                                //             {
                                //                 id: "block",
                                //                 label: "Zentriert",
                                //             },
                                //             { id: "", label: "Rechts" },
                                //         ],
                                //         o
                                //         // default: "left", // Default value to display
                                //     },
                                // ]
                            },
                        ],
                    },
                    blockManager: {
                        custom: true,
                        // appendTo: "#blocks",
                        blocks: [
                            {
                                category: "Basic",
                                id: "heading", // id is mandatory
                                label: "Überschrift", // You can use HTML/SVG inside labels
                                attributes: { class: "gjs-block-section" },
                                content: `<h1>This is a simple title</h1>`,
                            },
                            {
                                category: "Basic",
                                id: "text",
                                label: "Text",
                                content:
                                    '<div><span data-gjs-type="text">Insert your text here</span></div>',
                            },
                            {
                                category: "Basic",
                                id: "text-sh",
                                label: "Text-sh",
                                content:
                                    '<span data-gjs-type="text">Insert your text here</span>',
                            },
                            {
                                category: "Basic",
                                id: "",
                                label: "Abstandshalter",
                                content: '<div style="height:20px;"></div>',
                            },
                            {
                                category: "Basic",
                                id: "image",
                                label: "Bild",
                                // Select the component once it's dropped
                                select: true,
                                // You can pass components as a JSON instead of a simple HTML string,
                                // in this case we also use a defined component type `image`
                                content: { type: "image" },
                                // This triggers `active` event on dropped components and the `image`
                                // reacts by opening the AssetManager
                                activate: true,
                            },
                        ],
                    },
                    plugins: [inlineStorage],
                }}
            />
        </>
    );
}
