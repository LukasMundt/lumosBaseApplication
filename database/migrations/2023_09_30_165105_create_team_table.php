<?php

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
        if (!Schema::hasTable('teams')) {
            Schema::create('teams', function (Blueprint $table) {
                $table->id();
                $table->string('name', 155);
                $table->tinyText('description')->nullable();
                $table->timestamps();
                $table->softDeletes();
            });
        }


        // Schema::table('model_has_roles', function (Blueprint $table) {
        //     $table->foreign('team_id')->references('id')->on('teams');
        // });

        // modify roles table
        $tableNames = config('permission.table_names');
        Schema::table($tableNames['roles'], function (Blueprint $table) {
            $table->boolean('deletable')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teams');
    }
};