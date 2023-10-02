import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select as NormalSelect } from "flowbite-react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import TextareaInput from "@/Components/Inputs/TextareaInput";
// import { Select as SelectMultiple } from "react-select";

export default function EditForm({ status, className = "" }) {
    const { team } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: team.name,
            description: team.description,
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(e);

        post(route("admin.teams.update", {team: team.id}));
    };

    return (
        <section className={className}>
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
                    <InputLabel htmlFor="description" value="Beschreibung" />

                    <TextareaInput
                        id="description"
                        className="mt-1 block w-full"
                        value={data.description}
                        maxLength={255}
                        onChange={(e) => setData("description", e.target.value)}
                        required
                        
                    />

                    <InputError className="mt-2" message={errors.description} />
                </div>

                {/* Benutzer */}
                <div>
                    <InputLabel htmlFor="users" value="Benutzer" />

                    <ReactSelect
                        id="users"
                        options={usersOptions}
                        isMulti
                        isSearchable
                        isClearable
                        onChange={(choice) => setData("users", choice)}
                    />
                </div>

                <div className="flex items-center gap-4">
                    <PrimaryButton disabled={processing}>Save</PrimaryButton>

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
                </div>
            </form>
        </section>
    );
}
