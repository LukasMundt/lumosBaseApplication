import FullCalendar from "@fullcalendar/react";
import { Link, Head, usePage } from "@inertiajs/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { router } from "@inertiajs/react";
import { Button } from "flowbite-react";

export default function Welcome({ auth, laravelVersion, phpVersion }) {
    const handleDateClick = (arg) => {
        // bind with an arrow function
        alert(arg.dateStr);
    };

    const handleLoad = () => {
        router.reload({only: ['cal']});
    }

    const handleEventClick = (arg) => {
        // bind with an arrow function
        console.log(arg.event.title);
    };

    console.log(usePage().props);

    return (
        <AuthenticatedLayout
            user={auth.user}
            // header={
            //     <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            //         Dashboard
            //     </h2>
            // }
        >
            <Head title="Welcome" />
            <div className="size-full overflow-hidden dark:text-gray-200 text-gray-800">
                <div className="h-full overflow-y-hidden p-3">
                    <FullCalendar
                        height="100%"
                        firstDay={1}
                        businessHours={{
                            // days of week. an array of zero-based day of week integers (0=Sunday)
                            daysOfWeek: [1, 2, 3, 4, 5], // Monday - Thursday

                            startTime: "8:00", // a start time (10am in this example)
                            endTime: "18:00", // an end time (6pm in this example)
                        }}
                        locale={"de"}
                        plugins={[timeGridPlugin, interactionPlugin]}
                        initialView="timeGridWeek"
                        nowIndicator
                        dateClick={handleDateClick}
                        eventClick={handleEventClick}
                        events={usePage().props.events}
                    />
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
