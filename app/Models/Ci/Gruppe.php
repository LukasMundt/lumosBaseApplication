<?php

namespace App\Models\Ci;

use App\Models\Model;
use App\Models\Person;
use Database\Factories\GruppeFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Relations\MorphToMany;

class Gruppe extends Model
{
    use HasUlids, HasFactory;

    protected $table = "projectci_gruppe";
    protected $primaryKey = "id";
    protected $fillable = ['typ', 'strasse', 'hausnummer', 'plz', 'stadt'];

    protected static function newFactory(): Factory
    {
        return GruppeFactory::new();
    }

    public function personen(): HasMany
    {
        return $this->hasMany(Person::class, 'gruppe_id');
    }

    public function akquise(): MorphToMany
    {
        // return $this->morphedByMany(Akquise::class, 'gruppeverknuepfung', 'projectci_gruppeverknuepfung',null,null,null,'projekt_id')->withPivot('typ','prioritaet');
        return $this->morphedByMany(Akquise::class, 'gruppeverknuepfung', 'projectci_gruppeverknuepfung')->withPivot('typ','prioritaet');
    }

    public function namesAsString(): string
    {
        $personen = $this->personen;
        $result = "";

        foreach ($personen as $person) {
            if (!empty($label)) {
                $result .= " und ";
            }

            // Bezeichnung dieser Person erzeugen
            $result .= $person->nameAsString();
        }

        return $result;
    }
}
