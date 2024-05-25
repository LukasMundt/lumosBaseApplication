<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Rawilk\Settings\Facades\Settings;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        $salutations = [
            'not specified' => "Sehr geehrte Damen und Herren",
            'female' => "Sehr geehrte Frau //nachname//",
            'male' => 'Sehr geehrter Herr //nachname//',
            'diverse' => "Sehr geehrt* //nachname//"
        ];
        Settings::withoutTeams()->set('campaigns.salutations', $salutations);
        Settings::withoutTeams()->set('campaigns.line1_no_owner', "An die Eigentümer");
        Settings::withoutTeams()->set('campaigns.salutation_no_owner', "Sehr geehrte Damen und Herren");
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Settings::withoutTeams()->forget('campaigns.salutations');
        Settings::withoutTeams()->forget('campaigns.line1_no_owner');
        Settings::withoutTeams()->forget('campaigns.salutation_no_owner');
    }
};
