<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Illuminate\Support\Facades\Process;

class Install extends Command
{
    private $data = [
        "db_host" => "",
        "db_port" => "",
        "db_name" => "",
        "db_username" => "",
        "db_password" => "",
        "db_prefix" => "",
        "admin_email" => "",
        "admin_password" => "",
    ];

    private $allowed_empty = ['db_password', 'db_prefix'];

    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'install {--db-host= : Database host}
                                    {--db-port=3306 : Port of the database host}
                                    {--db-name= : Name of the database}
                                    {--db-username=root : Username to use to access the database}
                                    {--db-password= : Password to use to access the database}
                                    {--db-prefix= : Table name prefix}
                                    {--admin-email= : Admin user email}
                                    {--admin-password= : Admin user password}
                                    {--locale=de-DE : Language used in the app}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'This is an installation command. It is asking for some configurations.';

    private function checkArguments(){
        // $this->info($this->option("db-host"));
        if(empty($this->option("db-host")))
        {
            $response = $this->ask("What is the host of the database? ['localhost']");
            $this->data['db_host'] = empty($response)?'localhost':$response;
        }else{
            $this->data['db_host'] = $this->option("db-host");
        }
        $this->info($this->data['db_host']);
    }

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->checkArguments();
        // \App\Models\User::factory()->create([
        //         'name' => 'Admin',
        //         'email' => 'test@example.com',
        //     ]);
        // $this->info($this->option("db-host"));
        // $this->info(config());
    }
}
