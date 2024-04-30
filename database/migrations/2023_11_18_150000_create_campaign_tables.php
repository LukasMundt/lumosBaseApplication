<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        if (!Schema::hasTable('projectci_kampagne')) {
            Schema::create('projectci_kampagne', function (Blueprint $table) {
                $table->ulid('id')->primary();

                $table->string('bezeichnung', 255);
                $table->tinyInteger('status');
                $table->string('typ');
                $table->text('filter');
                $table->integer('reichweite');

                $table->foreignUlid('created_by')
                    ->nullable()
                    ->constrained('users', 'id')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();
                $table->foreignUlid('updated_by')
                    ->nullable()
                    ->constrained('users', 'id')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();

                $table->ulidMorphs('vorlage');

                $table->timestamps();
                $table->softDeletes();
            });
        }
        if (!Schema::hasTable('projectci_pdf-vorlage')) {
            Schema::create('projectci_pdf-vorlage', function (Blueprint $table) {
                $table->ulid('id')->primary();
                $table->text('pfad');
                $table->string('bezeichnung');

                $table->foreignUlid('created_by')
                    ->nullable()
                    ->constrained('users', 'id')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();
                $table->foreignUlid('updated_by')
                    ->nullable()
                    ->constrained('users', 'id')
                    ->cascadeOnUpdate()
                    ->nullOnDelete();

                $table->timestamps();
                $table->softDeletes();
            });
        }

        if (!Schema::hasTable('projectci_kampagne-bewerbbar')) {
            Schema::create('projectci_kampagne-bewerbbar', function (Blueprint $table) {
                $table->foreignUlid('kampagne_id')
                    ->constrained('projectci_kampagne', 'id')
                    ->cascadeOnUpdate()
                    ->cascadeOnDelete();
                $table->ulidMorphs('bewerbbar');
            });
        }

    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists()
    }
};
