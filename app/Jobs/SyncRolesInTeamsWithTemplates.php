<?php

namespace App\Jobs;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class SyncRolesInTeamsWithTemplates implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * Create a new job instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        Log::debug("executed");
        // get all template roles
        $templateRoles = Role::where('team_id', 0)->where('name', 'like', 'team-%')->get();
        
        foreach($templateRoles as $role)
        {
            // get all child roles
            $childs = Role::where('name', $role->name)->where('copy_changes_from_template', true)->get();

            // sync all permissions
            foreach($childs as $child)
            {
                $child->syncPermissions($role->permissions);
            }
        }
    }
}
