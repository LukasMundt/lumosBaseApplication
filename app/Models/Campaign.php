<?php

namespace App\Models;

use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Laravel\Scout\Searchable;

class Campaign extends Model implements Ownable
{
    use HasFactory, HasUlids, HasTimestamps, SoftDeletes, Searchable, HasMorphOwner;

    protected $table = 'campaigns_campaigns';

    protected $fillable = [
        'sent_at',
        'content_type',
        'name',
        'content',
        'type',
        'date_for_print',
        'line1_no_owner',
        'salutation_no_owner'
    ];

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

    public function addressList(): MorphTo
    {
        return $this->morphTo('list');
    }

    public function scopeOwnedByTeam($query, $teamId)
    {
        $query->where('owned_by_type', Team::class)->where('owned_by_id', $teamId);
    }

    public function resolveDefaultOwner()
    {
        return Team::find(session('team'));
    }
}
