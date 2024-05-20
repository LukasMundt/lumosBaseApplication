<?php

use App\Http\Controllers\Api\V1\AddressController;
use App\Http\Controllers\Api\V1\Campaigns\CampaignController;
use App\Http\Controllers\Api\V1\Campaigns\CampaignsController;
use App\Http\Controllers\Api\V1\Campaigns\ListController;
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

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/addresses')->name('api.v1.addresses.')->group(function () {
    Route::post('', [AddressController::class, 'findOrCreate'])->name('findOrCreate');
    Route::get("/autocomplete", [AddressController::class, 'autocomplete'])->name('autocomplete');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/projects')->name('api.v1.projects.')->group(function () {
    Route::get('/akquise/addresses-attributes', [App\Http\Controllers\Api\V1\Ci\AkquiseController::class, "addressAttributes"])->name('akquise.addressAttributes');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/contacts')->name('api.v1.contacts.')->group(function () {
    Route::post("/connect", [ContactController::class, 'connect'])->name("connect");
    Route::get("", [ContactController::class, 'index'])->name('index');

    Route::prefix('/persons')->name('persons.')->group(function () {
        Route::get("", [PersonController::class, 'index'])->name('index');
        Route::post("", [PersonController::class, 'store'])->name('store');
        Route::post("/{person}/associate", [PersonController::class, 'associate'])->name('associate')->middleware(['auth:sanctum', 'verified', 'signed']);
    });
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/projects')->name('api.v1.projects.')->group(function () {
    Route::post("/{project:id}/akquise", [AkquiseController::class, 'update'])->name('akquise');
});

Route::middleware(['auth:sanctum', 'verified'])->prefix('/v1/{domain}/campaigns')->name('api.v1.campaigns.')->group(function () {
    Route::post('/settings', [CampaignsController::class, 'storeSettings'])->name('settings.store');
    // campaigns
    Route::prefix('/campaigns')->name('campaigns.')->group(function () {
        Route::post('', [CampaignController::class, 'store'])->name('store');
        Route::post('/{campaign}', [CampaignController::class, 'update'])->name('update');
    });
    // lists
    Route::prefix('/lists')->name('lists.')->group(function () {
        Route::get('', [ListController::class, 'index'])->name('index');
        Route::post('', [ListController::class, 'store'])->name('store');
    });

});

Route::middleware(['auth:sanctum', 'verified'])->prefix("/v1/notes")->name('api.v1.notes.')->group(function () {
    // save
    Route::post('', [NotizController::class, 'save'])->name('save')->middleware(['auth:sanctum', 'verified', 'signed']);
});
