<?php

namespace App\Models;

use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Address extends Model implements Ownable
{
    use HasUlids, SoftDeletes;
    use HasMorphOwner;

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
}
