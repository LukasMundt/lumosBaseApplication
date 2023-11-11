import { usePage } from "@inertiajs/react";
import Select from "react-select";
// import { StylesConfig } from 'react-select';

export default function ReactSelect({
    isMulti = false,
    isSearchable = false,
    isClearable = false,
    options,
    id,
    onChange,
    className = "",
    ...props
}) {
    return (
        <Select
            id={id}
            isMulti={isMulti}
            isSearchable={isSearchable}
            isClearable={isClearable}
            options={options}
            onChange={onChange}
            
            classNames={{
                control: (state) =>
                    "border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                option: (state) => "dark:text-gray-300",
                menu: (state) => "dark:bg-gray-800",
                menuPortal: (state) => "bg-red-800",
                multiValueRemove: (state) => "bg-red-300 text-gray-700",
                singleValue: (state) => "dark:text-gray-200 text-gray-800"
            }}
            theme={(theme) => ({
                ...theme,
                // borderRadius: 0,
                colors: {
                    ...theme.colors,
                    primary25: "#94a3b8", // backgroundcolor for selected option in list
                    primary: "#6053e3",
                },
            })}
            {...props}
        />
    );
}
