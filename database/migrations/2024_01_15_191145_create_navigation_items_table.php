<?php

use App\Models\NavItem;
use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $tableName = 'navigation_items';
        if (!Schema::hasTable($tableName)) {
            Schema::create($tableName, function (Blueprint $table) {
                $table->ulid("id")->primary();
                $table->ulid('top_item')->nullable();
                // $table->string('scope')->comment('teams;all');
                // $table->unsignedBigInteger('domain')->nullable()
                // (Team::class, 'domain')
                //     ->constrained('teams', 'id', 'team')
                //     ->cascadeOnUpdate()
                //     ->cascadeOnDelete()
                // ->comment("Team ist Domain, wenn null dann domain=personal");
                $table->json("permissions")->nullable();
                $table->json("team_permissions")->nullable();
                $table->json("roles")->nullable();
                $table->string("label", 255);
                $table->string("route", 255);
                $table->json("params")->nullable();

                $table->timestamps();
            });
        }


        // NavItem::factory()->create(['label' => 'Dashboard', 'permissions' => [], 'roles' => [], 'route' => 'dashboard']);

        $verwaltungRoles = ['team_specific' => ['super-admin', 'admin']];


        $admin = NavItem::create(['label' => 'Verwaltung', 'permissions' => [], 'roles' => $verwaltungRoles, 'route' => 'admin.index']);
        NavItem::create(['label' => 'Benutzer', 'permissions' => [], 'roles' => $verwaltungRoles, 'route' => 'admin.users.index', 'top_item' => $admin->fresh()->id]);
        NavItem::create(['label' => 'Rollen', 'permissions' => [], 'roles' => $verwaltungRoles, 'route' => 'admin.roles.index', 'top_item' => $admin->fresh()->id]);
        NavItem::create(['label' => 'Teams', 'permissions' => [], 'roles' => $verwaltungRoles, 'route' => 'admin.teams.index', 'top_item' => $admin->fresh()->id]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('navigation_items');
    }
};
