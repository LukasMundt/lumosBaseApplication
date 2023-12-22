import { Card } from "flowbite-react";

export default function ({
    border = false,
    className = "",
    directClassName = "",
    children,
    color="",
    ...props
}) {
    return (
        <Card
            className={
                "default-text-color rounded-none md:rounded-lg " +
                (!border ? "border-0 " : " ") +
                className
            }
            {...props}
            color={color}
        >
            <div className={directClassName}>{children}</div>
        </Card>
    );
}
