<?php

namespace App\Models\Ci;

use App\Models\Ci\Akquise;
use App\Models\Model;
use App\Traits\Addressable;
use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Scout\Searchable;

class Projekt extends Model implements Ownable
{
    use SoftDeletes, HasUlids, HasMorphOwner, Addressable, Searchable;

    protected $table = "ci_projekt";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    // protected $fillable = [
    //     'strasse',
    //     'hausnummer',
    //     'hausnummer_nummer',
    //     'hausnummer_buchstabe',
    //     'plz',
    //     'stadt',
    //     'stadtteil',
    //     'coordinates_lat',
    //     'coordinates_lon'
    // ];
    protected $hidden = [
        'owned_by_id',
        'owned_by_type'
    ];

    // public function getAddressAsString() : string
    // {
    //     return $this->strasse.' '.$this->hausnummer;
    // }

    public function akquise(): HasOne
    {
        return $this->hasOne(Akquise::class, 'id');
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
            // , [
            //     'created_at' => $this->created_at->timestamp,
            // ]
        );
    }
}
