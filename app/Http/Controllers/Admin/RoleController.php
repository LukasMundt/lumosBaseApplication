<?php

namespace App\Http\Controllers\Admin;

use Illuminate\Support\Facades\Auth;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Http\Requests\StoreRoleRequest;
use App\Http\Requests\UpdateRoleRequest;
use App\Http\Controllers\Controller;
use Inertia\Inertia;

class RoleController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Roles/Index', ['roles' => Role::with('permissions')->get()]);
    }

    public function create()
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
    public function show(Role $role)
    {

    }

    public function edit(Role $role)
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
    public function destroy(Role $role)
    {
        setPermissionsTeamId(0);
        if ($role->deletable && Auth::user()->hasPermissionTo('delete-role')) {
            $role->delete();
        } else {
            abort(403, 'Du hast nicht die nötige Berechtigung!');
        }
    }
}