<?php

namespace App\Rules;

use App\Models\User;
use Closure;
use Illuminate\Contracts\Validation\DataAwareRule;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class UserIsNotMemberOfTeam implements DataAwareRule, ValidationRule
{
    /**
     * All of the data under validation.
     * @var array<string, mixed>
     */
    protected $data = [];

    /**
     * Set the data under validation.
     * @param array<string,mixed> $data
     */
    public function setData(array $data)
    {
        $this->data = $data;
        return $this;
    }

    /**
     * Run the validation rule.
     *
     * @param  \Closure(string): \Illuminate\Translation\PotentiallyTranslatedString  $fail
     */
    public function validate(string $attribute, mixed $value, Closure $fail): void
    {
        // get team
        $user = User::where('id', $this->data['user'])->first();
        $team = request()->route('team');

        // check roles
        $rolesCount = DB::table('model_has_roles')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $team->id)
            ->count();

        // check permissions
        $permissionCount = DB::table('model_has_permissions')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $team->id)
            ->count();

        if ($rolesCount + $permissionCount > 0) {
            $fail('admin.validation.user_is-member_of_team')->translate();
        }
    }
}
