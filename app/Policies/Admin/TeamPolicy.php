<?php

namespace App\Policies\Admin;

use App\Models\Team;
use App\Models\User;

class TeamPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        $hasManageOwnTeamAnywhere = false;
        foreach (Team::all() as $team) {
            setPermissionsTeamId($team->id);
            $user->unsetRelation('roles');
            $user->unsetRelation('permissions');

            if($hasManageOwnTeamAnywhere)
            {
                break;
            }
            else {
                $hasManageOwnTeamAnywhere = $user->hasPermissionTo('manage-own-team')==true;
            }
        }

        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return $user->hasRole('super-admin') ||
            $user->hasPermissionTo('manage-all-teams') ||
            $hasManageOwnTeamAnywhere;
    }

    // /**
    //  * Determine whether the user can view the model.
    //  */
    // public function view(User $user, Team $team): bool
    // {
    //     return true;
    // }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return $user->hasRole('super-admin') ||
            $user->hasPermissionTo('manage-all-teams');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, Team $team): bool
    {
        // global
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        $global = $user->hasRole('super-admin') || $user->hasPermissionTo('manage-all-teams');

        // team
        setPermissionsTeamId($team->id);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return $global || $user->hasPermissionTo('manage-own-team');
    }

    /**
     * Determine whether the user can update the permissions of a team.
     */
    public function update_team_permissions(User $user, Team $team):bool
    {
        // global
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return ($user->hasRole('super-admin') || $user->hasPermissionTo('manage-team-permissions'));
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, Team $team): bool
    {
        // this team
        // setPermissionsTeamId($team->id);
        // $user->unsetRelation('roles');
        // $user->unsetRelation('permissions');
        // $permissionToManageOwnTeam = $user->hasPermissionTo('manage-own-team');

        // global
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return $user->hasRole('super-admin') ||
            $user->hasPermissionTo('manage-all-teams');
            // || $permissionToManageOwnTeam;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, Team $team): bool
    {
        // this team
        // setPermissionsTeamId($team->id);
        // $user->unsetRelation('roles');
        // $user->unsetRelation('permissions');
        // $permissionToManageOwnTeam = $user->hasPermissionTo('manage-own-team');

        // global
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');
    
        return $user->hasRole('super-admin') ||
            $user->hasPermissionTo('manage-all-teams');
            // || $permissionToManageOwnTeam;
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, Team $team): bool
    {
        // this team
        // setPermissionsTeamId($team->id);
        // $user->unsetRelation('roles');
        // $user->unsetRelation('permissions');
        // $permissionToManageOwnTeam = $user->hasPermissionTo('manage-own-team');

        // global
        setPermissionsTeamId(0);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        return $user->hasRole('super-admin') ||
            $user->hasPermissionTo('manage-all-teams');
    }
}