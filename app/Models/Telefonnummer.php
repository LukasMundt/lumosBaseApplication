<?php

namespace App\Models;

use App\Models\Person;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Telefonnummer extends Model
{
    use HasUlids;

    protected $table = "phone";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'telefonnummer',
        'typ',
        
    ];

    public function person(): BelongsTo
    {
        return $this->BelongsTo(Person::class,'person_id');
    }
}
