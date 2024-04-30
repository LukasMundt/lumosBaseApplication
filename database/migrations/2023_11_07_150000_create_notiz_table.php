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
        Schema::create('projectci_notiz', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->longText('inhalt');
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
                
            $table->ulidMorphs('notierbar');

            $table->timestamps();
            $table->softDeletes();
        });

        // Schema::create('projectci_notierbar', function (Blueprint $table) {
        //     $table->foreignUlid('notiz_id')
        //         ->nullable()
        //         ->constrained('projectci_notiz', 'id')
        //         ->cascadeOnUpdate()
        //         ->cascadeOnDelete();
        //     $table->ulidMorphs('notierbar');
        // });

        Schema::create('projectci_notizvorlage', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->longText('inhalt');

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

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Schema::dropIfExists()
    }
};
