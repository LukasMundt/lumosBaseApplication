<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateBasicRoleSet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'create-basic-role-set';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();
        setPermissionsTeamId(0);

        Permission::findOrCreate('create-role','web');
        Permission::findOrCreate('edit-role','web');
        Permission::findOrCreate('delete-role','web');
        Permission::findOrCreate('view-roles', 'web');

        Permission::findOrCreate('edit-admin','web');
        Permission::findOrCreate('delete-admin','web');

        Permission::findOrCreate('create-user','web');
        Permission::findOrCreate('edit-user','web');
        Permission::findOrCreate('delete-user','web');
        // Permission::findOrCreate('view-all-users-list', 'web');

        Permission::findOrCreate('create-team','web');
        Permission::findOrCreate('edit-team','web');
        Permission::findOrCreate('delete-team','web');

        // Permission::findOrCreate('use-api','api');

        $role = Role::findOrCreate('admin','web');
        $role->syncPermissions(['create-user','edit-user','delete-user', 'create-team', 'edit-team', 'delete-team']);

        $role = Role::findOrCreate('super-admin','web');
        $role->syncPermissions(Permission::all());
    }
}
