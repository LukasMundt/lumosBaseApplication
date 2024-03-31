import {
    Bell,
    ChevronsUpDown,
    CircleUser,
    Home,
    Menu,
    ShoppingCart,
    Sun,
    Users,
} from "lucide-react";

import { Badge } from "@/Components/ui/badge";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLinkItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/Components/ui/collapsible";
import { Input } from "@/Components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/Components/ui/sheet";
import { Link, usePage } from "@inertiajs/react";
import { ThemeProvider } from "../Components/theme-provider";
import { useTheme } from "../Components/theme-provider";
import ApplicationLogo from "@/Components/ApplicationLogo";
import { TeamCombobox } from "../Components/TeamCombobox";

export default function Authenticated({ user, header, children }) {
    const { nav, teams } = usePage().props;
    var { domain } = usePage().props;

    if (domain === null) {
        domain = 0; // global/default team
    }
    return (
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
                <div className="hidden border-r bg-muted/40 md:block">
                    <div className="flex h-full max-h-screen flex-col gap-2">
                        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                            <Link
                                href="/"
                                className="flex items-center gap-2 font-semibold"
                            >
                                <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />

                                <span className=" default-text-color text-2xl">
                                    Lumos
                                </span>
                            </Link>
                            <Button
                                variant="outline"
                                size="icon"
                                className="ml-auto h-8 w-8"
                                disabled
                            >
                                <Bell className="h-4 w-4" />
                                <span className="sr-only">
                                    Toggle notifications
                                </span>
                            </Button>
                        </div>
                        <div className="flex-1">
                            <div className="px-4">
                                <TeamCombobox
                                    teams={teams}
                                    className=""
                                    currentTeam={domain}
                                />
                            </div>
                            <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
                                {nav === null
                                    ? ""
                                    : nav.map((navItem) => {
                                          if (navItem.childs.length === 0) {
                                              return (
                                                  <Link
                                                      href={route(
                                                          navItem.route,
                                                          {
                                                              domain: domain,
                                                          }
                                                      )}
                                                      key={navItem.id}
                                                  >
                                                      {navItem.label}
                                                  </Link>
                                              );
                                          } else {
                                              return (
                                                  <Collapsible key={navItem.id}>
                                                      <CollapsibleTrigger className="flex items-center gap-3 rounded-lg mt-2 px-4 py-2 text-muted-foreground transition-all hover:text-primary justify-between w-full">
                                                          <div className="flex items-center gap-4">
                                                              <Home className="h-5 w-5" />
                                                              {navItem.label}
                                                          </div>
                                                          <ChevronsUpDown className="h-4 w-4" />
                                                      </CollapsibleTrigger>
                                                      <CollapsibleContent>
                                                          {navItem.childs.map(
                                                              (
                                                                  navDropdownItem
                                                              ) => {
                                                                  return (
                                                                      <Link
                                                                          key={
                                                                              navDropdownItem.id
                                                                          }
                                                                          href={route(
                                                                              navDropdownItem.route,
                                                                              {
                                                                                  domain: domain,
                                                                              }
                                                                          )}
                                                                          className="flex items-center gap-3 ml-5 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary"
                                                                      >
                                                                          <Home className="h-4 w-4" />
                                                                          {
                                                                              navDropdownItem.label
                                                                          }
                                                                      </Link>
                                                                  );
                                                              }
                                                          )}
                                                      </CollapsibleContent>
                                                  </Collapsible>
                                              );
                                          }
                                      })}
                            </nav>
                        </div>
                        {/* <div className="mt-auto p-4">
                            <Card>
                                <CardHeader className="p-2 pt-0 md:p-4">
                                    <CardTitle>Upgrade to Pro</CardTitle>
                                    <CardDescription>
                                        Unlock all features and get unlimited
                                        access to our support team.
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-2 pt-0 md:p-4 md:pt-0">
                                    <Button size="sm" className="w-full">
                                        Upgrade
                                    </Button>
                                </CardContent>
                            </Card>
                        </div> */}
                    </div>
                </div>
                <div className="flex flex-col w-full">
                    <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="shrink-0 md:hidden"
                                >
                                    <Menu className="h-5 w-5" />
                                    <span className="sr-only">
                                        Toggle navigation menu
                                    </span>
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="left" className="flex flex-col">
                                <nav className="grid gap-2 text-lg font-medium">
                                    <Link
                                        href="#"
                                        className="flex items-center gap-2 text-lg font-semibold"
                                    >
                                        <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />

                                        <span className="sr-only">Lumos</span>
                                    </Link>
                                    <TeamCombobox
                                        teams={teams}
                                        currentTeam={domain}
                                    />
                                    {nav === null
                                        ? ""
                                        : nav.map((navItem) => {
                                              if (navItem.childs.length === 0) {
                                                  return (
                                                      <Link
                                                          href={route(
                                                              navItem.route,
                                                              {
                                                                  domain: domain,
                                                              }
                                                          )}
                                                          key={navItem.id}
                                                          className=" flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                                      >
                                                          {navItem.label}
                                                      </Link>
                                                  );
                                              } else {
                                                  return (
                                                      <Collapsible
                                                          key={navItem.id}
                                                      >
                                                          <CollapsibleTrigger className=" flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground justify-between w-full">
                                                              <div className="flex items-center gap-4">
                                                                  <Home className="h-5 w-5" />
                                                                  {
                                                                      navItem.label
                                                                  }
                                                              </div>
                                                              <ChevronsUpDown className="h-4 w-4" />
                                                          </CollapsibleTrigger>
                                                          <CollapsibleContent>
                                                              {navItem.childs.map(
                                                                  (
                                                                      navDropdownItem
                                                                  ) => {
                                                                      return (
                                                                          <Link
                                                                              key={
                                                                                  navDropdownItem.id
                                                                              }
                                                                              href={route(
                                                                                  navDropdownItem.route,
                                                                                  {
                                                                                      domain: domain,
                                                                                  }
                                                                              )}
                                                                              className="ml-5 flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                                                          >
                                                                              <Home className="h-5 w-5" />
                                                                              {
                                                                                  navDropdownItem.label
                                                                              }
                                                                          </Link>
                                                                      );
                                                                  }
                                                              )}
                                                          </CollapsibleContent>
                                                      </Collapsible>
                                                  );
                                              }
                                          })}

                                    {/* <Link
                                        href="#"
                                        className=" flex items-center gap-4 rounded-xl bg-muted px-3 py-2 text-foreground hover:text-foreground"
                                    >
                                        <ShoppingCart className="h-5 w-5" />
                                        Orders
                                        <Badge className="ml-auto flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                                            6
                                        </Badge>
                                    </Link> */}
                                </nav>
                                {/* <div className="mt-auto">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Upgrade to Pro
                                            </CardTitle>
                                            <CardDescription>
                                                Unlock all features and get
                                                unlimited access to our support
                                                team.
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Button
                                                size="sm"
                                                className="w-full"
                                            >
                                                Upgrade
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </div> */}
                            </SheetContent>
                        </Sheet>
                        <div className="w-full flex-1">
                            {/* <form>
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input
                                        type="search"
                                        placeholder="Search products..."
                                        className="w-full appearance-none bg-background pl-8 shadow-none md:w-2/3 lg:w-1/3"
                                    />
                                </div>
                            </form> */}
                        </div>

                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button
                                    variant="secondary"
                                    size="icon"
                                    className="rounded-full"
                                >
                                    <CircleUser className="h-5 w-5" />
                                    <span className="sr-only">
                                        Toggle user menu
                                    </span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                                <DropdownMenuLabel>
                                    {user.name}
                                </DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuLinkItem
                                    href={route("profile.edit")}
                                >
                                    Profil
                                </DropdownMenuLinkItem>
                                {/* <DropdownMenuItem>Support</DropdownMenuItem> */}
                                <DropdownMenuSeparator />
                                <DropdownMenuLinkItem
                                    href={route("logout")}
                                    method="post"
                                >
                                    Logout
                                </DropdownMenuLinkItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </header>
                    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
                        <div className="flex items-center">
                            {/* <h1 className="text-lg font-semibold md:text-2xl">
                                Inventory
                            </h1> */}
                            {header}
                        </div>
                        {/* <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                            <div className="flex flex-col items-center gap-1 text-center">
                                <h3 className="text-2xl font-bold tracking-tight">
                                    You have no products
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    You can start selling as soon as you add a
                                    product.
                                </p>
                                <Button className="mt-4">Add Product</Button>
                            </div>
                        </div> */}
                        {children}
                    </main>
                </div>
            </div>
        </ThemeProvider>
    );
}

// import { useState } from "react";
// import React from "react";
// import ApplicationLogo from "@/Components/ApplicationLogo";
// import Dropdown from "@/Components/Dropdown";
// import { Link, usePage } from "@inertiajs/react";
// import { Button, Sidebar } from "flowbite-react";
// import { MoonIcon, SunIcon } from "@heroicons/react/24/solid";
// import { Bars3BottomLeftIcon } from "@heroicons/react/24/outline";

// export default function Authenticated({ user, header, children }) {
//     const [showingNavigationDropdown, setShowingNavigationDropdown] =
//         useState(false);

//     const { nav, teams } = usePage().props;
//     var { domain } = usePage().props;

//     if (domain === null) {
//         domain = 0; // global/default team
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
//             {/* Sidebar */}

//             <aside
//                 id="default-sidebar"
//                 className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0"
//                 aria-labelledby="default-sidebar-label"
//                 tabIndex="40"
//             >
//                 <div
//                     id="default-sidebar-label"
//                     className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700"
//                 >
//                     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//                         <div className="flex h-16">
//                             <div className="shrink-0 flex items-center">
//                                 <Link href="/">
//                                     <ApplicationLogo className="block h-9 w-auto fill-current text-gray-800 dark:text-gray-200" />
//                                 </Link>

//                                 <div className="pl-4 default-text-color text-2xl">
//                                     Lumos
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//                 <Sidebar
//                     aria-label="Sidebar with multi-level dropdown example"
//                     theme={{
//                         root: {
//                             inner: "h-full overflow-y-auto overflow-x-hidden bg-gray-100 py-4 px-3 dark:bg-gray-900",
//                         },
//                     }}
//                 >
//                     <Sidebar.Items>
//                         <Sidebar.ItemGroup>
//                             {nav === null
//                                 ? ""
//                                 : nav.map((navItem) => {
//                                       if (navItem.childs.length === 0) {
//                                           return (
//                                               <Sidebar.Item
//                                                   href={route(navItem.route, {
//                                                       domain: domain,
//                                                   })}
//                                                   key={navItem.id}
//                                               >
//                                                   {navItem.label}
//                                               </Sidebar.Item>
//                                           );
//                                       } else {
//                                           return (
//                                               <Sidebar.Collapse
//                                                   label={navItem.label}
//                                                   key={navItem.id}
//                                               >
//                                                   {navItem.childs.map(
//                                                       (navDropdownItem) => {
//                                                           return (
//                                                               <Sidebar.Item
//                                                                   key={
//                                                                       navDropdownItem.id
//                                                                   }
//                                                                   href={route(
//                                                                       navDropdownItem.route,
//                                                                       {
//                                                                           domain: domain,
//                                                                       }
//                                                                   )}
//                                                               >
//                                                                   {
//                                                                       navDropdownItem.label
//                                                                   }
//                                                               </Sidebar.Item>
//                                                           );
//                                                       }
//                                                   )}
//                                               </Sidebar.Collapse>
//                                           );
//                                       }
//                                   })}
//                             {/* <Sidebar.Item href="#" icon={ChartPieIcon}>
//                                 Dashboard
//                             </Sidebar.Item>
//                             <Sidebar.Collapse label="E-commerce">
//                                 <Sidebar.Item href="#">Products</Sidebar.Item>
//                                 <Sidebar.Item href="#">Sales</Sidebar.Item>
//                                 <Sidebar.Item href="#">Refunds</Sidebar.Item>
//                                 <Sidebar.Item href="#">Shipping</Sidebar.Item>
//                             </Sidebar.Collapse>
//                             <Sidebar.Item href="#">Inbox</Sidebar.Item>
//                             <Sidebar.Item href="#">Users</Sidebar.Item>
//                             <Sidebar.Item href="#">Products</Sidebar.Item>
//                             <Sidebar.Item href="#">Sign In</Sidebar.Item>
//                             <Sidebar.Item href="#">Sign Up</Sidebar.Item> */}
//                         </Sidebar.ItemGroup>
//                     </Sidebar.Items>
//                 </Sidebar>
//             </aside>

//             {/* Main */}
//             <div className="w-screen sm:pl-64">
//                 <div className="w-full relative">
//                     {/* NavLeiste */}
//                     <nav className="bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-gray-700 absolute fixed w-full top-0 z-[200]">
//                         <div className=" mx-auto px-4 sm:px-6 lg:px-8">
//                             <div className="flex justify-between h-16">
//                                 <div className="-mr-2 flex items-center sm:invisible">
//                                     <button
//                                         data-drawer-target="default-sidebar"
//                                         data-drawer-toggle="default-sidebar"
//                                         // data-drawer-show="default-sidebar"
//                                         aria-controls="default-sidebar"
//                                         type="button"
//                                         className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
//                                     >
//                                         <span className="sr-only">
//                                             Open sidebar
//                                         </span>
//                                         <Bars3BottomLeftIcon className="w-7" />
//                                     </button>
//                                 </div>

//                                 <div className="flex items-center ml-6">
//                                     <Dropdown>
//                                         <Dropdown.Trigger>
//                                             <span className="inline-flex rounded-md">
//                                                 <button
//                                                     type="button"
//                                                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
//                                                 >
//                                                     Bereich wählen
//                                                     <svg
//                                                         className="ml-2 -mr-0.5 h-4 w-4"
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 20 20"
//                                                         fill="currentColor"
//                                                     >
//                                                         <path
//                                                             fillRule="evenodd"
//                                                             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                                             clipRule="evenodd"
//                                                         />
//                                                     </svg>
//                                                 </button>
//                                             </span>
//                                         </Dropdown.Trigger>

//                                         <Dropdown.Content>
//                                             <Dropdown.Link
//                                                 href={route(
//                                                     "domain.dashboard",
//                                                     {
//                                                         domain: "personal",
//                                                     }
//                                                 )}
//                                             >
//                                                 Persönlich
//                                             </Dropdown.Link>
//                                             <Dropdown.Divider />
//                                             {teams.map((team) => {
//                                                 return (
//                                                     <Dropdown.Link
//                                                         href={route(
//                                                             "domain.dashboard",
//                                                             { domain: team.id }
//                                                         )}
//                                                     >
//                                                         {team.name}
//                                                     </Dropdown.Link>
//                                                 );
//                                             })}
//                                         </Dropdown.Content>
//                                     </Dropdown>

//                                     <Dropdown>
//                                         <Dropdown.Trigger>
//                                             <span className="inline-flex rounded-md">
//                                                 <button
//                                                     type="button"
//                                                     className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none transition ease-in-out duration-150"
//                                                 >
//                                                     {user.name}

//                                                     <svg
//                                                         className="ml-2 -mr-0.5 h-4 w-4"
//                                                         xmlns="http://www.w3.org/2000/svg"
//                                                         viewBox="0 0 20 20"
//                                                         fill="currentColor"
//                                                     >
//                                                         <path
//                                                             fillRule="evenodd"
//                                                             d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
//                                                             clipRule="evenodd"
//                                                         />
//                                                     </svg>
//                                                 </button>
//                                             </span>
//                                         </Dropdown.Trigger>

//                                         <Dropdown.Content>
//                                             <Dropdown.Item>
//                                                 <Button
//                                                     color="gray"
//                                                     className={
//                                                         "text-gray-800 dark:text-gray-200 p-0 w-full"
//                                                     }
//                                                     onClick={() =>
//                                                         document.documentElement.classList.toggle(
//                                                             "dark"
//                                                         )
//                                                     }
//                                                 >
//                                                     <SunIcon
//                                                         className={
//                                                             "w-5 hidden dark:flex"
//                                                         }
//                                                     />
//                                                     <MoonIcon
//                                                         className={
//                                                             "w-5 dark:hidden flex"
//                                                         }
//                                                     />
//                                                 </Button>
//                                             </Dropdown.Item>
//                                             <Dropdown.Divider />
//                                             <Dropdown.Link
//                                                 href={route("profile.edit")}
//                                             >
//                                                 Profile
//                                             </Dropdown.Link>
//                                             <Dropdown.Link
//                                                 href={route("logout")}
//                                                 method="post"
//                                                 as="button"
//                                             >
//                                                 Log Out
//                                             </Dropdown.Link>
//                                         </Dropdown.Content>
//                                     </Dropdown>
//                                 </div>
//                             </div>
//                         </div>
//                     </nav>
//                 </div>

//                 {/* tatsächlicher Content der Seite */}
//                 <div className="h-screen pt-16">
//                     <div className="h-full flex flex-col overflow-auto">
//                         {/* Header unter Nav Leiste */}
//                         {header && (
//                             <header className="bg-white dark:bg-gray-800 shadow flex-shrink">
//                                 <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
//                                     Breadcrumbs
//                                     {header}
//                                 </div>
//                             </header>
//                         )}
//                         <main className="flex-grow relative">{children}</main>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// }
