<?php

use App\Http\Controllers\Ci\AkquiseController;
use App\Http\Controllers\ToolController;
use Illuminate\Support\Facades\Route;

Route::middleware(['web', 'auth', 'verified'])->group(function () {
    Route::get('/tools/fixbauantrag2link', [ToolController::class, 'fixBauantrag2LinkView'])->name('tools.fixBauantrag2LinkView');
    Route::post('/tools/fixbauantrag2link', [ToolController::class, 'fixBauantrag2Link'])->name('tools.fixBauantrag2Link');
});

Route::middleware(['auth:sanctum', 'verified'])->group(function () {
    Route::get('/creatables/list', [AkquiseController::class, 'listCreatables'])->name('akquise.akquise.listcreatables');
    Route::get('/creatables/details', [AkquiseController::class, 'detailsByCoordinates'])->name('akquise.akquise.detailsOfCreatable');
});

Route::middleware(['web', 'auth', 'verified'])->prefix("/{domain}/ci")->group(function () {
    // Route::get('', [Controller::class, 'dashboard'])->name('akquise.dashboard');

    Route::middleware([])->prefix("/projects")->group(function () {
        // Karte
        Route::get('/map', [AkquiseController::class, 'map'])->name('akquise.akquise.map');

        // Route::get('/{projekt}/notiz/{notiz}', [AkquiseController::class, 'show'])->name('akquise.akquise.showMitNotiz');
        Route::get('/{projekt}/akquise', [AkquiseController::class, 'show'])->name('akquise.akquise.show');
        Route::post('/{projekt}/akquise', [AkquiseController::class, 'update'])->name('akquise.akquise.update');


        Route::get('', [AkquiseController::class, 'index'])->name('akquise.akquise.index');
        Route::get('/create/1', [AkquiseController::class, 'create'])->name('akquise.akquise.create');
        Route::post('', [AkquiseController::class, 'store'])->name('akquise.akquise.store');
        Route::get('/{projekt}/edit', [AkquiseController::class, 'edit'])->name('akquise.akquise.edit');


        // Routen fuer Personen
        // Route::get('/{projekt}/personen/associate', [PersonController::class, 'associate'])->name('akquise.akquise.personen.associate');
        // Route::post('/{projekt}/personen/associate', [PersonController::class, 'storeAssociation'])->name('akquise.akquise.personen.storeAssociation');
    });
});
// Route::get('/pdf', [Controller::class, 'pdf'])->name('akquise.akquise.pdf');