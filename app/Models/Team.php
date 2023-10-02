<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Team extends Model
{
    use HasFactory;
    use SoftDeletes;

    public function users(): MorphToMany
    {
        return $this->morphToMany(User::class, 'teamable', 'teamable');
    }
}
