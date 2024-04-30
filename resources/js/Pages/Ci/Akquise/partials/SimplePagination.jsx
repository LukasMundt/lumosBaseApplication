import {
  ChevronLeftIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { router } from "@inertiajs/react";
import { Button } from "flowbite-react";
import ButtonGroup from "flowbite-react/lib/esm/components/Button/ButtonGroup";
import React from "react";
import { useForm } from "@inertiajs/react";

export default function SimplePagination({ pagination }) {

  // lädt die parameter der aktuellen Seite in ein Array
  let paramsRaw = new URLSearchParams(window.location.search)
    .toString()
    .split("&");
  const params = {};
  paramsRaw.map((param) => {
    let split = param.split("=");
    params[split[0]] = decodeURI(split[1]);
  });

  const handleClick = (page) => {
    params["page"] = page;
    router.get(route(route().current()), params);
  };

  return (
    <div className="">
      {/* <div className="w-16"></div> */}
      <ButtonGroup>
        {/* <Button
          color="gray"
          disabled={pagination.current_page === 1}
          href={
            pagination.current_page === 1
              ? ""
              : route(route().current(), {
                  ...params,
                  page: 1,
                })
          }
          title="First"
        >
          <ChevronDoubleLeftIcon className="w-5" />
        </Button> */}
        <Button
          color="gray"
          disabled={pagination.prev_page_url === null}
          href={
            pagination.prev_page_url === null
              ? ""
              : route(route().current(), {
                  ...params,
                  page: pagination.current_page - 1,
                })
          }
          title="Previous"
        >
          <ChevronLeftIcon className="w-5" />
        </Button>
        {/* <Button color="gray" className=""></Button> */}
        <Button color="dark" href="">
          {pagination.current_page}
        </Button>
        {/* <Button color="gray"></Button> */}
        <Button
          color="gray"
          disabled={pagination.next_page_url === null}
          href={
            pagination.next_page_url === null
              ? ""
              : route(route().current(), {
                  ...params,
                  page: pagination.current_page + 1,
                })
          }
          title="Next"
        >
          <ChevronRightIcon className="w-5" />
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
