<?php

namespace App\Models\Ci;

use App\Models\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Kampagne extends Model
{
    use HasUlids;
    use SoftDeletes;

    // TODO: Dieses Model entfernen, wenn nicht mehr benötigt

    protected $table = 'projectci_kampagne';

    protected $fillable = [
        'bezeichnung',
        'status',
        'typ',
        'filter',
        'created_by',
        'updated_by',
        'reichweite'
    ];

    protected $casts = [
        'filter' => 'array',
    ];

    public function vorlage(): MorphTo
    {
        return $this->morphTo('vorlage');
    }

    public function akquise(): MorphToMany
    {
        return $this->morphedByMany(Akquise::class, 'bewerbbar','projectci_kampagne-bewerbbar');
    }
}