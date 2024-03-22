<?php

namespace Database\Factories;

use App\Models\NavItem;
use App\Models\Team;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\NavItem>
 */
class NavItemFactory extends Factory
{
    protected $model = NavItem::class;
    
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
            'route' => implode(".", fake()->words(3, false)),
            'params' => json_encode([]),
        ];
    }

    public function findOrCreate(array $attributes): Collection|null|NavItem
    {
        $model = NavItem::where(Arr::except($attributes, ['team_permissions', 'roles', 'params', 'permissions', 'top_item']));
        if ($model->count() >= 0) {
            return $model->get();
        } else {
            return $this->create($attributes);
        }
    }
}
