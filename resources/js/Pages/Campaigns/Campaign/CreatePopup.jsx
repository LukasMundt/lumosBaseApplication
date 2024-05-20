import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
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
import { Checkbox } from "@/Components/ui/checkbox";
import { useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import { router } from "@inertiajs/react";

const formSchema = z.object({
    name: z.string().min(2).max(255),
});

export default function CreatePopup({ domain }) {
    const [open, setOpen] = useState(false);

    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
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
        // console.log(values);
        toast.promise(
            axios.post(
                route("api.v1.campaigns.campaigns.store", { domain: domain }),
                values
            ),
            {
                loading: "Wird gespeichert...",
                success: (response) => {
                    // console.log(response);
                    setOpen(false);
                    form.reset();
                    router.get(
                        route("campaigns.campaigns.edit", {
                            domain: domain,
                            campaign: response.data.id,
                        })
                    );
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Kampagne erstellen</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Erstelle eine Kampagne</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-8"
                    >
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    {/* <FormDescription>
                                        Dies ist der Name der Liste. Er wird
                                        überall angezeigt, wo die Liste
                                        verwendet wird.
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

                        <Button type="submit">Kampagne erstellen</Button>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

function Filter({ form, formField, ignoreFormField, options, label }) {
    return (
        <FormField
            control={form.control}
            name={formField}
            render={() => (
                <FormItem>
                    <div className="mb-4 mt-4">
                        <FormLabel className="text-base">{label}</FormLabel>
                        {/* <FormDescription>
                            Select the items you want to display in the sidebar.
                        </FormDescription> */}
                    </div>
                    <div className="flex gap-3">
                        <FormField
                            key={"all"}
                            control={form.control}
                            name={formField}
                            render={({ field }) => {
                                return (
                                    <FormItem
                                        key={"all"}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                disabled={form.getValues(
                                                    ignoreFormField
                                                )}
                                                checked={
                                                    field.value?.length ===
                                                    options.length
                                                }
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange(
                                                              options.map(
                                                                  (item) => item
                                                              )
                                                          )
                                                        : field.onChange([]);
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            Alle auswählen
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                        <FormField
                            control={form.control}
                            name={ignoreFormField}
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                                            <Checkbox
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                            <FormLabel className="text-sm font-normal">
                                                Nicht beachten
                                            </FormLabel>
                                        </FormItem>
                                    </FormControl>

                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    {options.map((item) => (
                        <FormField
                            key={item}
                            control={form.control}
                            name={formField}
                            render={({ field }) => {
                                return (
                                    <FormItem
                                        key={item}
                                        className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                        <FormControl>
                                            <Checkbox
                                                disabled={form.getValues(
                                                    ignoreFormField
                                                )}
                                                checked={field.value?.includes(
                                                    item
                                                )}
                                                onCheckedChange={(checked) => {
                                                    return checked
                                                        ? field.onChange([
                                                              ...field.value,
                                                              item,
                                                          ])
                                                        : field.onChange(
                                                              field.value?.filter(
                                                                  (value) =>
                                                                      value !==
                                                                      item
                                                              )
                                                          );
                                                }}
                                            />
                                        </FormControl>
                                        <FormLabel className="text-sm font-normal">
                                            {item}
                                        </FormLabel>
                                    </FormItem>
                                );
                            }}
                        />
                    ))}
                    <FormMessage />
                </FormItem>
            )}
        />
    );
}
