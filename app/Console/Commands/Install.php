<?php

namespace App\Console\Commands;

use App\Models\User;
use Illuminate\Console\Command;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Process;
use Spatie\Permission\Models\Role;
use Illuminate\Contracts\Console\PromptsForMissingInput;

class Install extends Command
{
    private $data = [
        "db_host" => ["localhost", 'What is the host of the database?'],
        "db_port" => ["3306", "What is the port of the database?"],
        "db_name" => ["lumos", "What is the name of the database?"],
        "db_username" => ["root", "Which username should be used to access the database?"],
        "db_password" => ["", 'What is the user\'s password for the database?', ['secure', 'allowed_empty']],
        "admin_email" => ["", 'What is the email of the super-admin?'],
        "admin_password" => ["", 'What is the password of the super-admin?', ['secure', 'allowed_empty']],
    ];

    private $allowed_empty = ['db_password'];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:install {--db_host=localhost : Database host}
                                    {--db_port=3306 : Port of the database host}
                                    {--db_name=lumos : Name of the database}
                                    {--db_username=root : Username to use to access the database}
                                    {--db_password : Password to use to access the database}
                                    {--admin_email=mail@lukas-mundt.de : Admin user email}
                                    {--admin_password=password : Admin user password}
                                    {locale=de-DE : Language used in the app}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is an installation command. It is asking for some configurations.';

    private function checkArgument(string $argumentName)
    {
        // if the first value in the array of a specific argument in the data array isn't null there is a default value
        // the second value in the array of an argument is the question which will be displayed in the terminal
        if (empty($this->option($argumentName))) {
            $first = true;
            $allowed_empty = in_array('allowed_empty', array_key_exists(2, $this->data[$argumentName]) ? $this->data[$argumentName][2] : []);
            $question = $this->data[$argumentName][1] . (empty($this->data[$argumentName][0]) ? "" : " [" . $this->data[$argumentName][0] . "]");

            if (in_array('secure', array_key_exists(2, $this->data[$argumentName]) ? $this->data[$argumentName][2] : [])) {
                while ((empty($this->data[$argumentName][0]) && !$allowed_empty) || $first) {
                    $first = false;
                    $response = $this->secret($question);
                    if (empty($response) && empty($this->data[$argumentName][0]) && !$allowed_empty) {
                        $this->error('An input is required.');
                    } else {
                        $this->data[$argumentName][0] = empty($response) ? $this->data[$argumentName][0] : $response;
                        // $this->info('set to'.$response);
                    }
                }
            } else {
                while ((empty($this->data[$argumentName][0]) && !$allowed_empty) || $first) {
                    $first = false;
                    $response = $this->ask($question);
                    if (empty($response) && empty($this->data[$argumentName][0]) && !$allowed_empty) {
                        $this->error('An input is required.');
                    } else {
                        $this->data[$argumentName][0] = empty($response) ? $this->data[$argumentName][0] : $response;
                        $this->info('Set to: ' . $this->data[$argumentName][0]);
                    }
                }
            }

        } else {
            $this->data[$argumentName] = $this->option($argumentName);
        }
    }

    private function checkArguments()
    {
        foreach (array_keys($this->data) as $value) {
            // $this->info($value);
            $this->checkArgument($value);
        }
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // $this->checkArguments();
        // fill in the collected data in the .env file
        // putenv('DB_HOST='.$this->data['db_host'][0]);
        // config(['database.connections.mysql.host' => $this->data['db_host'][0]]);

        // execute migrations
        $this->info('Migrating and seeding...');
        Artisan::call('migrate --seed --force');
        $this->info('Migration and seeding was successful!');

        // Admin-User is created
        $this->info('Create admin account...');
        $user = \App\Models\User::factory()->create([
            'name' => 'Admin',
            'email' => 'admin@example.local',
            'password' => 'changeme',
            'status' => 'active',
        ]);
        $user->assignRole(Role::all());

        

        
    }
}