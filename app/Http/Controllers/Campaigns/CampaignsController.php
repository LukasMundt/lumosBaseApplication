<?php

namespace App\Http\Controllers\Campaigns;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Rawilk\Settings\Facades\Settings;

class CampaignsController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('Campaigns/Index', ['campaigns' => ['helo']]);
    }

    public function settings(Request $request)
    {
        return Inertia::render('Campaigns/Settings', [
            'settings' => [
                'sender' => Settings::get('sender', ""),
                'footer' => Settings::get('footer', ""),
            ]
        ]);
    }
}
