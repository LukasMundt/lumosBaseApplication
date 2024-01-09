<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class RoleIsInGlobalOrCurrentTeam implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        $role = Role::where('id',$value)->first();
        $team = request()->route('team');

        if($role->team_id != $team->id && $role->team_id != 0)
        {
            $fail('admin.validation.role_is_not_in_global_or_current_team')->translate();
        }
    }
}
