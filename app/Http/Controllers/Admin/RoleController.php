<?php

namespace App\Http\Controllers\Admin;

use App\Models\Team;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $validated = $request->validate([
            'team' => ['integer', 'nullable'],
        ]);

        $team = isset($validated['team']) ? $validated['team'] : null;

        if (isset($team)) {
            $roles = Role::where('team_id', $team)->with('permissions')->get();
        } else {
            $roles = Role::with('permissions')->get();
        }

        abort_if(isset($team) && Team::find($team) === null, 404);

        return Inertia::render('Admin/Roles/Index', ['roles' => $roles]);
    }

    public function create(Request $request)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('create-role'), 403, 'Du hast nicht die nötige Berechtigung!');

        return Inertia::render(
            'Admin/Roles/Create',
            ['permissions' => Permission::all()]
        );
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreRoleRequest $request)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('create-role'), 403, 'Du hast nicht die nötige Berechtigung!');

        $role = new Role();
        $role->name = $request->validated('name');
        $role->team_id = 0;
        $role->deletable = 1;
        $role->save();

        // assign the selected permissions to this role
        foreach ($request->validated('permissions') as $permission) {
            $role->givePermissionTo($permission['value']);
        }

        return redirect(route("admin.roles.index"));
    }

    /**
     * Display the specified resource.
     */
    public function show(Request $request, Role $role)
    {

    }

    public function edit(Request $request, Role $role)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('edit-role'), 403, 'Du hast nicht die nötige Berechtigung!');

        return Inertia::render(
            'Admin/Roles/Edit',
            [
                'permissions' => Permission::all(),
                'role' => $role->load('permissions')
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateRoleRequest $request, Role $role)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('edit-role'), 403, 'Du hast nicht die nötige Berechtigung!');

        $role->name = $request->validated('name');
        $role->team_id = 0;
        // $role->deletable = 1;
        $role->save();

        // assign the selected permissions to this role
        $role->revokePermissionTo($role->getAllPermissions());
        foreach ($request->validated('permissions') as $permission) {
            $role->givePermissionTo($permission['value']);
        }

        return redirect(route("admin.roles.index"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request, Role $role)
    {
        setPermissionsTeamId(0);
        if ($role->deletable && Auth::user()->hasPermissionTo('delete-role')) {
            $role->delete();
        } else {
            abort(403, 'Du hast nicht die nötige Berechtigung!');
        }
    }
}