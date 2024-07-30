import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/Inputs/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select } from "flowbite-react";
import ReactSelect from "@/Components/Inputs/ReactSelect";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";

export default function CreateForm({ status, className = "" }) {
    const { teams, roles } = usePage().props;

    const teamsOptions = [];
    teams.map((team) => {
        teamsOptions.push({
            key: team.id,
            value: team.id,
            label: team.name,
        });
    });

    const rolesOptions = [];
    roles.map((role) => {
        rolesOptions.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: "",
            email: "",
            status: "active",
        });

    const submit = (e) => {
        e.preventDefault();

        post(route("admin.users.store"));
    };

    return (
        <section className={className}>
            <form onSubmit={submit} className="mt-6 space-y-6">
                <div>
                    <Label htmlFor="name">Name</Label>
                    <Input
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
                    <Label htmlFor="email">E-Mail</Label>

                    <Input
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

                {/* <div>
                    <InputLabel htmlFor="roles" value="Rollen" />
                    <div className="text-gray-800">
                        <ReactSelect
                            id="roles"
                            // defaultValue={rolesDefault}
                            options={rolesOptions}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("roles", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.roles} />
                </div> */}

                {/* <div>
                    <InputLabel htmlFor="teams" value="Teams" />
                    <div className="text-gray-800">
                        <ReactSelect
                            id="teams"
                            // defaultValue={data.teams}
                            options={teamsOptions}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("teams", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.teams} />
                </div> */}

                {/* {mustVerifyEmail && user.email_verified_at === null && (
                    <div>
                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                            The email address is unverified.
                            <Link
                                href={route("verification.send")}
                                method="post"
                                as="button"
                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                            >
                                Click here to re-send the verification email.
                            </Link>
                        </p>

                        {status === "verification-link-sent" && (
                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                A new verification link has been sent to your
                                email address.
                            </div>
                        )}
                    </div>
                )} */}

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
