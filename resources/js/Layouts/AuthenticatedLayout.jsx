import { useState } from "react";
import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/Navigation/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage } from "@inertiajs/react";
import { Badge, Button, Select, Sidebar } from "flowbite-react";
import {
    ChartPieIcon,
    Cog6ToothIcon,
    MoonIcon,
    SunIcon,
} from "@heroicons/react/24/solid";
import NavDropdown from "@/Components/Navigation/NavDropdown";
import NavDropdownItem from "@/Components/Navigation/NavDropdownItem";
import NavDropdownDivider from "@/Components/Navigation/NavDropdownDivider";
import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

export default function Authenticated({ user, header, children }) {
    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);

    const { nav, teams } = usePage().props;
    var { domain } = usePage().props;

    if (domain === null) {
        domain = 0; // global/default team
    }

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            {/* Sidebar */}
            <aside
                id="default-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
                aria-label="Sidebar"
            >
                <div className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex h-16">
                            <div className="shrink-0 flex items-center">
                                <Link href="/">
                                    <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
                                </Link>

                                <div className="pl-4 default-text-color text-2xl">
                                    Lumos
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <Sidebar
                    aria-label="Sidebar with multi-level dropdown example"
                    theme={{
                        root: {
                            inner: "h-full overflow-y-auto overflow-x-hidden bg-gray-100 py-4 px-3 dark:bg-gray-900",
                        },
                    }}
                >
                    <Sidebar.Items>
                        <Sidebar.ItemGroup>
                            {nav === null
                                ? ""
                                : nav.map((navItem) => {
                                      if (navItem.childs.length === 0) {
                                          return (
                                              <Sidebar.Item
                                                  href={route(navItem.route, {
                                                      domain: domain,
                                                  })}
                                                  key={navItem.id}
                                              >
                                                  {navItem.label}
                                              </Sidebar.Item>
                                          );
                                      } else {
                                          return (
                                              <Sidebar.Collapse
                                                  label={navItem.label}
                                                  key={navItem.id}
                                              >
                                                  {navItem.childs.map(
                                                      (navDropdownItem) => {
                                                          return (
                                                              <Sidebar.Item
                                                                  key={
                                                                      navDropdownItem.id
                                                                  }
                                                                  href={route(
                                                                      navDropdownItem.route,
                                                                      {
                                                                          domain: domain,
                                                                      }
                                                                  )}
                                                              >
                                                                  {
                                                                      navDropdownItem.label
                                                                  }
                                                              </Sidebar.Item>
                                                          );
                                                      }
                                                  )}
                                              </Sidebar.Collapse>
                                          );
                                      }
                                  })}
                            {/* <Sidebar.Item href="#" icon={ChartPieIcon}>
                                Dashboard
                            </Sidebar.Item>
                            <Sidebar.Collapse label="E-commerce">
                                <Sidebar.Item href="#">Products</Sidebar.Item>
                                <Sidebar.Item href="#">Sales</Sidebar.Item>
                                <Sidebar.Item href="#">Refunds</Sidebar.Item>
                                <Sidebar.Item href="#">Shipping</Sidebar.Item>
                            </Sidebar.Collapse>
                            <Sidebar.Item href="#">Inbox</Sidebar.Item>
                            <Sidebar.Item href="#">Users</Sidebar.Item>
                            <Sidebar.Item href="#">Products</Sidebar.Item>
                            <Sidebar.Item href="#">Sign In</Sidebar.Item>
                            <Sidebar.Item href="#">Sign Up</Sidebar.Item> */}
                        </Sidebar.ItemGroup>
                    </Sidebar.Items>
                </Sidebar>
            </aside>

            {/* Main */}
            <div className="w-screen sm:pl-64">
                <div className="w-full relative">
                    {/* NavLeiste */}
                    <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 absolute fixed w-full top-0 z-[200]">
                        <div className=" mx-auto px-4 sm:px-6 lg:px-8">
                            <div className="flex justify-between h-16">
                                <div className="-mr-2 flex items-center sm:invisible">
                                    <button
                                        data-drawer-target="default-sidebar"
                                        data-drawer-toggle="default-sidebar"
                                        aria-controls="default-sidebar"
                                        type="button"
                                        className="inline-flex items-center p-2   text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
                                    >
                                        <span className="sr-only">
                                            Open sidebar
                                        </span>
                                        <Bars3BottomLeftIcon className="w-7" />
                                    </button>
                                </div>

                                <div className="flex items-center ml-6">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    Bereich wählen
                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Link
                                                href={route(
                                                    "domain.dashboard",
                                                    {
                                                        domain: "personal",
                                                    }
                                                )}
                                            >
                                                Persönlich
                                            </Dropdown.Link>
                                            <Dropdown.Divider />
                                            {teams.map((team) => {
                                                return (
                                                    <Dropdown.Link
                                                        href={route(
                                                            "domain.dashboard",
                                                            { domain: team.id }
                                                        )}
                                                    >
                                                        {team.name}
                                                    </Dropdown.Link>
                                                );
                                            })}
                                        </Dropdown.Content>
                                    </Dropdown>

                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <span className="inline-flex rounded-md">
                                                <button
                                                    type="button"
                                                    className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
                                                >
                                                    {user.name}

                                                    <svg
                                                        className="ml-2 -mr-0.5 h-4 w-4"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        viewBox="0 0 20 20"
                                                        fill="currentColor"
                                                    >
                                                        <path
                                                            fillRule="evenodd"
                                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                            clipRule="evenodd"
                                                        />
                                                    </svg>
                                                </button>
                                            </span>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content>
                                            <Dropdown.Item>
                                                <Button
                                                    color="gray"
                                                    className={
                                                        "text-gray-800 dark:text-gray-200 p-0 w-full"
                                                    }
                                                    onClick={() =>
                                                        document.documentElement.classList.toggle(
                                                            "dark"
                                                        )
                                                    }
                                                >
                                                    <SunIcon
                                                        className={
                                                            "w-5 hidden dark:flex"
                                                        }
                                                    />
                                                    <MoonIcon
                                                        className={
                                                            "w-5 dark:hidden flex"
                                                        }
                                                    />
                                                </Button>
                                            </Dropdown.Item>
                                            <Dropdown.Divider />
                                            <Dropdown.Link
                                                href={route("profile.edit")}
                                            >
                                                Profile
                                            </Dropdown.Link>
                                            <Dropdown.Link
                                                href={route("logout")}
                                                method="post"
                                                as="button"
                                            >
                                                Log Out
                                            </Dropdown.Link>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>

                {/* tatsächlicher Content der Seite */}
                <div className="h-screen pt-16">
                    <div className="h-full flex flex-col overflow-auto">
                        {/* Header unter Nav Leiste */}
                        {header && (
                            <header className="bg-white dark:bg-gray-800 shadow flex-shrink">
                                <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                                    Breadcrumbs
                                    {header}
                                </div>
                            </header>
                        )}
                        <main className="flex-grow relative">{children}</main>
                    </div>
                </div>
            </div>
        </div>
    );
}
