/**
 * example:
 * <AdvancedRadio name="roles" mdCols={3}>
 *  <AdvancedRadioItem 
 *      id="super-admin"
 *      label="SuperAdmin"
 *      subLabel={"Die SuperAdmin-Rolle"}
 *  />
 *  <AdvancedRadioItem
 *      id="admin"
 *      label="Admin"
 *      subLabel={"Die Admin-Rolle"}
 *  />
 * </AdvancedRadio>
 */
export default function AdvancedRadioItem({
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
