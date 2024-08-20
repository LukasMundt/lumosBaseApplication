import { Head, router, usePage } from "@inertiajs/react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import AudioRecorder from "./AudioRecorder";
import { BrowserRouter, Link, Route, Routes } from "react-router-dom";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/Components/ui/breadcrumb";
import Index from "./Index";
import { useState } from "react";
import View from "./View";
export default function MobileRecording({ domain }) {
    const { auth } = usePage().props;
    const [breadcrumb, setBreadcrumb] = useState(null);

    return (
        <BrowserRouter basename={"/" + domain + "/ci/akquise/mobile-recording"}>
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <div className="grid gap-2 w-full">
                        <Breadcrumb>
                            <BreadcrumbList>
                                <BreadcrumbItem>
                                    <BreadcrumbLink
                                        href={route("team.dashboard", {
                                            domain: domain,
                                        })}
                                    >
                                        Home
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                <BreadcrumbSeparator />
                                <BreadcrumbItem>
                                    <BreadcrumbLink asChild>
                                        <Link to="/">Mobile Aufnahme</Link>
                                    </BreadcrumbLink>
                                </BreadcrumbItem>
                                {breadcrumb != null && <BreadcrumbSeparator />}
                                <BreadcrumbPage>{breadcrumb}</BreadcrumbPage>
                            </BreadcrumbList>
                        </Breadcrumb>
                        <div className="w-full flex justify-between items-center">
                            <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                                {breadcrumb == null ? "Übersicht" : breadcrumb}
                            </h2>
                        </div>
                    </div>
                }
            >
                <Head title={breadcrumb == null ? "Übersicht" : breadcrumb} />
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Index
                                domain={domain}
                                setBreadcrumb={setBreadcrumb}
                            />
                        }
                    />
                    <Route
                        path="/new-recording"
                        element={
                            <AudioRecorder
                                domain={domain}
                                setBreadcrumb={setBreadcrumb}
                            />
                        }
                    />
                    <Route
                        path="/recordings/:recording"
                        element={<View domain={domain} />}
                    />
                </Routes>
            </AuthenticatedLayout>
        </BrowserRouter>
    );
}
