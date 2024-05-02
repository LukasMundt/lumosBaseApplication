<?php

use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\ContactController;
use App\Http\Controllers\Api\V1\NotizController;
use App\Http\Controllers\Api\V1\PersonController;
use App\Http\Controllers\Ci\AkquiseController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware(['auth:sanctum'])->get('/user', function (Request $request) {
    return $request->user();
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/address')->name('api.v1.addresses.')->group(function () {
    Route::post('', [AddressController::class, 'findOrCreate'])->name('findOrCreate');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/contacts')->name('api.v1.contacts.')->group(function () {
    Route::post("/connect", [ContactController::class, 'connect'])->name("connect");
    Route::get("", [ContactController::class, 'index'])->name('index');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/contacts/persons')->name('api.v1.contacts.persons.')->group(function () {
    Route::get("", [PersonController::class, 'index'])->name('index');
    Route::post("", [PersonController::class, 'store'])->name('store');
    Route::post("/{person}/associate", [PersonController::class, 'associate'])->name('associate')->middleware(['auth:sanctum', 'verified', 'signed']);
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/projects')->name('api.v1.projects.')->group(function () {
    Route::post("/{project:id}/akquise", [AkquiseController::class, 'update'])->name('akquise');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix("/v1/notes")->name('api.v1.notes.')->group(function () {
    // save
    Route::post('', [NotizController::class, 'save'])->name('save')->middleware(['auth:sanctum', 'verified', 'signed']);
});
