<?php

namespace Database\Factories;
 
use App\Models\Person;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Factories\Factory;
 
class PersonFactory extends Factory
{
    protected $model = Person::class;

    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'gender' => "not specified",
            'created_by' => Auth::user()->id,
            'updated_by' => Auth::user()->id,
        ];
    }
}