import { ChevronDownIcon } from "@heroicons/react/24/outline";
import { Dropdown } from "flowbite-react";

export default function NavDropdownItem({
    href,
    active = href === "" ? false : route().current(href),
    label = "Dropdown",
    className = "",
    children,

    ...props
}) {
    return (
        <Dropdown.Item
            {...props}
            inline
            href={route(href)}
            {...props}
            className={
                "inline-flex items-center border-l-2 text-sm font-medium leading-5 transition duration-150 ease-in-out focus:outline-none " +
                (active
                    ? " text-gray-900 dark:text-gray-100 border-indigo-700 "
                    : "border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-700 focus:text-gray-700 dark:focus:text-gray-300 focus:border-gray-300 dark:focus:border-gray-700 ") +
                className
            }
        >
            {children}
        </Dropdown.Item>
    );
}
