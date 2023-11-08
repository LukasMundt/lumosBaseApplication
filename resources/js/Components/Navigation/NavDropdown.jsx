import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "@inertiajs/react";
import { Dropdown } from "flowbite-react";

export default function NavDropdown({
    active = false,
    label = "Dropdown",
    className = "",
    children,
    hidden = false,
    ...props
}) {
    return (
        <Dropdown
            inline
            {...props}
            renderTrigger={() => (
                <span
                    className={
                        "cursor-pointer inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                        (active
                            ? "border-indigo-400 dark:border-indigo-600 text-gray-900 dark:text-gray-100 focus:border-indigo-700 "
                            : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ") +
                        className
                    }
                >
                    {label}
                    <ChevronDownIcon className="w-5 ml-1" />
                </span>
            )}
            hidden={hidden}
            className={
                "inline-flex border-transparent items-center text-sm font-medium leading-5 focus:outline-none " +
                (active
                    ? "  "
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ") +
                className
            }
        >
            {children}
        </Dropdown>
    );
}
