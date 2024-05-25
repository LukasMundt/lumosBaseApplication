<?php

namespace App\Models;

use App\Contracts\SendList;
use App\Models\Ci\Akquise;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Laravel\Scout\Searchable;

class AddressList extends Model implements SendList
{
    use HasFactory, Searchable, SoftDeletes, HasMorphOwner, HasUlids;

    protected $table = 'campaigns_lists_address';

    protected $fillable = [
        'name',
        'filters'
    ];

    protected $casts = [
        'filters' => 'array',
    ];

    public function getAddresses(string|array $relations = [])
    {
        $filters = $this->filters;
        $team = session("team");
        $addresses = Akquise::where('owned_by_id', $team)
            ->where('owned_by_type', Team::class)
            ->withwhereHas('projekt.address', function ($query) use ($filters) {
                $query->whereIn('district', $filters['filtersDistricts'] ?? [], not: ($filters['ignoreDistricts'] || empty ($filters['filtersDistricts'])))
                    ->whereIn('street', $filters['filtersStreets'] ?? [], not: $filters['ignoreStreets'] || empty ($filters['filtersStreets']))
                    ->whereIn('zip_code', $filters['filtersZipCodes'] ?? [], not: $filters['ignoreZipCodes'] || empty ($filters['filtersZipCodes']));

            })
            ->with($relations)
            ->get();
        return $addresses;
    }

    public function campaign(): MorphMany
    {
        return $this->morphMany(Campaign::class, 'list');
    }
}
