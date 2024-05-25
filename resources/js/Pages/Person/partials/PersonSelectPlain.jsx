// import { z } from "zod";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import { Button } from "@/Components/ui/button";
// import {
//     Form,
//     FormControl,
//     FormDescription,
//     FormField,
//     FormItem,
//     FormLabel,
//     FormMessage,
// } from "@/Components/ui/form";
// import { Input } from "@/Components/ui/input";
// import { Label } from "@/Components/ui/label";
// import { Check, ChevronsUpDown, Search } from "lucide-react";
// import PersonSelectOrCreate from "./PersonSelectOrCreate";
// import {
//     Popover,
//     PopoverContent,
//     PopoverTrigger,
// } from "@/Components/ui/popover";
// import {
//     Command,
//     CommandEmpty,
//     CommandGroup,
//     CommandInput,
//     CommandItem,
// } from "@/Components/ui/command";
// import * as React from "react";
import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/Components/ui/button";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandLinkItem,
    CommandList,
    CommandSeparator,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { PersonIcon } from "@radix-ui/react-icons";
import PersonSelectOrCreate from "./PersonSelectOrCreate";

// const formSchema = z.object({
//     search: z.string(),
// });

export default function PersonSelectPlain({ showCreateButton = true }) {
    const [open, setOpen] = React.useState(false);
    const [value, setValue] = React.useState("");
    const [search, setSearch] = React.useState("");

    const frameworks = [
        {
            value: "next.js",
            label: "Next.js",
        },
        {
            value: "sveltekit",
            label: "SvelteKit",
        },
        {
            value: "nuxt.js",
            label: "Nuxt.js",
        },
        {
            value: "remix",
            label: "Remix",
        },
        {
            value: "astro",
            label: "Astro",
        },
    ];

    // const form = useForm({
    //     resolver: zodResolver(formSchema),
    //     defaultValues: {
    //         search: "",
    //     },
    // });

    // 2. Define a submit handler.
    // function onSubmit(values) {
    //     // Do something with the form values.
    //     // ✅ This will be type-safe and validated.
    //     console.log(values);
    // }

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {value
                        ? frameworks.find(
                              (framework) => framework.value === value
                          )?.label
                        : "Select framework..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
                <Command>
                    <CommandInput placeholder="Search framework..." onValueChange={(e) => setSearch(e)}/>
                    <CommandEmpty>No framework found.</CommandEmpty>
                    <CommandList>
                        <CommandItem asChild>
                            <PersonSelectOrCreate onlyCreate command />
                        </CommandItem>
                        <CommandSeparator />
                        
                        <CommandGroup>
                        
                            {frameworks.map((framework) => (
                                <CommandItem
                                    key={framework.value}
                                    value={framework.value}
                                    onSelect={(currentValue) => {
                                        setValue(
                                            currentValue === value
                                                ? ""
                                                : currentValue
                                        );
                                        setOpen(false);
                                    }}
                                >
                                    <Check
                                        className={cn(
                                            "mr-2 h-4 w-4",
                                            value === framework.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                        )}
                                    />
                                    {framework.label}
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
        // <Form {...form}>
        //     <form
        //         onSubmit={form.handleSubmit(onSubmit)}
        //         className="w-full flex gap-3"
        //     >
        //         <FormField
        //             control={form.control}
        //             name="search"
        //             render={({ field }) => (
        //                 <Popover open={open} onOpenChange={setOpen}>
        //                     <PopoverTrigger asChild>
        //                         <Button
        //                             variant="outline"
        //                             role="combobox"
        //                             aria-expanded={open}
        //                             className="w-[200px] justify-between"
        //                         >
        //                             {value
        //                                 ? frameworks.find(
        //                                       (framework) =>
        //                                           framework.value === value
        //                                   )?.label
        //                                 : "Select framework..."}
        //                             <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        //                         </Button>
        //                     </PopoverTrigger>
        //                     <FormItem className="w-full">
        //                         {/* <FormLabel>Username</FormLabel> */}
        //                         <div className="flex items-center gap-3 grow">
        //                             <Label htmlFor="search">
        //                                 <Search />
        //                             </Label>
        //                             <FormControl>
        //                                 <Input
        //                                     placeholder="Suchen"
        //                                     {...field}
        //                                 />
        //                             </FormControl>
        //                         </div>

        //                         {/* <FormDescription>
        //                         This is your public display name.
        //                     </FormDescription> */}
        //                         <FormMessage />
        //                     </FormItem>
        //                 </Popover>
        //             )}
        //         />
        //         {showCreateButton ? (
        //             <PersonSelectOrCreate title="Neu erstellen" />
        //         ) : (
        //             ""
        //         )}
        //     </form>
        // </Form>
    );
}
