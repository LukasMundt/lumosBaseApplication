import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import PrimaryButton from "@/Components/PrimaryButton";
import TextInput from "@/Components/TextInput";
import { Link, useForm, usePage } from "@inertiajs/react";
import { Transition } from "@headlessui/react";
import { Select as TSelect } from "flowbite-react";
import Select from "react-select";

export default function EditForm({ className = "" }) {
    const { user, roles } = usePage().props;
    console.log(user);

    const rolesSelect = [];
    roles.map((role) => {
        rolesSelect.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });

    const rolesDefault = [];
    user.roles.map((role) => {
        // console.log(role)
        rolesDefault.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });
    console.log(rolesDefault);

    const tempUserRoles = [];
    user.roles.map((role) => {
        tempUserRoles.push({
            key: role.id,
            value: role.id,
            label: role.name,
        });
    });

    const { data, setData, post, errors, processing, recentlySuccessful } =
        useForm({
            name: user.name,
            email: user.email,
            status: user.status,
            roles: tempUserRoles,
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

                    <TSelect
                        id="status"
                        type="text"
                        className="mt-1 block w-full"
                        value={data.status}
                        onChange={(e) => setData("status", e.target.value)}
                        required
                    >
                        <option>active</option>
                        <option>inactive</option>
                    </TSelect>

                    <InputError className="mt-2" message={errors.status} />
                </div>

                <div>
                    <InputLabel htmlFor="roles" value="Rollen" />
                    <div className="text-gray-800">
                        <Select
                            id="roles"
                            defaultValue={rolesDefault}
                            options={rolesSelect}
                            isMulti
                            isSearchable
                            isClearable
                            onChange={(choice) => setData("roles", choice)}
                        />
                    </div>
                    <InputError className="mt-2" message={errors.roles} />
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
