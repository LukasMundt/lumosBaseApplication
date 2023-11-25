import { Button } from "flowbite-react";
import { useState } from "react";
import PrimaryButton from "./PrimaryButton";
import { router } from "@inertiajs/react";

export default function Drawer({
    showDrawer = false,
    closeOnBackdrop = true,
    right = false,
    bgColor,
    children,
    buttonText,
    redirectToOnClose = "",
}) {
    const [show, setShow] = useState(showDrawer);

    return (
        <>
            <PrimaryButton
                onClick={(e) => {
                    setShow(!show);
                    // document.body.classList.toggle("overflow-hidden");
                }}
            >
                {buttonText ?? "Open Drawer"}
            </PrimaryButton>

            <div
                style={{ margin: 0 }}
                className={
                    "w-screen h-screen z-40 inset-0 fixed " +
                    (show ? "" : "hidden")
                }
            >
                <div
                    className={
                        "w-screen z-1 absolute h-screen inset-0 opacity-50 bg-slate-900"
                    }
                ></div>
                <div
                    className={
                        "h-full z-[100] absolute w-full md:w-2/3 xl:w-3/5 opacity-100 " +
                        (right ? "right-0" : "") +
                        (bgColor ?? "bg-white dark:bg-gray-800")
                    }
                >
                    <button
                        type="button"
                        className="absolute text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 top-2.5 end-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={(e) => {
                            setShow(!show);
                            // document.body.classList.toggle("overflow-hidden");
                            // if (redirectToOnClose != null) {
                            //     router.visit(redirectToOnClose);
                            // }
                        }}
                    >
                        <svg
                            className="w-3 h-3"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 14 14"
                        >
                            <path
                                stroke="currentColor"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                            />
                        </svg>
                        <span className="sr-only">Close menu</span>
                    </button>
                    <div
                        id="drawer-container"
                        className="overflow-y-auto h-screen p-4 lg:p-8 dark:text-gray-300 text-gray-800"
                    >
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
