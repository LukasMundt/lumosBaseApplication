<?php

namespace App\Models;

use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class Address extends Model implements Ownable
{
    use HasUlids, SoftDeletes, HasMorphOwner, Searchable;

    protected $table = "addresses";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'street',
        'housenumber',
        'housenumber_number',
        'zip_code',
        'district',
        'city',
        'country',
        'lat',
        'lon'
    ];

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return $this->toArray();
    }
}
