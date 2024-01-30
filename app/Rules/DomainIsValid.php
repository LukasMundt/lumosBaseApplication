<?php

namespace App\Rules;

use App\Models\Team;
use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Str;

class DomainIsValid implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        if ($value != 'personal') {
            $value = Str::of($value)->match("/[0-9]+/")->toInteger();
            if (Team::where('id', $value)->get() == null) {
                Log::debug(Team::where('id', intval($value))->get());
                $fail('Keine valide Domain.');
            }
        }
        // if($value != 'personal' && )
        // {

        // }
    }
}
