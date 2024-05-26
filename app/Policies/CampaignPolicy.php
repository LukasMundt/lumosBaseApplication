<?php

namespace App\Policies;

use App\Models\Campaign;
use App\Models\Team;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class CampaignPolicy
{
    public function before(User $user, string $ability): bool|null
    {
        if(Team::where('id', session("team"))->first()->permissions()->where('name','tp-lumos-akquise-basic')->count() < 1) {
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
            "lumos-campaigns-view-own-campaigns",
            'lumos-campaigns-view-all-campaigns'
        ]);
        
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Campaign $campaign): bool
    {
        if ($user->hasAnyPermission(['lumos-campaigns-view-all-campaigns'])) {
            return true;
        }
        // prüfen, ob kampagne aktuellem benutzer gehört
        else if ($user->hasAnyPermission(['lumos-campaigns-view-own-campaigns'])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission('lumos-campaigns-create-campaign');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Campaign $campaign): bool
    {
        if ($user->hasAnyPermission('lumos-campaigns-edit-all-campaigns')) {
            return true;
        } else if ($user->hasAnyPermission('lumos-campaigns-edit-own-campaigns')) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Campaign $campaign): bool
    {
        if ($user->hasAnyPermission('lumos-campaigns-delete-all-campaigns')) {
            return true;
        } else if ($user->hasAnyPermission('lumos-campaigns-delete-own-campaigns')) {
            return true;
        }
        return false;
    }

    public function send(User $user, Campaign $campaign)
    {
        if ($user->hasAnyPermission('lumos-campaigns-send-all-campaigns')) {
            return true;
        } else if ($user->hasAnyPermission('lumos-campaigns-send-own-campaigns')) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Campaign $campaign): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Campaign $campaign): bool
    {
        return false;
    }
}
