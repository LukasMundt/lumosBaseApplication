<?php

namespace Database\Factories;
 
use App\Models\Notiz;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\Factory;
 
class NotizFactory extends Factory
{
    protected $model = Notiz::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'inhalt' => fake()->text(200),
            'created_by' => Auth::user()->id,
            'updated_by' => Auth::user()->id,
        ];
    }
}