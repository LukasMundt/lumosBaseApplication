import { Textarea } from "flowbite-react";
import { forwardRef, useEffect, useRef } from "react";

export default forwardRef(function TextareaInput(
    { className = "", isFocused = false, maxLength = 0, ...props },
    ref
) {
    const input = ref ? ref : useRef();

    useEffect(() => {
        if (isFocused) {
            input.current.focus();
        }
    }, []);

    return (
        <>
            <Textarea
                maxLength={maxLength===0?undefined:maxLength}
                {...props}
                className={
                    "border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 focus:border-indigo-500 dark:focus:border-indigo-600 focus:ring-indigo-500 dark:focus:ring-indigo-600 rounded-md shadow-sm " +
                    className
                }
                ref={input}
            />
            {/* {maxLength===undefined?"":<span className="float-right text-sm text-gray-400">{input.current.value===undefined?0:input.current.value.length*1} / {maxLength}</span>} */}
        </>
    );
});
