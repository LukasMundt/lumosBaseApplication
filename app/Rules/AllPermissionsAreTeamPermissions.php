<?php

namespace App\Rules;

use Closure;
use Illuminate\Contracts\Validation\ValidationRule;
use Spatie\Permission\Models\Permission;

class AllPermissionsAreTeamPermissions implements ValidationRule
{
    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        foreach ($value as $permission) {
            if(gettype($permission) != "integer")
            {
                $fail("Integer expected");
            }
            else{
                $perm = Permission::findById($permission);
                if($perm == null)
                {
                    $fail("Permission not found");
                }
                else if(preg_match("/(tp-).*/",$perm->name) == 0)
                {
                    $fail("Not a team permission");
                }
            }
        }
    }
}
