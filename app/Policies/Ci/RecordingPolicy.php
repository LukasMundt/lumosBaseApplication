<?php

namespace App\Policies\Ci;

use App\Models\Ci\Recording;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\DB;

class RecordingPolicy
{
    private $teamId;

    public function before(User $user, string $ability): bool|null
    {
        $this->teamId = session("team");

        $rolesCount = DB::table('model_has_roles')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $this->teamId)
            ->count();

        // check permissions
        $permissionCount = DB::table('model_has_permissions')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $this->teamId)
            ->count();

        if (($rolesCount + $permissionCount) == 0) {
            return false;
        }

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Recording $recording): bool
    {
        return $recording->owned_by_user == $user->id && $recording->owned_by_team == $this->teamId;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Recording $recording): bool
    {
        return $recording->owned_by_user == $user->id && $recording->owned_by_team == $this->teamId;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Recording $recording): bool
    {
        return $recording->owned_by_user == $user->id && $recording->owned_by_team == $this->teamId;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Recording $recording): bool
    {
        return $recording->owned_by_user == $user->id && $recording->owned_by_team == $this->teamId;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Recording $recording): bool
    {
        return $recording->owned_by_user == $user->id && $recording->owned_by_team == $this->teamId;
    }
}
