<?php

namespace App\Models\Ci;

use App\Models\Model;
use App\Models\Notiz;
use App\Models\Person;
use Auth;
use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\MorphMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Akquise extends Model implements Ownable
{
    use HasUlids, HasMorphOwner, LogsActivity;

    protected $table = "ci_akquise";
    protected $primaryKey = "id";
    // protected $attributes = [
    //     'created_by' => Auth::user()->id,
    //     'updated_by' => Auth::user()->id,
    // ];

    protected $appends = ['type'];

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'teilung',
        'abriss',
        'nicht_gewuenscht',
        'retour',
        'status',
    ];

    public function projekt(): BelongsTo
    {
        return $this->belongsTo(Projekt::class, 'id', 'id');
    }

    protected $hidden = [
        'owned_by_id',
        'owned_by_type'
    ];

    // public function gruppen(): MorphToMany
    // {
    //     return $this->morphToMany(Gruppe::class, 'gruppeverknuepfung', 'projectci_gruppeverknuepfung')->withPivot('typ', 'prioritaet');
    // }

    public function personen(): MorphToMany
    {
        // return $this->morphedByMany(User::class, 'owner', 'model_has_owner', 'ownable_id')->withPivot('ownable_type');
        // return $this->morphToMany(User::class, 'owner', 'model_has_owner', 'ownable_id', 'owner_id', "id", "id", "owner")->withPivot('ownable_type');
        return $this->morphToMany(
            Person::class,
            'contact',
            'model_has_contacts',
            'model_id',
            'contact_id',
            "id",
            "id",
            "contact",
            true
        )->withTimestamps()
            ->withPivotValue('model_type', $this::class)->withPivot(["priority", "type"]);
    }

    public function notizen(): MorphMany
    {
        return $this->morphMany(Notiz::class, 'notierbar');
    }

    // public function kampagnen(): MorphToMany
    // {
    //     return $this->morphToMany(Kampagne::class, 'bewerbbar');
    // }

    // TODO: Kampagne verbinden können

    // public function getRouteKeyName(): string
    // {
    //     return 'id';
    // }

    protected function type(): Attribute
    {
        return new Attribute(
            get: fn() => $this::class,
        );
    }

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()->logAll();
        // Chain fluent methods for configuration options
    }
}
