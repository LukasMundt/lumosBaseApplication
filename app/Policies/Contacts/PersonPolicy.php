<?php

namespace App\Policies\Contacts;

use App\Models\Person;
use App\Models\User;
use Illuminate\Auth\Access\Response;
use Illuminate\Support\Facades\DB;

class PersonPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        $teamId = session("team");

        $rolesCount = DB::table('model_has_roles')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $teamId)
            ->count();

        // check permissions
        $permissionCount = DB::table('model_has_permissions')
            ->where('model_id', $user->id)
            ->where('model_type', User::class)
            ->where('team_id', $teamId)
            ->count();

        if(($rolesCount + $permissionCount) == 0)
        {
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
        // return $user->hasAnyPermission([
        //     "lumos-campaigns-view-own-campaigns",
        //     "lumos-campaigns-view-all-campaigns"
        // ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Person $person): bool
    {
        return true;
        // if ($user->hasAnyPermission(['lumos-campaigns-view-all-campaigns']) && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // }
        // // prüfen, ob kampagne aktuellem benutzer gehört
        // else if ($user->hasAnyPermission(['lumos-campaigns-view-own-campaigns']) && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // }

        // return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
        // return $user->hasAnyPermission(['lumos-campaigns-create-campaign']);
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Person $person): bool
    {
        return true;
        // if ($user->hasAnyPermission('lumos-campaigns-edit-all-campaigns') && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // } else if ($user->hasAnyPermission('lumos-campaigns-edit-own-campaigns') && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // }
        // return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Person $person): bool
    {
        return true;
        // if ($user->hasAnyPermission('lumos-campaigns-delete-all-campaigns') && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // } else if ($user->hasAnyPermission('lumos-campaigns-delete-own-campaigns') && $campaign->isOwnedBy($this->team)) {
        //     return true;
        // }
        // return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Person $person): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Person $person): bool
    {
        return false;
    }
}
