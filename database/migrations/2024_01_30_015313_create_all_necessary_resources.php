<?php

use App\Models\NavItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // creating team permission
        Permission::findOrCreate('tp-lumos-akquise-basic');

        $viewOwn = Permission::findOrCreate('lumos-akquise-view-own-projects', 'web');
        $viewAll = Permission::findOrCreate('lumos-akquise-view-all-projects', 'web');

        $create = Permission::findOrCreate('lumos-akquise-create-project', 'web');

        $editOwn = Permission::findOrCreate('lumos-akquise-edit-own-project', 'web');
        $editAll = Permission::findOrCreate('lumos-akquise-edit-all-projects', 'web');

        $deleteOwn = Permission::findOrCreate('lumos-akquise-delete-own-project', 'web');
        $deleteAll = Permission::findOrCreate('lumos-akquise-delete-all-projects', 'web');

        setPermissionsTeamId(0);

        $admin = Role::findOrCreate('team-admin', 'web');
        $owner = Role::findOrCreate('team-owner', 'web');
        $editor = Role::findOrCreate('team-akquise-editor', 'web');
        $contributor = Role::findOrCreate('team-akquise-contributor', 'web');

        $admin->givePermissionTo([$viewAll, $create, $editAll, $deleteAll]);
        $owner->givePermissionTo([$viewAll, $create, $editAll, $deleteAll]);
        $editor->givePermissionTo([$viewAll, $create, $editOwn, $deleteOwn]);
        $contributor->givePermissionTo([$viewOwn, $create, $editOwn]);

        $top = NavItem::factory()->create([
            "team_permissions" => ['tp-lumos-akquise-basic'],
            "label" => "Akquise",
            'route' => "akquise.dashboard",
        ]);
        NavItem::factory()->create([
            'top_item' => $top,
            "team_permissions" => ['tp-lumos-akquise-basic'],
            "label" => "Index",
            'route' => "akquise.akquise.index",
        ]);
        NavItem::factory()->create([
            'top_item' => $top,
            "team_permissions" => ['tp-lumos-akquise-basic'],
            "label" => "Karte",
            'route' => "akquise.akquise.map",
        ]);
    }

    /**
     * Reverse the migrations.
     */
    // public function down(): void
    // {
    //     Schema::dropIfExists('akquise_akquise');
    // }
};
