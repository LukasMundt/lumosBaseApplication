<?php

namespace App\Models;

use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Laravel\Scout\Searchable;

class Campaign extends Model implements Ownable
{
    use HasFactory, HasUlids, HasTimestamps, SoftDeletes, HasMorphOwner, Searchable;

    protected $table = 'campaigns_campaigns';

    protected $fillable = [
        'send',
        'content_type',
        'name',
        'content',
        'type',
        'date_for_print',
    ];

    // protected $appends = [
    //     'contentfile',
    // ];

    protected function content(): Attribute
    {
        return Attribute::make(
            get: function () {
                $filename = '/teams//' . session('team') . '/campaigns//' . $this->id;
                $value = Storage::get($filename);

                return $value ? Crypt::decrypt($value) : "";


            },
            set: function (string $value) {
                Storage::put('/teams//' . session('team') . '/campaigns//' . $this->id, Crypt::encrypt($value));
                return "";
            },
        );
    }


    // TODO: Akquise verknüpfen können, wenn Kampagne versendet

    // TODO: Liste verbinden können
}
