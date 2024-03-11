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

export default function ManageUsersForm({
    status,
    className = "",
    team,
    currentUsers,
}) {
    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            user: "",
            role: "",
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(data);

        // post(route("admin.teams.update", { team: team.id }));
    };

    const usersOptions = [];
    // users.map((user) => {
    //     usersOptions.push({ value: user.id, label: user.name });
    // });

    console.log(usersOptions);

    return (
        <section className={className}>
            <Card>
                <h2>Team Mitglieder</h2>
                <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    Alle Mitglieder des Teams.
                </p>
                <form onSubmit={submit} className="mt-6 space-y-6">
                    {currentUsers.map((user, index) => {
                        return (
                            <div className="flex space-x-2">
                                <span>{user.name}</span>
                                <span className="text-gray-600 dark:text-gray-400">{user.email}</span>
                            </div>
                        );
                    })}

                    {/* <div className="flex items-center gap-4">
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
                                Hinugefügt.
                            </p>
                        </Transition>
                    </div> */}
                </form>
            </Card>
        </section>
    );
}
