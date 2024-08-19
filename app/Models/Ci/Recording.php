<?php

namespace App\Models\Ci;

use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Recording extends Model implements Ownable
{
    use SoftDeletes, HasUlids, HasOwner, Searchable;

    protected $table = "ci_recordings";


    protected $casts = [
        "locations" => "encrypted:array"
    ];

    protected $fillable = [
        "locations",
        "owned_by_team",
        "owned_by_user",
        "extension"
    ];

    protected $attributes = ['transferred' => false];

    public function scopeOwnedByTeam($query, $teamId)
    {
        $query->where('owned_by_team', $teamId);
    }

    public function scopeOwnedByUser($query, $userId)
    {
        $query->where("owned_by_user", $userId);
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return array_merge(
            $this->toArray()
        );
    }
}
