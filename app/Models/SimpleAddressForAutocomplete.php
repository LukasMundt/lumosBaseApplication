<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Laravel\Scout\Searchable;

class SimpleAddressForAutocomplete extends Model
{
    use Searchable;

    public $timestamps = false;
    protected $table = "simple_addresses_for_autocomplete";
    protected $primaryKey = 'street_and_number';
    protected $keyType = 'string';

    protected $fillable = [
        "street_and_number",
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
