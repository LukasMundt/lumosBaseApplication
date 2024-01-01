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
export default function AdvancedCheckboxItem({
    iconLeft,
    iconRight,
    label = "",
    subLabel,
    id = "",
}) {
    return (
        <div className="flex justify-between">
            {iconLeft}
            <div>
                <p className="text-lg font-semibold">{label}</p>
                {subLabel}
            </div>
            {iconRight}
        </div>
    );
}
