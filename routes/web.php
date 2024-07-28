<?php

use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\TeamController;
use App\Http\Controllers\Campaigns\CampaignController;
use App\Http\Controllers\Campaigns\CampaignsController;
use App\Http\Controllers\Campaigns\ListController;
use App\Http\Controllers\Controller;
use App\Http\Controllers\PersonController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\RootController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;
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

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });
Route::redirect("/", "/personal");
// Health route
Route::get("/health", fn() => []);
// Route::redirect("/dashboard","/personal");

Route::get('/planner', function () {
    $data = Storage::get('resources.json');
    $data = json_decode($data, 1);
    $data = $data['taskList'];
    // [$keys, $values] = Arr::divide($data);
    foreach ($data as $key => $item) {
        unset ($item['instances'], $item['taskSource'], $item['deleted'], $item['eventCategory'], $item['eventSubType'], $item['notes'], $item['id'], $item['status'], $item['alwaysPrivate'], $item['priority'], $item['onDeck'], $item['readOnlyFields'], $item['type'], $item['timeSchemeId']);
        $due = Illuminate\Support\Carbon::createFromFormat("Y-m-d\\TH:i:sO", $item['due'], "Europe/Berlin");
        $item['prioritaetInListe'] = $item['timeChunksRemaining'] * Illuminate\Support\Carbon::now()->diffInMinutes($due);
        // $item['due'] = str_replace("T"," ", $item['due']);
        // $tz = new CarbonTimeZone('Europe/Zurich');
        // var_dump($due->toRfc822String());
        $item['start'] = $due->toDateTimeLocalString();
        $item['color'] = "#123456";
        $data[$key] = $item;
    }

    // $calendar = Http::withBasicAuth('lukas.mundt','kSrtq-pmibn-3xQ2i-tbBrf-dSNTf')->send('PROPFIND', 'https://cloud.lukas-mundt.de/remote.php/dav/principals/users/lukas.mundt/')->body();

    return Inertia::render('Planner', [
        'events' => $data,
        'cal' => Inertia::lazy(function () {
            return Http::withBasicAuth('lukas.mundt', 'kSrtq-pmibn-3xQ2i-tbBrf-dSNTf')->send('PROPFIND', 'https://cloud.lukas-mundt.de/remote.php/dav/principals/users/lukas.mundt/')->body();
        })
    ]);
    // return view('planner', ['items' => $data]);
});
//

// Route::get("/", [RootController::class, 'root'])->name('root');




// Route::get('/dashboard', function () {
//     return Inertia::render('Dashboard', ['str' => "Persönlich"]);
// })->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


require __DIR__ . '/auth.php';
require __DIR__ . '/admin.php';
require __DIR__ . '/webPci.php';
require __DIR__ . '/webPciA.php';

Route::middleware(['auth', 'verified'])->group(function () {
    // Route::get('/{domain}/contacts/persons', [PersonController::class, 'index']);
});

Route::middleware(['auth', 'verified'])->prefix('/{domain}/campaigns')->name('campaigns.')->group(function () {
    Route::get('/', [CampaignsController::class, 'index'])->name('index');
    Route::get('/campaigns', [CampaignController::class, 'index'])->name('campaigns.index');
    Route::get('/campaigns/settings', [CampaignsController::class, 'settings'])->name('campaigns.settings');
    Route::get('/campaigns/{campaign}/edit', [CampaignController::class, 'edit'])->name('campaigns.edit');
    Route::get('/campaigns/{campaign}/preview', [CampaignController::class, 'preview'])->name('campaigns.preview');
    Route::get('/campaigns/{campaign}/download', [CampaignController::class, 'download'])->name('campaigns.download');
    Route::get('/lists', [ListController::class, 'index'])->name('lists.index');
    Route::get('/lists/{list}/edit', [ListController::class, 'edit'])->name('lists.edit');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/{domain}/logo', [RootController::class, 'logo'])->name('team.logo');
    Route::get('/{domain}/{path?}', [RootController::class, 'domainDashboard'])->name('team.dashboard');
});