import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from "react";
import { ScrollArea, ScrollBar } from "@/Components/ui/scroll-area";
import { Card, CardContent, CardHeader } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Dashboard({ auth, domain, teams }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                    Dashboard
                </h2>
            }
        >
            <Head title="Dashboard" />
            <ScrollArea className="w-full py-2">
                <div className="flex gap-3">
                    {teams.map((team) => (
                        <a key={team.id} href={route("team.dashboard", { domain: team.id })}>
                            <Card className="pr-4">
                                <CardHeader className="p-4">
                                    {team.name}
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <Button
                                        variant="link"
                                        className="group p-0"
                                    >
                                        Zu Team wechseln
                                    </Button>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
                <ScrollBar orientation="horizontal" />
            </ScrollArea>
            {/* <BrowserRouter>
                <Routes path="/personal">
                    <Route path="/personal/123" element={<div>routed Element</div>} />
                </Routes>
            </BrowserRouter> */}
        </AuthenticatedLayout>
    );
}
