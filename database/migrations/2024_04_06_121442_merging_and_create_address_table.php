<?php

use App\Models\Ci\Projekt;
use App\Models\Team;
use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('addresses', function (Blueprint $table) {
            $table->ulid('id')->primary();
            $table->string('street');
            $table->string('housenumber');
            $table->integer('housenumber_number');
            $table->string('zip_code', 5);
            $table->string('district');
            $table->string('city');
            $table->string('country')->nullable();
            $table->double('lat')->nullable();
            $table->double('lon')->nullable();

            $table->nullableMorphs('owned_by');
            $table->timestamps();
            $table->softDeletes();
        });

        if (Schema::hasTable('akquise_akquise')) {
            Schema::rename('akquise_akquise', 'ci_akquise');
            Schema::table('ci_akquise', function (Blueprint $table) {
                $table->nullableMorphs('owned_by');
            });
        }

        if (Schema::hasTable('projectci_projekt')) {
            Schema::rename('projectci_projekt', 'ci_projekt');
            Schema::table('ci_projekt', function (Blueprint $table) {
                $table->ulid('address_id')->nullable()->default(null);
                $table->nullableMorphs('owned_by');
            });

            // this migration of the ownership is very risky, only meant for my staging environment SHOULD NOT be made in production

            $teamId = json_decode(json_encode(DB::table('model_has_roles')->whereNot('team_id', 0)->limit(1)->get()->toArray()), 1)[0]['team_id'] ?? 0;
            $projects = json_decode(json_encode(DB::table('model_has_owner')->where('ownable_type', "Lukasmundt\Akquise\Models\Projekt")->get()->toArray()), 1);
            foreach ($projects as $key => $project) {
                DB::table('ci_projekt')
                    ->where('id', $project['ownable_id'])
                    ->update(['owned_by_type' => Team::class, 'owned_by_id' => $teamId]);
                DB::table('ci_akquise')
                    ->where('id', $project['ownable_id'])
                    ->update(['owned_by_type' => Team::class, 'owned_by_id' => $teamId]);
            }

            // moving of the addresses from projectci-projekt table to address table
            $projects = json_decode(json_encode(DB::table('ci_projekt')->get()->toArray()), 1);
            // dd($projects);
            foreach ($projects as $key => $project) {
                $data = [
                    'id' => Str::ulid()->__toString(),
                    'street' => $project['strasse'],
                    'housenumber' => $project['hausnummer'],
                    'housenumber_number' => $project['hausnummer_nummer'],
                    'zip_code' => $project['plz'],
                    'district' => $project['stadtteil'],
                    'city' => $project['stadt'],
                    'lat' => $project['coordinates_lat'],
                    'lon' => $project['coordinates_lon'],
                    'owned_by_type' => Team::class,
                    'owned_by_id' => $teamId,
                ];
                // dd($data);
                DB::table('addresses')->insert($data);
                DB::table('ci_projekt')->where('id', $project['id'])->update([
                    'address_id' => $data['id'],
                ]);
            }

            // delete cols
            Schema::table('ci_projekt', function (Blueprint $table) {
                $table->dropColumn(['strasse', 'hausnummer', 'hausnummer_nummer', 'plz', 'stadtteil', 'stadt', 'coordinates_lat', 'coordinates_lon']);
            });


        }

        if (Schema::hasTable('model_has_owner')) {
            DB::table('model_has_owner')->where('ownable_type', "Lukasmundt\Akquise\Models\Projekt")->orWhere('ownable_type', "Lukasmundt\Akquise\Models\Akquise")->delete();
        }

        // rename notes table
        if (Schema::hasTable('projectci_notiz')) {
            Schema::rename('projectci_notiz', 'notes');
        }

        // rename person tables
        if (Schema::hasTable('projectci_person')) {
            Schema::rename('projectci_person', 'persons');

            // DB::statement("ALTER TABLE persons CHANGE COLUMN `vorname` `prename`");

            Schema::table('persons', function (Blueprint $table) {
                // make person addressable
                $table->ulid('address_id')->nullable()->default(null);
                $table->nullableMorphs('owned_by');
                // $table->rename
                $table->renameColumn('vorname', 'prename');
                $table->renameColumn('nachname', 'lastname');
                $table->renameColumn('titel', 'title');
                $table->enum('gender', ['not specified', 'male', 'female', 'diverse'])->default('not specified');
                $table->string('additional_prenames')->nullable();
            });
        }
        if (Schema::hasTable('projectci_person_telefonnummer')) {
            Schema::rename('projectci_person_telefonnummer', 'phone');
        }

        Schema::create("model_has_contacts", function (Blueprint $table) {
            $table->string("type", 255)->nullable();
            $table->integer("priority")->default(0);
            $table->ulidMorphs("model");
            $table->ulidMorphs("contact");
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create("simple_addresses_for_autocomplete", function (Blueprint $table) {
            $table->string("street_and_number", 255)->unique("street_and_number");
        });

        Schema::create('campaigns_campaigns', function(Blueprint $table){
            $table->ulid('id')->primary();
            $table->boolean('send');
            $table->string('content_type');
            $table->string('date_for_print');
            $table->longText('content')->nullable();
            $table->string('name');
            $table->nullableUlidMorphs('list');
            $table->timestamps();
            $table->softDeletes();
        });

        Schema::create('campaigns_lists_address', function(Blueprint $table){
            $table->ulid('id')->primary();
            $table->string('name');
            $table->json('filters');
            $table->timestamps();
            $table->nullableMorphs('owned_by');
        });

        Schema::create('campaigns_campaignable', function(Blueprint $table){
            $table->ulidMorphs('campaignable');
            $table->ulidMorphs('campaign');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('addresses');
    }
};
