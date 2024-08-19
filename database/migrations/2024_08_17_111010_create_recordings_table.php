<?php

use App\Models\NavItem;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('ci_recordings', function (Blueprint $table) {
            $table->ulid("id")->primary();
            $table->longText("locations")->nullable();
            $table->float("distance")->default(0);
            $table->boolean("transferred");

            $table->foreignId("owned_by_team");
            $table->foreignUlid("owned_by_user");

            $table->softDeletes();
            $table->timestamps();
        });

        $top = NavItem::where("label", "Akquise")->where("route", "akquise.dashboard")->first();
        NavItem::factory()->create([
            "top_item" => $top,
            "team_permissions" => ['tp-lumos-akquise-basic'],
            "label" => "Mobile Aufnahmen",
            'route' => "akquise.mobile-recording",
        ]);

        NavItem::factory()->create([
            "top_item" => null,
            "team_permissions" => ['tp-lumos-akquise-basic'],
            "label" => "Kontakte",
            'route' => "contacts",
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('ci_recordings');
    }
};
