import { useEffect } from "react";
import GuestLayout from "@/Layouts/GuestLayout";
import InputError from "@/Components/Inputs/InputError";
import InputLabel from "@/Components/Inputs/InputLabel";
import TextInput from "@/Components/Inputs/TextInput";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { Label } from "@/Components/ui/label";

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false,
    });

    useEffect(() => {
        return () => {
            reset("password");
        };
    }, []);

    const submit = (e) => {
        e.preventDefault();

        post(route("login"));
    };

    return (
        <GuestLayout>
            <Head title="Anmelden" />

            {status && (
                <div className="mb-4 font-medium text-sm text-green-600">
                    {status}
                </div>
            )}

            <form onSubmit={submit}>
                <div>
                    <InputLabel htmlFor="email" value="E-Mail" />

                    <TextInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder="E-Mail"
                        value={data.email}
                        className="mt-1 block w-full p-2"
                        autoComplete="username"
                        isFocused={true}
                        onChange={(e) => setData("email", e.target.value)}
                    />

                    <InputError message={errors.email} className="mt-2" />
                </div>

                <div className="mt-4">
                    <InputLabel htmlFor="password" value="Passwort" />

                    <TextInput
                        id="password"
                        type="password"
                        name="password"
                        placeholder="Passwort"
                        value={data.password}
                        className="mt-1 block w-full p-2"
                        autoComplete="current-password"
                        onChange={(e) => setData("password", e.target.value)}
                    />

                    <InputError message={errors.password} className="mt-2" />
                </div>

                <div className="mt-4 flex items-center">
                    <Checkbox
                        name="remember"
                        id="remember"
                        checked={data.remember}
                        onCheckedChange={(e) =>
                            setData("remember", !data.remember)
                        }
                    />
                    <Label htmlFor="remember" className="ml-3">
                        Angemeldet bleiben
                    </Label>
                    {/* <label className="flex items-center">
                        <span className="ml-2 text-sm text-gray-600 dark:text-gray-400">
                            Angemeldet bleiben
                        </span>
                    </label> */}
                </div>

                <div className="flex items-center w-full mt-4">
                    <Button disabled={processing} className="w-full">
                        Anmelden
                    </Button>
                </div>
            </form>
            <hr className="h-px my-4 bg-gray-200 border-0 dark:bg-gray-700" />
            <div className="flex justify-center items-center">
                {canResetPassword && (
                    <Link
                        href={route("password.request")}
                        as="button"
                        type="button"
                    >
                        <Button variant="link">Passwort vergessen?</Button>
                    </Link>
                )}
            </div>
        </GuestLayout>
    );
}
