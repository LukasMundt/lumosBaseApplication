<?php

use Illuminate\Support\Facades\Route;
use Lukasmundt\ProjectCI\Http\Controllers\KampagneController;
// use Lukasmundt\ProjectCI\Http\Controllers\PersonController;
use Lukasmundt\ProjectCI\Http\Controllers\ProjektController;


// Route::middleware(['web', 'auth', 'verified'])->prefix("{domain}/contacts")->group(function () {
//     Route::get('/create', [PersonController::class, 'create'])->name('contact.create');
//     Route::post('', [PersonController::class, 'store'])->name('contact.store');

//     Route::get("", [PersonController::class, "index"])->name("contact.index");
//     Route::get("/{person}", [PersonController::class, "show"])->name("contact.show");

//     Route::get('/{person}/edit', [PersonController::class, 'edit'])->name('contact.edit');
//     Route::post('/{person}', [PersonController::class, 'update'])->name('contact.update');
// });

Route::middleware(['web', 'auth', 'verified'])->prefix("projectci")->name('')->group(function () {
    // Route::get('', [ProjektController::class, 'index'])->name('akquise.index');

    // Kampagne
    // Route::middleware([])->prefix("kampagne")->name('projectci.kampagne.')->group(function () {
    //     // Route::get('/create', [KampagneController::class, 'stepByStepCreate']);
    //     // neue Kampagne - Schritt für Schritt -> SBS
    //     Route::get('/create/{id?}/{step?}', [KampagneController::class, 'stepByStepCreate'])->name('SBS-Create');
    //     // stepByStep - set Properties (SBS = StepByStep)
    //     Route::post('create/setProps/{id?}', [KampagneController::class, 'SBS_setProps'])->name('SBS-SetProps');
    //     // index
    //     Route::get('', [KampagneController::class, 'index'])->name('index');
    //     // show
    //     Route::get('{kampagne}', [KampagneController::class, 'show'])->name('show');
    //     // abschliessen und Serienbrief drucken
    //     Route::post('{kampagne}/abschliessen', [KampagneController::class, 'abschliessen'])->name('abschliessen');
    //     // download ausgedruckten Serienbrief
    //     Route::get('{kampagne}/download', [KampagneController::class, 'download'])->name('download');
    //     Route::get('{kampagne}/vorlage', [KampagneController::class, 'showVorlage'])->name('vorlage');
    // });
});