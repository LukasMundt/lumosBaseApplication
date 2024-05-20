<?php

namespace App\Models;

use App\Contracts\SendList;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
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
}
