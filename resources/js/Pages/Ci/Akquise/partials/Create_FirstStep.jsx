import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import { useForm } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Input } from "@/Components/ui/input";

export default function FirstStep({
    className = "",
    setInput,
    streetAndNumber = "",
    step,
    errors,
}) {
    const { data, setData, processing, recentlySuccessful } = useForm({
        strasse: streetAndNumber,
        hausnummer: "",
    });

    const submit = async (e) => {
        e.preventDefault();

        setInput(data.strasse);
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

                        <Input
                            id="strasse"
                            className="w-full"
                            onChange={(e) => {
                                setData("strasse", e.target.value);
                            }}
                        />

                        <InputError
                            className="mt-2"
                            message={(errors && errors.strasse) ?? []}
                        />
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing} type="button" onClick={submit}>Weiter</PrimaryButton>

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
