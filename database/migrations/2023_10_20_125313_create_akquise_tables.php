<?php

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
        Schema::create('akquise_akquise', function (Blueprint $table) {
            // $table->ulid('id')->primary();
            $table->foreignUlid('id')
                ->constrained('projectci_projekt', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
            $table->boolean('teilung');
            $table->boolean('abriss');
            $table->boolean('nicht_gewuenscht');
            $table->boolean('retour');
            $table->string('status')->nullable();
            $table->integer('zustand')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('akquise_akquise');
    }
};
