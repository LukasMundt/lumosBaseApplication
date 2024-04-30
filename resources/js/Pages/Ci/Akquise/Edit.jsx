import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import EditForm from "./partials/EditForm";

export default class Edit extends React.Component {
  render() {
    const { auth, projekt } = this.props;
    
    return (
      <AuthenticatedLayout
        user={auth.user}
        header={
          <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
            {projekt.strasse + " " + projekt.hausnummer}
          </h2>
        }
      >
        <Head title={projekt.strasse + " " + projekt.hausnummer} />

        <div className="py-12">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
            <EditForm />
          </div>
        </div>
      </AuthenticatedLayout>
    );
  }
}
