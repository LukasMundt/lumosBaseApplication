<?php

namespace App\Console\Commands;

use App\Jobs\SyncRolesInTeamsWithTemplates;
use Illuminate\Console\Command;
use function Laravel\Prompts\info;

class SyncRolesInTeamsWithTemplateRoles extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:sync-roles-with-templates';

    // /**
    //  * The console command description.
    //  *
    //  * @var string
    //  */
    // protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        SyncRolesInTeamsWithTemplates::dispatch();
        info("Syncing was successful.");
    }
}
