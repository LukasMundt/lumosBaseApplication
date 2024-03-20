/**
 * example:
 * <AdvancedCheckbox name="roles" mdCols={3}>
 *  <AdvancedCheckboxItem
 *      id="super-admin"
 *      label="SuperAdmin"
 *      subLabel={"Die SuperAdmin-Rolle"}
 *  />
 *  <AdvancedCheckboxItem
 *      id="admin"
 *      label="Admin"
 *      subLabel={"Die Admin-Rolle"}
 *  />
 * </AdvancedCheckbox>
 */
export default function AdvancedCheckbox({
    mdCols = 2,
    lgCols = 2,
    required = true,
    children,
    name = "",
    onChange,
}) {
    return (
        <ul
            className={
                "grid w-full gap-6 " +
                ("md:grid-cols-" + mdCols + " ") +
                ("lg:grid-cols-" + lgCols + " ")
            }
        >
            {children.map((child) => {
                // console.log(child);

                return (
                    <li key={child.props.id}>
                        <input
                            type="checkbox"
                            id={child.props.id}
                            name={name}
                            value={child.props.id}
                            className="hidden peer"
                            required={required}
                            onChange={(e) => onChange(e.target.id)}
                        />
                        <label
                            htmlFor={child.props.id}
                            className="inline-flex items-center justify-between w-full p-5 text-gray-500 bg-white border border-gray-200 rounded-lg cursor-pointer dark:hover:text-gray-300 dark:border-gray-700 dark:peer-checked:text-blue-500 peer-checked:border-blue-600 peer-checked:text-blue-600 hover:text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                            {child}
                        </label>
                    </li>
                );
            })}
        </ul>
    );
}
