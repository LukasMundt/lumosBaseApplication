<?php

namespace App\Traits;

use App\Models\Address;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

trait Addressable
{
    public function address(): BelongsTo
    {
        return $this->belongsTo(Address::class);
    }
}
