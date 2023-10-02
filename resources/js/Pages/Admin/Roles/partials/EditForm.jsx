import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select as NormalSelect } from "flowbite-react";
import Select from "react-select";
import CreatableSelect from "react-select/creatable";
import ReactSelect from "@/Components/Inputs/ReactSelect";
// import { Select as SelectMultiple } from "react-select";

export default function EditForm({ status, className = "" }) {
    const { user, permissions, role } = usePage().props;
    console.log(permissions);
    // mögliche Berechtigungen
    const permissionsSelect = [];
    permissions.map((permission) => {
        permissionsSelect.push({
            value: permission.id,
            label: permission.name + " (" + permission.guard_name + ")",
        });
    });

    // der Rolle zugewiesene Berechtigungen
    console.log(role);
    const permissionsRole = [];
    role.permissions.map((permission) => {
        permissionsRole.push({
            value: permission.id,
            label: permission.name + " (" + permission.guard_name + ")",
        });
    });
    console.log(permissionsRole);

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: role.name,
            permissions: permissionsRole,
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(e);

        post(route("admin.roles.update", { role: role.id }));
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

                {/* Team/Gruppe */}
                <div className="hidden">
                    <InputLabel htmlFor="team" value="Gruppe" />

                    <div className="text-gray-800">
                        <CreatableSelect
                            id="team"
                            // options={options}
                            // isMulti
                            // options={data.permissions}
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("team", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.team} />
                </div>

                <div>
                    <InputLabel htmlFor="permissions" value="Berechtigungen" />

                    <div className="text-gray-800">
                        <ReactSelect
                            id="permissions"
                            options={permissionsSelect}
                            defaultValue={data.permissions}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) =>
                                setData("permissions", choice)
                            }
                        />
                    </div>

                    <InputError className="mt-2" message={errors.permissions} />
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
