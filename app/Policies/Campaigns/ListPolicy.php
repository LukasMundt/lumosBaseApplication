<?php

namespace App\Policies\Campaigns;

use App\Contracts\SendList;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class ListPolicy
{
    private Team $team;

    public function __construct()
    {
        $this->team = Team::where('id', session("team"))->first();
    }

    public function before(User $user, string $ability): bool|null
    {
        if (Team::where('id', session("team"))->first()->permissions()->where('name', 'tp-lumos-akquise-basic')->count() < 1) {
            return false;
        }

        setPermissionsTeamId(session("team"));
        $user->unsetRelation("roles");
        $user->unsetRelation("permissions");

        return null;
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission([
            "lumos-campaigns-view-own-lists",
            'lumos-campaigns-view-all-lists'
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SendList $addressList): bool
    {
        if ($user->hasAnyPermission(['lumos-campaigns-view-all-lists']) && $addressList->isOwnedBy($this->team)) {
            return true;
        }
        // prüfen, ob kampagne aktuellem benutzer gehört
        else if ($user->hasAnyPermission(['lumos-campaigns-view-own-lists']) && $addressList->isOwnedBy($this->team)) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission('lumos-campaigns-create-list');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SendList $addressList): bool
    {
        if ($user->hasAnyPermission('lumos-campaigns-edit-all-lists') && $addressList->isOwnedBy($this->team)) {
            return true;
        } else if ($user->hasAnyPermission('lumos-campaigns-edit-own-lists') && $addressList->isOwnedBy($this->team)) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SendList $addressList): bool
    {
        if ($user->hasAnyPermission('lumos-campaigns-delete-all-lists') && $addressList->isOwnedBy($this->team)) {
            return true;
        } else if ($user->hasAnyPermission('lumos-campaigns-delete-own-lists') && $addressList->isOwnedBy($this->team)) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SendList $addressList): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SendList $addressList): bool
    {
        return false;
    }
}
