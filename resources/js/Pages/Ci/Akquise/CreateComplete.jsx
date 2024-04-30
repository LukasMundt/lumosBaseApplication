import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, usePage } from "@inertiajs/react";
import Create_Form from "./partials/Create_Form";

export default function CreateComplete({}) {
  const { auth } = usePage().props;

  return (
    <AuthenticatedLayout
      user={auth.user}
      header={
        <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
          Projekt erstellen
        </h2>
      }
    >
      <Head title="Projekt erstellen" />

      <div className="py-12">
        <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
          <Create_Form />
        </div>
      </div>
    </AuthenticatedLayout>
  );
}
