<?php

namespace App\Models;

use App\Models\Ci\Akquise;
use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasTimestamps;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\MorphTo;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
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

    protected $hidden = [
        'content'
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
                $dir = "/teams//' . session('team') . '/campaigns";
                if (!Storage::directoryExists($dir)) {
                    Storage::createDirectory("/teams//' . session('team') . '/campaigns");
                }


                Storage::put('/teams//' . session('team') . '/campaigns//' . $this->id, Crypt::encrypt($value));
                return "";
            },
        );
    }


    // TODO: Akquise verknüpfen können, wenn Kampagne versendet
    public function akquise(): MorphToMany
    {
        // return $this->morphToMany(Akquise)
        return $this->morphToMany(
            Akquise::class,
            'campaignable', // name
            'campaigns_campaignable', // table
            'campaign_id', // foreignpivotkey
            'campaignable_id', // related pivot key
            "id", // parent
            "id", // related
            "campaignable", // relation
            true
        )->withTimestamps()
            ->withPivotValue('campaign_type', $this::class);
    }

    public function personen(): MorphToMany
    {
        // return $this->morphToMany(Akquise)
        return $this->morphToMany(
            Person::class,
            'campaignable', // relation
            'campaigns_campaignable', // table
            'campaign_id',
            'campaignable_id',
            "id",
            "id",
            "campaignable",
            true
        )->withTimestamps()->withPivotValue('campaign_type', $this::class);
    }

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
