<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

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
    Route::patch('/roles/{role}/restore', [RoleRoleControllerController::class, 'restore'])->name('admin.roles.restore');
});

/**
 * Routes to manage the teams
 */
Route::middleware(['auth', 'verified'])->prefix("admin")->group(function () {
    Route::get('/teams', [TeamController::class, 'index'])->name('admin.teams.index');
    Route::get('/teams/create', [TeamController::class, 'create'])->name('admin.teams.create');
    Route::post('/teams', [TeamController::class, 'store'])->name('admin.teams.store');
    // Route::get('/teams/{team}', [TeamController::class, 'show'])->name('admin.teams.show');
    Route::get('/teams/{team}/edit', [TeamController::class, 'edit'])->name('admin.teams.edit');
    Route::post('teams/{team}', [TeamController::class, 'update'])->name('admin.teams.update');
    Route::delete('/teams/{team}', [TeamController::class, 'destroy'])->name('admin.teams.delete');
    Route::patch('/teams/{team}/restore', [TeamController::class, 'restore'])->name('admin.teams.restore');
});

require __DIR__ . '/auth.php';