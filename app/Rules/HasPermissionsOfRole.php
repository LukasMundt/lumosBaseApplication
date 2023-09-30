<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class HasPermissionsOfRole implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        setPermissionsTeamId(0);
        // Log::debug($value);

        foreach ($value as $role) {
            $roleModel = Role::findById($role['value']);

            if(!Auth::user()->hasAllPermissions($roleModel->permissions)){
                // if(count($value) > 1){
                    $fail('Du hast nicht alle Rechte der Rolle "'.$role['label'].'", die du vergeben möchtest.');
                // }
                // $fail('Du hast nicht alle Rechte der Rollen, die du vergeben möchtest.');
            }
        }
    }
}