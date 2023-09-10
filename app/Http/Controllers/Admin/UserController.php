<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Http\Requests\StoreUserRequest;
use App\Http\Requests\UpdateUserRequest;
use Database\Factories\UserFactory;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Illuminate\Http\Request;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        if($request->deletedUsers){
            return Inertia::render('Admin/Users/Index', ['users' => User::withTrashed()->with('roles')->get()]);
        }
        return Inertia::render('Admin/Users/Index', ['users' => User::with('roles')->get()]);
    }

    /**
     * Display a form to create a new resource in storage.
     */
    public function create(Request $request)
    {
        return Inertia::render('Admin/Users/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreUserRequest $request)
    {
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
        return Inertia::render('Admin/Users/Edit', ['user' => $user]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateUserRequest $request, User $user)
    {
        Log::debug("The update-function in the controller got called.");
        $user->update($request->validated());
        return redirect(route("admin.users.index"));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(User $user)
    {
        $user->delete();
    }

    public function restore(User $user){
        return $user->restore();
    }
}