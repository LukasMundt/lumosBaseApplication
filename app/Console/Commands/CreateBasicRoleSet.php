<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class CreateBasicRoleSet extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:create-basic-role-set';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Runs the role seeder';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->call('db:seed', ['class' => 'PermissionAndRoleSeeder']);
    }
}
