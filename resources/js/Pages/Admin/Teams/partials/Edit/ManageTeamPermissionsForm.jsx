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
import AdvancedCheckbox from "@/Components/Inputs/AdvancedCheckbox";
import AdvancedCheckboxItem from "@/Components/Inputs/AdvancedCheckboxItem";
import Checkbox from "@/Components/Inputs/Checkbox";

export default function ManageTeamPermissionsForm({
    status,
    className = "",
    team,
    teamPermissions,
    teamPermissionsCurrent
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            teamPermissions: teamPermissionsCurrent,
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(data);

        post(route("admin.teams.updateTeamPermissions", { team: team.id }));
    };

    console.log(teamPermissionsCurrent);

    return (
        <section className={className}>
            <Card>
                <h2>Berechtigungen des Teams anpassen</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Wähle aus, welche Berechtigungen ein Team besitzt.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-6">
                    

                    {/* Berechtigungen */}
                    <div>
                        <InputLabel
                            htmlFor="role"
                            value="Berechtigungen auswählen"
                            className="mb-2"
                        />
                        {teamPermissions.length == 0?<p className="mt-1 text-sm text-gray-600 dark:text-gray-400">Keine Berechtigungen gefunden.</p>:teamPermissions.map((permission) => {
                            return (
                                <div className="flex">
                                    <Checkbox
                                        id={permission.id}
                                        checked={data.teamPermissions.includes(permission.id)}
                                        onChange={(e) => {
                                            var teamPermissions = data.teamPermissions;
                                            if(data.teamPermissions.includes(permission.id) && e.target.checked === false)
                                            {
                                                teamPermissions.splice(teamPermissions.indexOf(permission.id),1);
                                            }
                                            else
                                            {
                                                teamPermissions.push(permission.id);
                                            }
                                            setData("teamPermissions", teamPermissions);
                                        }}
                                    />
                                    <InputLabel
                                        className="ml-2"
                                        htmlFor={permission.id}
                                        value={permission.name}
                                    />
                                </div>
                            );
                        })}
                        {/* <AdvancedCheckbox
                            name="role"
                            mdCols={3}
                            onChange={(params) => setData("role", params)}
                        >
                            <AdvancedCheckboxItem
                                    key={123}
                                    id={123}
                                    label={"Dies ist ein Label."}
                                /> */}
                        {/* {roles.map((role) => (
                                <AdvancedCheckboxItem
                                    key={role.id}
                                    id={role.id}
                                    label={role.name}
                                />
                            ))} */}
                        {/* </AdvancedCheckbox> */}

                        <InputError
                            className="mt-2"
                            message={errors.teamPermissions}
                        />
                    </div>

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
