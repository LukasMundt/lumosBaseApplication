<?php
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Admin\UserController;

Route::get('/admin', [AdminController::class, 'index'])->name('admin.index');

/**
 * Routes to manage the users
 */
Route::middleware(['auth', 'verified'])->prefix("admin")->group(function () {
    Route::get('/users', [UserController::class, 'index'])->name('admin.users.index');
    Route::get('/users/create', [UserController::class, 'create'])->name('admin.users.create');
    Route::post('/users', [UserController::class, 'store'])->name('admin.users.store');
    Route::get('/users/{user}', [UserController::class, 'show'])->name('admin.users.show');
    Route::get('/users/{user}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
    Route::post('users/{user}', [UserController::class, 'update'])->name('admin.users.update');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('admin.users.delete');
    Route::get('/users/{user}/restore', [UserController::class, 'restore'])->name('admin.users.restore');
});

/**
 * Routes to manage the roles
 */
Route::middleware(['auth', 'verified'])->prefix("admin")->group(function () {
    Route::get('/roles', [RoleController::class, 'index'])->name('admin.roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('admin.roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('admin.roles.store');
    // Route::get('/roles/{role}', [RoleController::class, 'show'])->name('admin.roles.show');
    Route::get('/roles/{role}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
    Route::post('roles/{role}', [RoleController::class, 'update'])->name('admin.roles.update');
    Route::delete('/roles/{role}', [RoleController::class, 'destroy'])->name('admin.roles.delete');
    Route::patch('/roles/{role}/restore', [RoleController::class, 'restore'])->name('admin.roles.restore');
});

/**
 * Routes to manage the teams
 */
Route::middleware(['auth', 'verified'])->prefix("admin")->group(function () {
    Route::get('/teams', [TeamController::class, 'index'])->name('admin.teams.index');
    Route::get('/teams/create', [TeamController::class, 'create'])->name('admin.teams.create');
    Route::post('/teams', [TeamController::class, 'store'])->name('admin.teams.store');
    Route::post('/teams/{team}/permissions', [TeamController::class, 'updateTeamPermissions'])->name('admin.teams.updateTeamPermissions');
    Route::post('/teams/{team}/users', [TeamController::class, 'addMember'])->name('admin.teams.addMember');
    Route::post('/teams/{team}/users/{user}/remove_from_team', [TeamController::class, 'removeMember'])->name('admin.teams.removeMember');
    Route::post('/teams/{team}/users/{user}/update_permission', [TeamController::class, 'updatePermissionsOfMember'])->name('admin.teams.updatePermissionsOfMember');
    // Route::get('/teams/{team}', [TeamController::class, 'show'])->name('admin.teams.show');
    Route::get('/teams/{team}/edit', [TeamController::class, 'edit'])->name('admin.teams.edit');
    Route::post('teams/{team}', [TeamController::class, 'update'])->name('admin.teams.update');
    Route::delete('/teams/{team}', [TeamController::class, 'delete'])->name('admin.teams.delete')->withTrashed();
    Route::patch('/teams/{team}/restore', [TeamController::class, 'restore'])->name('admin.teams.restore')->withTrashed();
});