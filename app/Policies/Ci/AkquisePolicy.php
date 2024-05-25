<?php

namespace App\Policies\Ci;

use App\Models\Ci\Akquise;
use App\Models\Team;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AkquisePolicy
{
    /**
     * Perform pre-authorization checks.
     */
    public function before(User $user, string $ability): bool|null
    {
        if (Team::where('id', session()->get("team"))->first()->permissions()->where('name', 'tp-lumos-akquise-basic')->count() < 1) {
            return false;
        }

        setPermissionsTeamId(session()->get("team"));
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');
        
        return null;
    }

    public function viewAny(User $user): bool
    {
        return $user->hasAnyPermission([
            'lumos-akquise-view-own-projects',
            'lumos-akquise-view-all-projects'
        ]);
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, Akquise $akquise): bool
    {
        if ($user->hasAnyPermission(['lumos-akquise-view-all-projects'])) {
            return true;
        }
        // prüfen, ob akquise aktuellem benutzer gehört
        else if ($user->hasAnyPermission(['lumos-akquise-view-own-projects'])) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasAnyPermission('lumos-akquise-create-project');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Akquise $akquise, Team $team): bool
    {
        if ($user->hasAnyPermission('lumos-akquise-edit-all-projects')) {
            return true;
        } else if ($user->hasAnyPermission('lumos-akquise-edit-own-projects')) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        if ($user->hasAnyPermission('lumos-akquise-delete-all-projects')) {
            return true;
        } else if ($user->hasAnyPermission('lumos-akquise-delete-own-projects')) {
            return true;
        }
        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Team $team): bool
    {
        return false;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Team $team): bool
    {
        return false;
    }
}