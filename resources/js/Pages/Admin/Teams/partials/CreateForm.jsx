import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
// import Select from "react-select";
import TextareaInput from "@/Components/Inputs/TextareaInput";
import ReactSelect from "@/Components/Inputs/ReactSelect";
import Card from "@/Components/Card";

export default function CreateForm({ status, className = "" }) {
    const { users } = usePage().props;

    const usersOptions = [];
    users.map((user) => {
        usersOptions.push({
            value: user.id,
            label: user.name + " (" + user.email + ")",
        });
    });

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: "",
            description: "",
        });

    const submit = (e) => {
        e.preventDefault();
        // console.log(e);

        post(route("admin.teams.store"));
    };

    return (
        <section className={className}>
            <Card>
                <h2>Allgemeine Einstellungen</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Triff allgemeine Einstellungen das Team betreffend.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-6">
                    {/* Name/Bezeichnung */}
                    <div>
                        <InputLabel htmlFor="name" value="Name" />

                        <TextInput
                            id="name"
                            className="mt-1 block w-full"
                            value={data.name}
                            onChange={(e) => setData("name", e.target.value)}
                            required
                            isFocused
                            autoComplete="name"
                        />

                        <InputError className="mt-2" message={errors.name} />
                    </div>

                    {/* Beschreibung */}
                    <div>
                        <InputLabel
                            htmlFor="description"
                            value="Beschreibung"
                        />

                        <TextareaInput
                            id="description"
                            className="mt-1 block w-full"
                            value={data.description}
                            maxLength={255}
                            onChange={(e) =>
                                setData("description", e.target.value)
                            }
                        />

                        <InputError
                            className="mt-2"
                            message={errors.description}
                        />
                    </div>

                    {/* Benutzer */}
                    {/* <div>
                    <InputLabel htmlFor="users" value="Benutzer" />

                    <ReactSelect
                        id="users"
                        options={usersOptions}
                        isMulti
                        isSearchable
                        isClearable
                        onChange={(choice) => setData("users", choice)}
                    />

                    <InputError className="mt-2" message={errors.users} />
                </div> */}

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            Speichern
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enterFrom="opacity-0"
                            leaveTo="opacity-0"
                            className="transition ease-in-out"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Gespeichert.
                            </p>
                        </Transition>
                    </div>
                </form>
            </Card>
        </section>
    );
}
