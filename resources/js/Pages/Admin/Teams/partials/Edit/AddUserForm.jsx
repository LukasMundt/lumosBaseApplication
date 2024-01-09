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
import Card from "@/Components/Card";
import AdvancedRadio from "@/Components/Inputs/AdvancedRadio";
import AdvancedRadioItem from "@/Components/Inputs/AdvancedRadioItem";
import PrimaryLinkButton from "@/Components/PrimaryLinkButton";

export default function AddUserForm({ status, className = "", roles }) {
    const { team, users } = usePage().props;

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            user: "",
            role: "",
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(data);

        post(route("admin.teams.addMember", { team: team.id }));
    };

    const usersOptions = [];
    users.map((user) => {
        usersOptions.push({ value: user.id, label: user.name });
    });

    console.log(roles);

    return (
        <section className={className}>
            <Card>
                <h2>Benutzer hinzufügen</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Füge einen Benutzer dem Team hinzu, wähle aus, welche Rolle
                    der Benutzer im Team haben soll.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-6">
                    {/* Benutzer */}
                    <div>
                        <InputLabel htmlFor="user" value="Benutzer" />

                        <Select
                            id="user"
                            options={usersOptions}
                            className="text-gray-500"
                            // isMulti
                            required
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("user", choice.value)}
                        />

                        <InputError className="mt-2" message={errors.user} />
                    </div>

                    {/* Rolle */}
                    <div>
                        <InputLabel
                            htmlFor="role"
                            value="Rolle auswählen"
                            className="mb-2"
                        />
                        <AdvancedRadio
                            name="role"
                            mdCols={3}
                            onChange={(params) => setData("role", params)}
                        >
                            {roles.map((role) => (
                                <AdvancedRadioItem
                                    key={role.id}
                                    id={role.id}
                                    label={role.name}
                                />
                            ))}
                        </AdvancedRadio>
                        <InputError className="mt-2" message={errors.role} />
                    </div>

                    <div className="flex items-center gap-4">
                        <PrimaryButton disabled={processing}>
                            Hinzufügen
                        </PrimaryButton>

                        <Transition
                            show={recentlySuccessful}
                            enterFrom="opacity-0"
                            leaveTo="opacity-0"
                            className="transition ease-in-out"
                        >
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Hinzugefügt.
                            </p>
                        </Transition>
                    </div>
                </form>
            </Card>
        </section>
    );
}
