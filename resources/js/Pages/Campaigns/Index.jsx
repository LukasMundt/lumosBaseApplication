import { Button } from "@/Components/ui/button";
import { Card } from "@/Components/ui/card";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import { BookUser, Megaphone } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

export default function Index({ auth, domain, stats }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between w-full">
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Übersicht
                    </h2>
                    <a
                        href={route("campaigns.campaigns.settings", {
                            domain: domain,
                        })}
                    >
                        <Button variant="outline">Einstellungen</Button>
                    </a>
                </div>
            }
        >
            <Head title="Übersicht" />

            <div className="">
                <div className=" grid grid-cols-1 sm:grid-cols-2  md:grid-cols-3 lg:grid-cols-4 gap-5">
                    <a
                        href={route("campaigns.campaigns.index", {
                            domain: domain,
                        })}
                        title="Alle Kampagnen"
                    >
                        <Card className=" h-32 relative">
                            {/* <div className="absolute bottom-0 z-[0]">
                            <AreaChart
                                width={234.39}
                                height={64}
                                margin={{
                                    top: 10,
                                    right: 0,
                                    left: 0,
                                    bottom: 0,
                                }}
                                className="h-16 rounded-b-lg"
                                data={[
                                    {
                                        name: "Page A",
                                        uv: 4000,
                                        pv: 2400,
                                        amt: 2400,
                                    },
                                    {
                                        name: "Page B",
                                        uv: 3000,
                                        pv: 1398,
                                        amt: 2210,
                                    },
                                    // {
                                    //     name: "Page C",
                                    //     uv: 2000,
                                    //     pv: 9800,
                                    //     amt: 2290,
                                    // },
                                    // {
                                    //     name: "Page D",
                                    //     uv: 2780,
                                    //     pv: 3908,
                                    //     amt: 2000,
                                    // },
                                    // {
                                    //     name: "Page E",
                                    //     uv: 1890,
                                    //     pv: 4800,
                                    //     amt: 2181,
                                    // },
                                    // {
                                    //     name: "Page F",
                                    //     uv: 2390,
                                    //     pv: 3800,
                                    //     amt: 2500,
                                    // },
                                    // {
                                    //     name: "Page G",
                                    //     uv: 3490,
                                    //     pv: 4300,
                                    //     amt: 2100,
                                    // },
                                ]}
                            >
                                <defs>
                                    <linearGradient
                                        id="colorUv"
                                        x1="0"
                                        y1="0"
                                        x2="0"
                                        y2="1"
                                    >
                                        <stop
                                            offset="5%"
                                            stopColor="#8884d8"
                                            stopOpacity={0.8}
                                        />
                                        <stop
                                            offset="95%"
                                            stopColor="#8884d8"
                                            stopOpacity={0}
                                        />
                                    </linearGradient>
                                </defs>
                                <Area
                                    type="monotone"
                                    dataKey="uv"
                                    stroke="#8884d8"
                                    fillOpacity={1}
                                    fill="url(#colorUv)"
                                />
                            </AreaChart>
                        </div> */}
                            <div className="p-4 flex justify-between z-10">
                                <div>
                                    <Megaphone size={40} /> Kampagnen
                                </div>
                                <div className="text-3xl font-bold h-full content-center">
                                    {stats.campaigns.count}
                                </div>
                            </div>
                        </Card>
                    </a>
                    <a
                        href={route("campaigns.lists.index", {
                            domain: domain,
                        })}
                        title="Alle Kampagnen"
                    >
                        <Card className=" h-32 relative">
                            <div className="p-4 flex justify-between z-10">
                                <div className="">
                                    <BookUser size={40} /> Listen
                                </div>
                                <div className="text-3xl font-bold h-full content-center">
                                    {stats.lists.count}
                                </div>
                            </div>
                        </Card>
                    </a>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
