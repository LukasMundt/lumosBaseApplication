import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Input } from "@/Components/ui/input";
import { useState } from "react";
import {
    Popover,
    PopoverAnchor,
    PopoverContent,
} from "@/Components/ui/popover";
import { PopoverTrigger } from "@radix-ui/react-popover";
import React from "react";
import { Button } from "@/Components/ui/button";
import { ScrollArea } from "@/Components/ui/scroll-area";
import {
    Command,
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/Components/ui/command";
import { CommandLoading } from "cmdk";
import { LoaderCircleIcon } from "lucide-react";

export default function FirstStep({
    className = "",
    setInput,
    streetAndNumber = "",
    step,
    errors,
}) {
    const { domain } = usePage().props;
    const { data, setData, processing, recentlySuccessful } = useForm({
        strasse: streetAndNumber,
        hausnummer: "",
    });
    const [autocompleteOpen, setAutocompleteOpen] = useState(true);
    const [autocompleteValues, setAutocompleteValues] = useState([]);
    const [loading, setLoading] = useState(false);

    const submit = async (e) => {
        e.preventDefault();

        setInput(data.strasse);
    };

    const handleChangeForAutocomplete = () => {
        if (true
            // data.strasse.length >= 2
            // && !["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"].includes(
            //     data.strasse.at(data.strasse.length - 1)
            // )
        ) {
            axios
                .get(
                    route("api.v1.addresses.autocomplete", {
                        domain: domain,
                        search: data.strasse,
                    }),
                    { onloadstart: () => setLoading(true) }
                )
                .then((response) => {
                    // console.log(response);
                    setLoading(false);
                    setAutocompleteValues(response.data);
                });
        }
    };

    return (
        <section className={className} id="firstSection">
            <form className="mt-6 space-y-6">
                <div className="grid grid-cols-1">
                    {/* Straße */}
                    <div>
                        <InputLabel
                            htmlFor="strasse"
                            value="Straße und Hausnummer"
                        />
                        {/* <Popover
                            open={autocompleteOpen}
                            onOpenChange={setAutocompleteOpen}
                            modal={false}
                        >
                            <PopoverAnchor>
                                <Input
                                    id="strasse"
                                    className="w-full"
                                    onChange={(e) => {
                                        setData("strasse", e.target.value);
                                        handleChangeForAutocomplete();
                                        setAutocompleteOpen(true);
                                    }}
                                    autoFocus
                                    autoComplete="off"
                                    onFocus={(e) => setAutocompleteOpen(true)}
                                />
                            </PopoverAnchor>
                            <PopoverContent>
                                <ScrollArea className="h-32 w-full">
                                    <ul>
                                        {autocompleteValues.map(
                                            (value, index) => (
                                                <li key={index}>
                                                    <Button
                                                        variant="ghost"
                                                        className="w-full justify-start"
                                                    >
                                                        {
                                                            value.street_and_number
                                                        }
                                                    </Button>
                                                </li>
                                            )
                                        )}
                                    </ul>
                                </ScrollArea>
                            </PopoverContent>
                        </Popover> */}

                        <Command
                            // filter={(value, search) => {
                            //     if (
                            //         value.includes(search) ||
                            //         search.includes(value)
                            //     )
                            //         return 1;
                            //     return 0;
                            // }}
                        >
                            {/* <Popover
                                open={autocompleteOpen}
                                onOpenChange={setAutocompleteOpen}
                                modal={false}
                            >
                                <PopoverAnchor> */}
                                    <CommandInput
                                        placeholder="Straße und Hausnummer eingeben"
                                        id="strasse"
                                        className="w-full"
                                        value={data.strasse}
                                        onValueChange={(value) => {
                                            // console.log(value);
                                            setData("strasse", value);
                                            handleChangeForAutocomplete();
                                            // setAutocompleteOpen(true);
                                        }}
                                        // autoFocus
                                        autoComplete="off"
                                    />
                                {/* </PopoverAnchor>
                                <PopoverContent> */}
                                    <CommandList>
                                        {loading && (
                                            <CommandLoading>
                                                <div className="flex justify-center h-16 items-center">
                                                    <LoaderCircleIcon className="animate-spin" />
                                                </div>
                                            </CommandLoading>
                                        )}
                                    </CommandList>
                                    {!loading && (
                                        <CommandList>
                                            <CommandEmpty>
                                                No results found.
                                            </CommandEmpty>
                                            <CommandGroup>
                                                {autocompleteValues
                                                    ? autocompleteValues.map(
                                                          (value, index) => (
                                                              <CommandItem
                                                                  key={index}
                                                                  value={value}
                                                                  onSelect={(
                                                                      value
                                                                  ) =>
                                                                      setData(
                                                                          "strasse",
                                                                          value
                                                                      )
                                                                  }
                                                                //   onClick={() =>
                                                                //       setData(
                                                                //           "strasse",
                                                                //           value
                                                                //       )
                                                                //   }
                                                              >
                                                                  {value.street_and_number +
                                                                      ""}
                                                              </CommandItem>
                                                          )
                                                      )
                                                    : ""}
                                            </CommandGroup>
                                        </CommandList>
                                    )}
                                {/* </PopoverContent>
                            </Popover> */}
                        </Command>

                        <InputError
                            className="mt-2"
                            message={(errors && errors.strasse) ?? []}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton
                        disabled={processing}
                        type="button"
                        onClick={submit}
                    >
                        Weiter
                    </PrimaryButton>

                    <Transition
                        show={recentlySuccessful}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Saved.
                        </p>
                    </Transition>
                    <Transition
                        show={errors === 500}
                        enterFrom="opacity-0"
                        leaveTo="opacity-0"
                        className="transition ease-in-out"
                    >
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            Auf dem Server ist ein Fehler aufgetreten.
                        </p>
                    </Transition>
                </div>
            </form>
        </section>
    );
}
