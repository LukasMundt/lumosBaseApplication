<?php

namespace Database\Seeders;

use App\Models\Team;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TeamSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // If team is not null a default team already exists
        $team = Team::where('id', 0)->where('name', 'default')->first();

        if (empty($team)) {
            $id = DB::table('teams')->insertGetId(['id' => 0, 'name' => 'default', 'created_at' => now(), 'updated_at' => now()]);
            DB::update('update teams set id = 0 where id = ?', [$id]);
        }

    }
}
