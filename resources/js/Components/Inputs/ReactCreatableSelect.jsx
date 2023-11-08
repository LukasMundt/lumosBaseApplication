import Select from "react-select";
import CreatableSelect from "react-select/creatable";

export default function ReactCreatableSelect({
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
        <CreatableSelect
            id={id}
            isMulti={isMulti}
            isSearchable={isSearchable}
            isClearable={isClearable}
            options={options}
            onChange={onChange}
            // styles={{
            //     control: (baseStyles, state) => ({
            //         ...baseStyles,
            //         borderColor: state.isFocused ? 'grey' : 'red',
            //         backgroundColor: '#141826',
            //       }),
            // }}
            classNames={{
                control: (state) =>
                    "border-gray-300 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm",
                option: (state) => "dark:text-gray-300",
                menu: (state) => "dark:bg-gray-800",
                multiValueRemove: (state) => "bg-red-300 text-gray-700",
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
            // className={"  "+className}
        />
    );
}
