<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddMemberToTeamRequest;
use App\Http\Requests\UpdatePermissionsOfTeamMemberRequest;
use App\Http\Requests\UpdateTeamPermissionsRequest;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Team;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class TeamController extends Controller
{

    public function __construct()
    {
        $this->authorizeResource(Team::class, 'team');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $rawTeams = Team::all();
        $teams = $rawTeams;

        setPermissionsTeamId(0);
        Auth::user()->unsetRelation('roles');
        Auth::user()->unsetRelation('permissions');

        if (!Auth::user()->hasRole('super-admin') && !Auth::user()->hasPermissionTo('manage-all-teams')) {
            $teams = [];
            foreach ($teams as $team) {
                setPermissionsTeamId($team['id']);
                Auth::user()->unsetRelation('roles');
                Auth::user()->unsetRelation('permissions');

                if (Auth::user()->hasPermissionTo('manage-own-team')) {
                    $teams[] = $team;
                }
            }
        }

        return Inertia::render('Admin/Teams/Index', ['teams' => $teams]);
    }

    public function create(Request $request)
    {
        return Inertia::render('Admin/Teams/Create', ['users' => User::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeamRequest $request)
    {
        $team = new Team();
        $team->name = $request->validated('name');
        $team->description = $request->validated('description');
        $team->save();

        return redirect(route("admin.teams.index"));

    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Team $team)
    {
        //
    }

    public function edit(Request $request, Team $team)
    {
        // dem nutzer werden alle rollen für die zuordnung angeboten, die dem team selbst zugeordnet sind
        // oder die vorlage-rollen des default teams sind
        $roles = [];
        $defaultRoles = Role::where("name", "LIKE", "team-%")->where("team_id", 0)->get();
        $teamRoles = Role::where("team_id", $team->id)->get();

        $roles = $teamRoles;

        $roleNames = Arr::map($roles->toArray(), function (array $value, string $key) {
            return $value['name'];
        });
        foreach ($defaultRoles as $key => $defaultRole) {
            if (!in_array($defaultRole->name, $roleNames)) {
                $roles[] = $defaultRole;
            }
        }
        // ende der filterung der rollen nach teams

        $teamPermissions = Permission::where('name', "LIKE", "tp-%")->get(['id',"name"]);

        // uncomment to sort the roles alphabetical
        // $roles = array_values(Arr::sort($roles->toArray(), function (array $value) {
        //     return $value['name'];
        // }));

        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team,
            'users' => User::all(),
            'roles' => $roles,
            'teamPermissions' => $teamPermissions,
            'teamPermissionsCurrent' => $team->permissions()->allRelatedIds(),
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        $team->name = $request->validated('name');
        $team->description = $request->validated('description');
        $team->save();

        return response(200);
    }

    public function addMember(AddMemberToTeamRequest $request, Team $team)
    {
        $this->authorize('update', $team);

        // input in request validiert
        // user aus input in datenbank finden
        $user = User::where('id', $request->validated('user'))->first();

        // prüfen, ob rolle geclont werden muss und ggf. rolle clonen
        $role = Role::where('id', $request->validated('role'))->first();
        if ($role->team_id == $team->id) {
            $finalRole = $role;
        } else {
            $finalRole = Role::create(['name' => $role->name]);
            $finalRole->syncPermissions($role->permissions);
        }

        // rolle dem nutzer zuweisen
        $user->assignRole($role);
    }

    public function removeMember(Request $request, Team $team, User $user)
    {
        $this->authorize('update', $team);

        // in team wechseln
        setPermissionsTeamId($team->id);
        Auth::user()->unsetRelation('roles');
        Auth::user()->unsetRelation('permissions');
        // alle rollen und permissions im aktuellen Team ausgeben und anschließend entfernen
        $user->syncRoles([]);
        $user->syncPermissions([]);
    }

    public function updatePermissionsOfMember(UpdatePermissionsOfTeamMemberRequest $request, Team $team, User $user)
    {
        $this->authorize('update', $team);
        // input wird in request überprüft
        // sync roles für nutzer mit der neuen rolle
        return $user->syncRoles($request->validated('roles'));
    }

    public function updateTeamPermissions(UpdateTeamPermissionsRequest $request, Team $team)
    {
        // Log::debug("before");
        $this->authorize('update_team_permissions', $team);
        Log::debug($request->teamPermissions);

        $team->permissions()->sync($request->teamPermissions,true);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function delete(Request $request, Team $team)
    {
        $this->authorize('delete', $team);

        if ($team->trashed()) {
            $this->authorize('forceDelete', $team);
            return $team->forceDelete();
        }
        return $team->delete();
    }

    public function restore(Request $request, Team $team)
    {
        $this->authorize('restore', $team);
        return $team->restore();
    }
}