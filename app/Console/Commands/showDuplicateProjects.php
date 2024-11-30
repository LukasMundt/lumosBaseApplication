<?php

namespace App\Console\Commands;

use App\Models\Address;
use App\Models\Ci\Projekt;
use Illuminate\Console\Command;
use function Laravel\Prompts\table;

class showDuplicateProjects extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:show-duplicate-projects {teamId}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $teamId = $this->argument('teamId');
        $foundAddresses = [];
        $duplicateAddressIds = [];
        $projects = Projekt::ownedByTeam($teamId)->get();
        foreach ($projects as $project) {
            if (!in_array($project->address_id, $foundAddresses)) {
                $foundAddresses[] = $project->address_id;
            } else {
                $duplicateAddressIds[] = [$project->address_id];
            }
        }
        $duplicateAddresses = [];
        foreach ($duplicateAddressIds as $value) {
            $duplicateAddresses[] = Address::where('id', $value)->first()->setHidden(['housenumber_number'])->toArray();
        }
        // $this->info("total projects: ".count($projects));
        // $this->info("duplicates: ".count($duplicateAddresses));
        table(['id', 'street', "nr", "zip", "district", "city", "country", "lat", "lon","owned_by_type","owned_by_id", "created","updated","deleted"], $duplicateAddresses);
        $this->info(count($duplicateAddresses)." duplicates");
    }
}
