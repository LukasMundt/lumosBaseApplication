<?php

use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('teamable', function (Blueprint $table) {
            $table->foreignIdFor(Team::class, 'team_id');
            $table->ulidMorphs('teamable');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teamable');
    }
};
