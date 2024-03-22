<?php

namespace App\Models;

use Database\Factories\NavItemFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class NavItem extends Model
{
    use HasFactory;
    use HasUlids;

    protected $table = "navigation_items";

    protected $fillable = [
        'top_item',
        'domain',
        'permissions',
        'roles',
        'team_permissions',
        'label',
        'route',
        'params'
    ];

    protected $casts = [
        'permissions' => 'array',
        'roles' => 'array',
        'team_permissions' => 'array',
        'params' => 'array'
    ];

    /**
     * Create a new factory instance for the model.
     */
    protected static function newFactory(): Factory
    {
        return NavItemFactory::new();
    }

    // public function domain(): HasOne
    // {
    //     return $this->hasOne(Team::class, 'domain');
    // }

    public function topItem(): HasOne
    {
        return $this->hasOne(NavItem::class, 'top_item');
    }

    public function childs(): HasMany
    {
        return $this->hasMany(NavItem::class, 'top_item');
    }
}
