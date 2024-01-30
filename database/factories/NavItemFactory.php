<?php

namespace Database\Factories;

use App\Models\Team;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NavItem>
 */
class NavItemFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'top_item' => null,
            // 'scope' => Team::class, //
            // 'domain' => null, // null=personal, 
            'permissions' => null,
            'roles' => null,
            'team_permissions' => null,
            'label' => fake()->slug(3),
            'route' => implode(".", fake()->words(3,false)),
            'params' => json_encode([]),
        ];
    }
}
