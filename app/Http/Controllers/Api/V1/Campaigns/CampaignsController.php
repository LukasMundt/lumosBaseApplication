<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\File;
use Rawilk\Settings\Facades\Settings;

class CampaignsController extends Controller
{
    public function storeSettings(Request $request)
    {
        $this->authorize('settings', Campaign::class);

        $validated = $request->validate([
            'logo' => [
                File::image()
                    ->extensions(['jpg', 'jpeg', 'png'])
                    ->max(1024 * 12),
                'nullable'
            ],
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

        // TODO: Salutations auch noch für das gesamte Team einstellen können

    }
}
