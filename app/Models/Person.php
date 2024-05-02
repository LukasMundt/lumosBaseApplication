<?php

namespace App\Models;

use App\Models\Ci\Gruppe;
use App\Traits\Addressable;
use Cog\Contracts\Ownership\Ownable;
use Cog\Laravel\Ownership\Traits\HasMorphOwner;
use Cog\Laravel\Ownership\Traits\HasOwner;
use Database\Factories\PersonFactory;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\MorphToMany;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;
use Illuminate\Database\Eloquent\Factories\Factory;
use Laravel\Scout\Searchable;

class Person extends Model implements Ownable
{
    use SoftDeletes, HasUlids, HasFactory, HasMorphOwner, Searchable;
    use Addressable;

    protected $table = "persons";

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'gender',
        'title',
        'prename',
        'additional_prenames',
        'lastname',
        'email',
    ];

    protected $appends = ['name', 'type'];

    protected $casts = [
        'name' => 'string',
    ];

    protected static function newFactory(): Factory
    {
        return PersonFactory::new();
    }

    public function telefonnummern(): HasMany
    {
        return $this->hasMany(Telefonnummer::class, 'person_id');
    }

    // public function gruppe(): BelongsTo
    // {
    //     return $this->belongsTo(Gruppe::class, 'gruppe_id');
    // }

    public function nameAsString(): string
    {
        $result = "";

        $result .= empty($this->title) ? "" : $this->title . " ";
        $result .= empty($this->prename) ? "" : $this->prename . " ";
        $result .= empty($this->lastname) ? "" : $this->lastname . " ";
        $result = Str::squish($result);

        return $result;
    }

    protected function name(): Attribute
    {
        return new Attribute(
            get: fn() => $this->nameAsString(),
        );
    }

    protected function type(): Attribute
    {
        return new Attribute(
            get: fn() => $this::class,
        );
    }

    /**
     * Get the indexable data array for the model.
     *
     * @return array<string, mixed>
     */
    public function toSearchableArray()
    {
        return array_merge(
            $this->toArray()
            // , [
            //     'created_at' => $this->created_at->timestamp,
            // ]
        );
    }
}
