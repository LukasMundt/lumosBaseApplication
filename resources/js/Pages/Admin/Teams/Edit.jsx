import { Head } from "@inertiajs/react";
import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import GenericForm from "./partials/Edit/GenericForm";
import AddUserForm from "./partials/Edit/AddUserForm";
import ManageUsersForm from "./partials/Edit/ManageUsersForm";
import ManageTeamPermissionsForm from "./partials/Edit/ManageTeamPermissionsForm";

export default class Edit extends React.Component {
    render() {
        const { auth, team, users, roles, teamPermissions, teamPermissionsCurrent} = this.props;
        console.log(this.props);

        return (
            <AuthenticatedLayout
                user={auth.user}
                header={
                    <h2 className="font-semibold text-xl text-gray-800 dark:text-gray-200 leading-tight">
                        Team bearbeiten
                    </h2>
                }
            >
                <Head title="Team bearbeiten" />

                <div className="py-12">
                    <div className="max-w-7xl mx-auto sm:px-6 lg:px-8 space-y-6">
                        <GenericForm team={team} />
                        <AddUserForm roles={roles} />
                        <ManageUsersForm team={team} users={users} />
                        <ManageTeamPermissionsForm
                            team={team}
                            teamPermissions={teamPermissions}
                            teamPermissionsCurrent={teamPermissionsCurrent}
                        />
                    </div>
                </div>
            </AuthenticatedLayout>
        );
    }
}
