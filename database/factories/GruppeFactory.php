<?php

namespace Database\Factories;
 
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\Factory;
use Lukasmundt\ProjectCI\Models\Gruppe;
 
class GruppeFactory extends Factory
{
    protected $model = Gruppe::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'created_by' => Auth::user()->id,
            'updated_by' => Auth::user()->id,
        ];
    }
}