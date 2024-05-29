<?php

namespace App\Http\Controllers\Campaigns;

use App\Http\Controllers\Controller;
use App\Models\AddressList;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Rawilk\Settings\Facades\Settings;

class CampaignsController extends Controller
{
    public function index(Request $request)
    {
        $this->authorize('dashboard', Campaign::class);

        $team = session('team');
        $stats = [
            'campaigns' => ['count' => Campaign::ownedByTeam($team)->count()],
            'lists' => ['count' => AddressList::ownedByTeam($team)->count()]
        ];
        return Inertia::render('Campaigns/Index', ['stats' => $stats]);
    }

    public function settings(Request $request)
    {
        $this->authorize('settings', Campaign::class);

        return Inertia::render('Campaigns/Settings', [
            'settings' => [
                'sender' => Settings::get('sender', ""),
                'footer' => Settings::get('footer', ""),
            ]
        ]);
    }
}
