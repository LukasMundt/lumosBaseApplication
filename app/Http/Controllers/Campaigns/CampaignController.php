<?php

namespace App\Http\Controllers\Campaigns;

use App\Http\Controllers\Controller;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Rawilk\Settings\Facades\Settings;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Facades\Pdf;

class CampaignController extends Controller
{
    public function index()
    {
        // $campaigns = Campaign::where('owned_by_type', Team::class)
        //     ->where('owned_by_id', session('team'))
        //     ->get();
        $campaigns = Campaign::get(['deleted_at', 'id', 'name', 'send', 'created_at', 'updated_at']);
        // TODO: only show campaigns owned by the team of the sender of the request
        return Inertia::render('Campaigns/Campaign/Index', ['campaigns' => $campaigns]);
    }

    public function edit(Request $request, $domain, Campaign $campaign)
    {
        // TODO: Policy and Validation
        return Inertia::render(
            'Campaigns/Campaign/Edit',
            ['campaign' => $campaign->load('addressList')]
        );
    }

    public function preview(Request $request, $domain, Campaign $campaign)
    {
        // TODO: Ersetzung von Anrede usw. in preview genau so machen, wie in eigentlichem serienbrief
        $logoPath = "/teams//" . session('team') . "/";
        $files = Storage::allFiles("/teams//" . session('team') . "/");
        $logoPath = null;
        foreach ($files as $file) {
            if (Str::of($file)->contains($logoPath . "logo.")) {
                $logoPath = $file;
            }
        }

        // TODO: what to do if no logo saved

        // return $campaign->content;
        return Pdf::withBrowsershot(function (Browsershot $browsershot) {
            $browsershot->noSandbox();
        })->view('campaigns.multi', [
                    'content' => $campaign->content,
                    'title' => 'Dies ist der Titel',
                    'date_for_print' => $campaign->date_for_print,
                    'sender' => Settings::get('sender', ""),
                    'logo' => "data:image/png;base64," . base64_encode(Storage::get($logoPath)),
                    'recipients' => [
                        [
                            "line1" => "Max Mustermann",
                            "line2" => "Musterstraße 2",
                            "line3" => "54321 Musterstädtchen",
                            "anrede" => "Sehr geehrter Herr Mustermann"
                        ]
                    ]
                ])
            ->footerView('campaigns.footer.default', [
                'content' => Settings::get('footer', ""),
                'margins' => '20mm'
            ])
            ->margins(20, 20, 20, 20)
            ->name('preview_' . $campaign->name . ".pdf");
    }

    public function download($domain, Campaign $campaign)
    {
        // TODO: validate (also if campaign is send)
        $team = session('team');
        $path = "/teams//" . $team . '/campaigns//' . $campaign->id . ".pdf";
        if (Storage::exists($path)) {
            return Storage::download($path, $campaign->name . ".pdf");
        } else {
            abort(404, "Download fehlgeschlagen.");
        }
    }
}
