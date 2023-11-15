import {
    ChevronDoubleLeftIcon,
    ChevronDoubleRightIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Link, router, usePage } from "@inertiajs/react";
import { Button, Select } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import React from "react";
import { useForm } from "@inertiajs/react";

export default function Pagination({ last_page = 1, current_page = 1 }) {
    const { get } = useForm();
    // console.log(pagination);

    // lädt die parameter der aktuellen Seite in ein Array
    let paramsRaw = new URLSearchParams(window.location.search)
        .toString()
        .split("&");
    const params = {};
    paramsRaw.map((param) => {
        if (param !== "") {
            let split = param.split("=");
            params[split[0]] = decodeURI(split[1]);
        }
    });

    return (
        <div className="w-full flex justify-center">
            {/* <div className="w-16"></div> */}
            <ButtonGroup>
                <Button
                    color="gray"
                    disabled={current_page === 1}
                    href={
                        current_page === 1
                            ? ""
                            : route(route().current(), {
                                  ...params,
                                  page: 1,
                              })
                    }
                    title="First"
                >
                    <ChevronDoubleLeftIcon className="w-5" />
                </Button>
                <Button
                    color="gray"
                    disabled={current_page === 1}
                    href={
                        current_page === 1
                            ? ""
                            : route(route().current(), {
                                  ...params,
                                  page: current_page - 1,
                              })
                    }
                    title="Previous"
                >
                    <ChevronLeftIcon className="w-5" />
                </Button>
                {/* <Button color="gray" className=""></Button> */}
                <Button color="dark" href="">
                    {current_page}
                </Button>
                {/* <Button color="gray"></Button> */}
                <Button
                    color="gray"
                    disabled={current_page === last_page}
                    href={
                        current_page === last_page
                            ? ""
                            : route(route().current(), {
                                  ...params,
                                  page: current_page + 1,
                              })
                    }
                    title="Next"
                >
                    <ChevronRightIcon className="w-5" />
                </Button>
                <Button
                    color="gray"
                    disabled={last_page === current_page}
                    href={
                        last_page === current_page
                            ? ""
                            : route(route().current(), {
                                  ...params,
                                  page: last_page,
                              })
                    }
                    title="Last"
                >
                    <ChevronDoubleRightIcon className="w-5" />
                </Button>
            </ButtonGroup>
            {/* <Select className="order-last">
        <option value="15">15</option>
        <option value="25">25</option>
        <option value="50">50</option>
      </Select> */}
        </div>
    );
}
