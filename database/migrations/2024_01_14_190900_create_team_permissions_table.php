<?php

use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Spatie\Permission\Models\Permission;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('team_has_permissions', function (Blueprint $table) {
            $table->foreignIdFor(Team::class, 'team_id');
            $table->foreignIdFor(Permission::class, 'permission_id');

            $table->index(['team_id', 'permission_id'], 'unique_index');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('team_has_permissions');
    }
};
