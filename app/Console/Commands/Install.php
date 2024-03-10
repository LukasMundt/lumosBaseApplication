<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Str;
use Spatie\Permission\Models\Role;

class Install extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:install';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is the installation command for lumos.';

    
    /**
     * Execute the console command.
     */
    public function handle()
    {
        // execute migrations
        $this->line('Migrating and seeding...');
        Artisan::call('migrate --seed --force');

        $this->info('Migration and seeding was successful!');

        // Admin-User is created
        $this->line('Create admin account...');
        if (User::where(['email' => 'admin@example.local'])->count() == 0) {
            $user = User::create([
                'name' => 'Admin',
                'email' => 'admin@example.local',
                'password' => 'changeme',
                'remember_token' => Str::random(10),
                'status' => 'active',
            ]);
            $user->markEmailAsVerified();
            $user->assignRole(Role::all());
        } else {
            $this->error("Admin account already exists, please delete it before running the install command again or use the existing account.");
        }
    }
}