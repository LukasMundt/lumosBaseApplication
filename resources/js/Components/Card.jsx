import { Card } from "flowbite-react";

export default function ({
    border = false,
    className = "",
    directClassName = "",
    children,
    ...props
}) {
    return (
        <Card
            className={
                "text-gray-800 dark:text-gray-200 rounded-none md:rounded-lg " +
                (!border ? "border-0 " : " ") +
                className
            }
            {...props}
            
        >
            <div className={directClassName}>{children}</div>
        </Card>
    );
}
