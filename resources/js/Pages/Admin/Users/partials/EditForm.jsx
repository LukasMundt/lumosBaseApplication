import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select } from "flowbite-react";
import ReactSelect from "@/Components/Inputs/ReactSelect";

export default function EditForm({ className = "" }) {
    const { user, roles, teams} = usePage().props;

    const rolesOptions = [];
    roles.map((role) => {
        rolesOptions.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });

    const rolesDefault = [];
    user.roles.map((role) => {
        rolesDefault.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });

    const teamsOptions = [];
    teams.map((team) => {
        teamsOptions.push({
            key: team.id,
            value: team.id,
            label: team.name,
        });
    });

    const teamsDefault = [];
    user.reduced_teams.map((team) => {
        teamsDefault.push({
            // key: team.id,
            value: team.id,
            label: team.name,
        });
    });

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            status: user.status,
            roles: rolesDefault,
            teams: teamsDefault,
        });

    const submit = (e) => {
        e.preventDefault();
        console.log(data);

        post(route("admin.users.update", { user: user.id }));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">
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

                <div>
                    <InputLabel htmlFor="email" value="Email" />

                    <TextInput
                        id="email"
                        type="email"
                        className="mt-1 block w-full"
                        value={data.email}
                        onChange={(e) => setData("email", e.target.value)}
                        required
                        autoComplete="username"
                    />

                    <InputError className="mt-2" message={errors.email} />
                </div>

                <div>
                    <InputLabel htmlFor="status" value="Status" />

                    <Select
                        id="status"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        required
                    >
                        <option>active</option>
                        <option>inactive</option>
                    </Select>

                    <InputError className="mt-2" message={errors.status} />
                </div>

                <div>
                    <InputLabel htmlFor="roles" value="Rollen" />
                    <div className="text-gray-800">
                        <ReactSelect
                            id="roles"
                            defaultValue={rolesDefault}
                            options={rolesOptions}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("roles", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.roles} />
                </div>

                <div>
                    <InputLabel htmlFor="teams" value="Teams" />
                    <div className="text-gray-800">
                        <ReactSelect
                            id="teams"
                            defaultValue={data.teams}
                            options={teamsOptions}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("teams", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.teams} />
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
