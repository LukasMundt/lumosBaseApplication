<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionAndRoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        setPermissionsTeamId(0); // set to global team

        Permission::findOrCreate('create-global-role', 'web');
        Permission::findOrCreate('edit-global-role', 'web');
        Permission::findOrCreate('delete-global-role', 'web');
        Permission::findOrCreate('view-global-roles', 'web');

        Permission::findOrCreate('edit-global-admin', 'web');
        Permission::findOrCreate('delete-global-admin', 'web');

        Permission::findOrCreate('create-user', 'web');
        Permission::findOrCreate('edit-user', 'web');
        Permission::findOrCreate('delete-user', 'web');
        Permission::findOrCreate('view-all-users', 'web');

        Permission::findOrCreate('edit-user-in-own-team', 'web');
        Permission::findOrCreate('view-team-members', 'web');

        Permission::findOrCreate('manage-all-teams', 'web');
        Permission::findOrCreate('manage-own-team', 'web');
        Permission::findOrCreate('manage-users-of-own-team', 'web');
        Permission::findOrCreate('manage-team-permissions', 'web');


        $role = Role::findOrCreate('admin', 'web');
        $role->syncPermissions(['create-global-role', 'edit-global-role', 'delete-global-role', 'create-user', 'view-global-roles', 'edit-user', 'delete-user', 'manage-all-teams', 'view-all-users']);

        $role = Role::findOrCreate('super-admin', 'web');

        $role = Role::findOrCreate('team-owner', 'web'); // and who pays for the team ressources
        $role->syncPermissions(['manage-own-team', 'manage-users-of-own-team', 'create-user', 'edit-user-in-own-team', 'view-team-members']);

        $role = Role::findOrCreate('team-admin', 'web');
        $role->syncPermissions(['manage-own-team', 'manage-users-of-own-team', 'create-user', 'edit-user-in-own-team', 'view-team-members']);

        $role = Role::findOrCreate('team-contributor', 'web');
        $role->syncPermissions(['view-team-members']);
    }
}
