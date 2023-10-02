<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Team;
use App\Http\Requests\StoreTeamRequest;
use App\Http\Requests\UpdateTeamRequest;

class TeamController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Admin/Teams/Index', ['teams' => Team::all()]);
    }

    public function create()
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('create-team'), 403, 'Du hast nicht die nötige Berechtigung!');

        return Inertia::render('Admin/Teams/Create', ['users' => User::all()]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreTeamRequest $request)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('create-team'), 403, 'Du hast nicht die nötige Berechtigung!');

        $team = new Team();
        $team->name = $request->validated('name');
        $team->description = $request->validated('description');
        $team->save();

        return redirect(route("admin.teams.index"));

    }

    /**
     * Display the specified resource.
     */
    public function show(Team $team)
    {
        //
    }

    public function edit(Team $team){
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('edit-team'), 403, 'Du hast nicht die nötige Berechtigung!');

        return Inertia::render('Admin/Teams/Edit', [
            'team' => $team,
            'users' => User::all()
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateTeamRequest $request, Team $team)
    {
        setPermissionsTeamId(0);
        abort_if(!Auth::user()->hasPermissionTo('edit-Team'), 403, 'Du hast nicht die nötige Berechtigung!');

        $team->name = $request->validated('name');
        $team->description = $request->validated('description');
        $team->save();

        return redirect(route("admin.teams.index"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Team $team)
    {
        //
    }
}