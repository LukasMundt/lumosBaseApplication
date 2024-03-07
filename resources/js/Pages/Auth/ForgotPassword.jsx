import GuestLayout from '@/Layouts/GuestLayout';
import InputError from '@/Components/Inputs/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/Inputs/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status, strings}) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Passwort vergessen" />

            <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                {strings.mainText}
            </div>

            {status && <div className="mb-4 font-medium text-sm text-green-600 dark:text-green-400">{status}</div>}

            <form onSubmit={submit}>
                <TextInput
                    id="email"
                    type="email"
                    name="email"
                    value={data.email}
                    className="mt-1 block w-full"
                    isFocused={true}
                    onChange={(e) => setData('email', e.target.value)}
                />

                <InputError message={errors.email} className="mt-2" />

                <div className="flex items-center justify-end mt-4">
                    <PrimaryButton className="ml-4" disabled={processing}>
                        {strings.resetPasswordLinkButton}
                    </PrimaryButton>
                </div>
            </form>
            <hr className='h-px my-6 bg-gray-200 border-0 dark:bg-gray-700'/>
            <div className='text-gray-600 dark:text-gray-400 flex justify-center'>
                <Link href={route('login')} className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800">{strings.backToLoginButton}</Link>
            </div>
        </GuestLayout>
    );
}
