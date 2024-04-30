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
        Schema::create('projectci_projekt', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('strasse');
            $table->string('hausnummer');
            $table->integer('hausnummer_nummer');
            $table->string('plz', 5);
            $table->string('stadtteil');
            $table->string('stadt');
            $table->double('coordinates_lat')->nullable();
            $table->double('coordinates_lon')->nullable();
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

            // $table->unique(['strasse', 'hausnummer', 'PLZ', 'Stadtteil'],'unique');
        });

        // Schema::create('projectci_projektverknuepfung', function (Blueprint $table) {
        //     $table->foreignUlid('projekt_id')
        //         ->constrained('projectci_projekt', 'id')
        //         ->cascadeOnUpdate()
        //         ->cascadeDelete();
        //     $table->ulidMorphs('projektverknuepfung', 'projektverknuepfung');

        //     $table->timestamps();
        // });

        Schema::create('projectci_gruppe', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('strasse')->nullable();
            $table->string('hausnummer')->nullable();
            $table->string('plz', 5)->nullable();
            $table->string('stadt')->nullable();
            // $table->ulidMorphs('gruppierbar','gruppierbar'); //Ist z.B. Akquise...
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
        });

        Schema::create('projectci_person', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('anrede')->nullable();
            $table->string('titel')->nullable()->comment('z.B. akademischer Titel');
            $table->string('vorname')->nullable();
            $table->string('nachname')->nullable();
            $table->string('email')->nullable();
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
            $table->foreignUlid('gruppe_id')
                ->nullable()
                ->constrained('projectci_gruppe', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();

            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('projectci_person_telefonnummer', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('telefonnummer', 50);
            $table->string('typ')->comment('z.B. privat,mobil')->nullable();
            $table->foreignUlid('person_id')
                ->nullable()
                ->constrained('projectci_person', 'id')
                ->cascadeOnUpdate()
                ->cascadeOnDelete();
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

            $table->index(['telefonnummer', 'person_id'], 'telefonnummer_person_id');
        });

        // Schema::create('projectci_gruppe_person', function (Blueprint $table) {
        //     $table->foreignUlid('gruppe_id')
        //         ->constrained('projectci_gruppe', 'id')
        //         ->cascadeOnUpdate()
        //         ->cascadeDelete();
        //     $table->foreignUlid('person_id')
        //         ->constrained('projectci_person', 'id')
        //         ->cascadeOnUpdate()
        //         ->cascadeOnDelete();

        //     $table->timestamps();

        //     $table->index(['gruppe_id', 'person_id'],'gruppe_person');
        // });

        Schema::create('projectci_gruppeverknuepfung', function (Blueprint $table) {
            $table->foreignUlid('gruppe_id')
                ->constrained('projectci_gruppe', 'id')
                ->cascadeOnUpdate()
                ->cascadeDelete();
            $table->ulidMorphs('gruppeverknuepfung', 'gruppeverknuepfung');
            $table->string('typ')->nullable();
            $table->integer('prioritaet', false)->default(0);

            $table->timestamps();
            $table->primary(['gruppe_id', 'gruppeverknuepfung_id', 'gruppeverknuepfung_type']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projectci_projekt');
        Schema::dropIfExists('projectci_projektverknuepfung');
        Schema::dropIfExists('projectci_person');
        Schema::dropIfExists('projectci_person_telefonnummer');
        Schema::dropIfExists('projectci_gruppe');
        Schema::dropIfExists('projectci_gruppe_person');
        Schema::dropIfExists('projectci_gruppeverknuepfung');
    }
};
