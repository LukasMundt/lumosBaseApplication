<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Database\Factories\UserFactory;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        setPermissionsTeamId(0);
        if ($request->deletedUsers) {
            return Inertia::render('Admin/Users/Index', ['users' => User::withTrashed()->with('roles')->get()]);
        }
        return Inertia::render('Admin/Users/Index', ['users' => User::with('roles')->get()]);
    }

    /**
     * Display a form to create a new resource in storage.
     */
    public function create(Request $request)
    {
        setPermissionsTeamId(0);
        if (!Auth::user()->hasPermissionTo('create-user')) {
            abort(403);
        }
        return Inertia::render('Admin/Users/Create', ['roles' => Role::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
        setPermissionsTeamId(0);
        if (!Auth::user()->hasPermissionTo('create-user')) {
            abort(403);
        }
        User::factory()->createOne($request->validated());

        return redirect(route("admin.users.index"));
    }

    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        return Inertia::render('Admin/Users/Show', ['user' => $user]);
    }

    /**
     * Display a form to update a resource in storage.
     */
    public function edit(User $user)
    {
        setPermissionsTeamId(0);
        if (!Auth::user()->hasPermissionTo('edit-user')) {
            abort(403);
        }
        
        // Es werden nur globale Rollen zur Verfügung gestellt. Das lässt sich an der Team-Id 0 erkennen.
        $tempRoles = Role::where('team_id', 0)->get();
        // Rollen, die der aktuelle Benutzer auch verleihen kann
        $roles = [];
        foreach ($tempRoles as $role) {
            if (Auth::user()->hasAllPermissions($role->permissions)) {
                $roles[] = $role;
            }
        }


        return Inertia::render(
            'Admin/Users/Edit',
            [
                'user' => $user->load('roles'),
                'roles' => $roles,
            ]
        );
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        setPermissionsTeamId(0);
        if (!Auth::user()->hasPermissionTo('edit-user')) {
            abort(403);
        }

        $user->update($request->validated());

        
        $roles = [];
        foreach ($request->validated('roles') as $role) {
            $roles[] = $role['value'];
        }
        $user->syncRoles($roles);
        return redirect(route("admin.users.index"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        setPermissionsTeamId(0);
        // Zunächst wird überprüft ob der zu löschende Nutzer eine der beiden Admin-
        // Rollen hat. Ist das der Fall muss der löschende Nutzer die Berechtigung dazu
        // haben einen Admin zu löschen. Ist der zu löschende Nutzer kein Admin
        // muss der Löschende dennoch das Recht dazu haben Nutzer zu löschen.
        if (
            ($user->hasRole('admin') || $user->hasRole('super-admin')) &&
            Auth::user()->hasPermissionTo('delete-admin')
        ) {
            $user->delete();

        } else if (Auth::user()->hasPermissionTo('delete-user')) {
            $user->delete();
        } else {
            abort(403);
        }
    }

    public function restore(User $user)
    {
        $user->restore();
    }
}