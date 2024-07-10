import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import ListForm from "./partials/ListForm";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";

const formSchema = z.object({
    name: z.string().min(2).max(255),
    filtersDistricts: z.array(z.string()).optional(),
    ignoreDistricts: z.boolean(),
    filtersZipCodes: z.array(z.string()).optional(),
    ignoreZipCodes: z.boolean(),
    filtersStreets: z.array(z.string()).optional(),
    ignoreStreets: z.boolean(),
});

export default function Edit({ auth, domain, list }) {
    const [dataCopied, setDataCopied] = useState(false);

    const toggleReload = () => {
        router.reload({ only: ["list"] });
    };
    console.log(list);

    // useEffect()
    // 1. Define your form.
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: list.name,
            filtersDistricts: list.filters.filtersDistricts ?? [],
            ignoreDistricts: list.filters.ignoreDistricts ?? true,
            filtersZipCodes: list.filters.filtersZipCodes ?? [],
            ignoreZipCodes: list.filters.ignoreZipCodes ?? true,
            filtersStreets: list.filters.filtersStreets ?? [],
            ignoreStreets: list.filters.ignoreStreets ?? true,
        },
    });

    console.log(form.getValues());

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    {"Liste: " + form.watch("name")}
                </h2>
            }
        >
            <Head title="Übersicht" />

            <div className="">
                <ListForm
                    edit={true}
                    form={form}
                    toggleReload={toggleReload}
                    domain={domain}
                    listId={list.id}
                />
            </div>
        </AuthenticatedLayout>
    );
}
