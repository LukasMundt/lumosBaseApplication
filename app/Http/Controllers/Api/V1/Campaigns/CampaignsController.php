<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\File;
use Rawilk\Settings\Facades\Settings;

class CampaignsController extends Controller
{
    public function storeSettings(Request $request)
    {
        // TODO: Policy
        $validated = $request->validate([
            'logo' => [File::image()->max(1024 * 12), 'nullable'],
            'sender' => ['string', 'max:255', "required"],
            'footer' => ['string', 'nullable'],
        ]);
        // Logo wird gespeichert, wenn übergeben
        if (isset($validated['logo']) && $validated['logo']) {
            $request->file('logo')->storeAs('/teams//' . session('team'), "logo." . $request->file('logo')->extension());
        }
        // Absender wird gespeichert, wenn übergeben
        if (isset($validated['sender']) && $validated['sender']) {
            Settings::set("sender", $validated['sender']);
        }
        if (isset($validated['footer']) && $validated['footer']) {
            Settings::set("footer", $validated['footer']);
        }

    }
}
