<?php

namespace App\Models\Ci;

use App\Models\Model;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class PdfVorlage extends Model
{
    use HasUlids;
    use SoftDeletes;

    protected $table = 'projectci_pdf-vorlage';

    protected $fillable = [
        'bezeichnung',
        'pfad',
        'created_by',
        'updated_by'
    ];

    public function kampagnen(): MorphMany
    {
        return $this->morphMany(Kampagne::class, 'vorlage');
    }
}