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
import { Label } from "@/Components/ui/label";
import { Search } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { Avatar, AvatarFallback } from "@/Components/ui/avatar";
import PersonSelectPlain from "./PersonSelectPlain";
import { ScrollArea } from "@/Components/ui/scroll-area";

const formSchema = z.object({
    prename: z.string().max(100).optional(),
    lastname: z.string().max(100).optional(),
    title: z.string().optional(),
    gender: z.enum(["female", "male", "diverse"]),
    phone: z.string().array().optional(),
    main: z.string(),
});

export function GroupForm({}) {
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            prename: "",
            lastname: "",
            title: "",
            gender: "male",
            main: "Nicole Mundt",
        },
    });

    // 2. Define a submit handler.
    function onSubmit(values) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        // console.log(values);
    }

    return (
        <div>
            <div className="flex justify-start items-center gap-3 mb-6">
                <PersonSelectPlain />
            </div>

            <div className="mb-6 ">Ansprechpartner: {form.watch("main")}</div>

            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-5"
                >
                    <FormField
                        control={form.control}
                        name="main"
                        render={({ field }) => (
                            <FormItem className="">
                                <FormControl>
                                    <ScrollArea>
                                        <RadioGroup
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                            className="flex flex-col space-y-1"
                                        >
                                            <FormItem className="group">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="Nicole Mundt"
                                                        className="hidden"
                                                    />
                                                </FormControl>
                                                <FormLabel className="group-has-[:checked]:dark:border-white group-has-[:checked]:border-black font-normal flex flex-row items-center gap-3 space-y-0 rounded-md border p-4 cursor-pointer">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            NM
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>Nicole Mundt</span>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="group">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="Matthias Mueller"
                                                        className="hidden"
                                                    />
                                                </FormControl>
                                                <FormLabel className="group-has-[:checked]:dark:border-white group-has-[:checked]:border-black font-normal flex flex-row items-center gap-3 space-y-0 rounded-md border p-4 cursor-pointer">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            MM
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>Matthias Müller</span>
                                                </FormLabel>
                                            </FormItem>
                                            <FormItem className="group">
                                                <FormControl>
                                                    <RadioGroupItem
                                                        value="Oliver Goslinowski"
                                                        className="hidden"
                                                    />
                                                </FormControl>
                                                <FormLabel className="group-has-[:checked]:dark:border-white group-has-[:checked]:border-black font-normal flex flex-row items-center gap-3 space-y-0 rounded-md border p-4 cursor-pointer">
                                                    <Avatar>
                                                        <AvatarFallback>
                                                            OG
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <span>
                                                        Oliver Goslinowski
                                                    </span>
                                                </FormLabel>
                                            </FormItem>
                                        </RadioGroup>
                                    </ScrollArea>
                                </FormControl>
                                {/* <div className="space-y-1 leading-none">
                                    <FormLabel>
                                        Use different settings for my mobile
                                        devices
                                    </FormLabel>
                                    <FormDescription>
                                        You can manage your mobile notifications
                                        in the{" "} */}
                                {/* <Link href="/examples/forms">
                                            mobile settings
                                        </Link>{" "} */}
                                {/* page.
                                    </FormDescription>
                                </div> */}
                            </FormItem>
                        )}
                    />

                    <Button type="submit">Erstellen und verbinden</Button>
                </form>
            </Form>
        </div>
    );
}
