<?php

namespace Lukasmundt\ProjectCI\Rules;

use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Str;
use Lukasmundt\ProjectCI\Models\Gruppe;

class StorePersonAssociation implements DataAwareRule, ValidationRule
{
    /**
     * All data under validation.
     */
    protected $data = [];

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // wenn neues Element muss value vom typ string sein und kürzer als 255 Zeichen 
        if (isset($this->data['nachname']["__isNew__"]) && $this->data['nachname']["__isNew__"]) {
            if (gettype($value) != 'string' || Str::length($value) > 255) {
                $fail($attribute . ' hat nicht den richtigen Typ oder ist zu lang.');
            }
        }
        // andernfalls muss id der person bzw. um genau zu sein der gruppe valide sein und gruppe darf dem objekt noch nicht zugeordnet sein
        else {
            $gruppe = Gruppe::where('id', $value)->first();
            // DB::table('projectci_gruppeverknuepfung')->where('gruppe_id', $value)->where('gruppeverknuepfung_id', )
            if ($gruppe == null) {
                $fail('Die ausgewählte Person/Gruppe existiert nicht.');
            }
            // else if()
            // {

            // }
        }
    }

    /**
     * Speichert alle unter Validierung befindlichen Daten.
     */
    public function setData(array $data): static
    {
        $this->data = $data;
        return $this;
    }
}
