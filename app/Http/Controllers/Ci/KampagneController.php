<?php

namespace App\Http\Controllers\Ci;

use App\Http\Controllers\Controller;
use App\Models\Ci\Kampagne;
use App\Models\Ci\PdfVorlage;
use App\Models\Ci\Projekt;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\View;
use Illuminate\Support\Str;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\File;
use Inertia\Inertia;
use Illuminate\Http\Request;

class KampagneController extends Controller
{
    public function index(Request $request)
    {
        return Inertia::render('lukasmundt/projectci::Kampagne/Index', [
            'kampagnen' => Kampagne::all(),
        ]);
    }

    public function show(Request $request, Kampagne $kampagne)
    {
        $filter = $kampagne['filter'];

        $projekte = Projekt::whereRelation('akquise', 'nicht_gewuenscht', false)
            ->where(function (Builder $query) use ($filter) {
                $query->whereIn('strasse', $filter['strasse'] ?? [], 'and', !isset($filter['strasse']) || count($filter['strasse']) == 0)
                    ->whereIn('hausnummer', $filter['hausnummer'] ?? [], 'and', !isset($filter['hausnummer']) || count($filter['hausnummer']) == 0)
                    ->whereIn('stadtteil', $filter['stadtteil'] ?? [], 'and', !isset($filter['stadtteil']) || count($filter['stadtteil']) == 0)
                    ->whereIn('plz', $filter['plz'] ?? [], 'and', !isset($filter['plz']) || count($filter['plz']) == 0);
            })
            ->count();

        $pfad = route('projectci.kampagne.vorlage',['kampagne' => $kampagne]);

        return Inertia::render('lukasmundt/projectci::Kampagne/Show', [
            'kampagne' => $kampagne,
            'projekte' => $projekte,
            'vorlagePfad' => $pfad,
        ]);
    }

    public function showVorlage(Request $request, Kampagne $kampagne)
    {
        return Storage::download($kampagne->vorlage->pfad, $kampagne->vorlage->bezeichnung, [
            'Content-Disposition' => 'inline',
        ]);
    }

    public function download(Request $request, Kampagne $kampagne)
    {
        $filename = 'kampagnen/serienbrief/' . $kampagne['id'] . ".pdf";
        abort_if(!Storage::exists($filename), '404');

        return Storage::download($filename, $kampagne['bezeichnung'] . '.pdf');
    }

    public function stepByStepCreate(Request $request, string $id = "0", string $step = "0")
    {
        // Log::debug(Cache::get('SBS01HFJ85Z9YDWHZYWHBMP3K98KR'));
        if ($step == "1") {
            return Inertia::render(
                'lukasmundt/projectci::Kampagne/B_WelcherName',
                ['id' => $id]
            );
        } else if ($step == "2" || $step == "2.1" || $step == "2.2") {
            $campaignCache = Cache::get($id);

            $stadtteile = [];
            $postleitzahl = [];
            $strassen = [];
            switch ($step) {
                case '2.2':
                    $strassen = Projekt::whereRelation('akquise', 'nicht_gewuenscht', false)
                        ->whereIn('stadtteil', $campaignCache['filter']['stadtteil'])
                        ->whereIn('plz', $campaignCache['filter']['plz'])
                        ->orderBy('strasse')
                        ->get('strasse')
                        ->groupBy('strasse')
                        ->transform(function ($item, string $key) {
                            return count($item);
                        });
                    $strassen = $strassen->keys()->zip($strassen->values());
                case '2.1':
                    $postleitzahl = Projekt::whereRelation('akquise', 'nicht_gewuenscht', false)
                        ->whereIn('stadtteil', $campaignCache['filter']['stadtteil'])
                        ->orderBy('plz')
                        ->get('plz')
                        ->groupBy('plz')
                        ->transform(function ($item, string $key) {
                            return count($item);
                        });
                    $postleitzahl = $postleitzahl->keys()->zip($postleitzahl->values());
                default:
                    $stadtteile = Projekt::whereRelation('akquise', 'nicht_gewuenscht', false)
                        ->orderBy('stadtteil')
                        ->get('stadtteil')
                        ->groupBy('stadtteil')
                        ->transform(function ($item, string $key) {
                            return count($item);
                        });
                    $stadtteile = $stadtteile->keys()->zip($stadtteile->values());
            }







            return Inertia::render(
                'lukasmundt/projectci::Kampagne/C_Filter',
                [
                    'step' => $step,
                    'id' => $id,
                    'stadtteile' => $stadtteile,
                    'postleitzahlen' => $postleitzahl,
                    'strassen' => $strassen,
                ]
            );
        } else if ($step == "3") {
            return Inertia::render(
                'lukasmundt/projectci::Kampagne/D_PdfVorlage',
                [
                    'step' => $step,
                    'id' => $id,
                ]
            );
        } else {
            return Inertia::render('lukasmundt/projectci::Kampagne/A_WelcherTyp');
        }
    }

    public function SBS_SetProps(Request $request, string $id = "")
    {
        $validated = $request->validate([
            'key' => ['required', Rule::in(['typ', 'name', 'filter', 'vorlage'])],
        ]);
        if ($validated['key'] == 'typ') {
            $validated = $request->validate([
                'key' => ['required'],
                'typ' => ['required', 'string', 'max:255'],
            ]);

            $ulid = Str::ulid();
            while (Cache::has($ulid)) {
                $ulid = Str::ulid();
            }

            $data = ['typ' => $validated['typ']];

            Cache::put('SBS' . $ulid, $data);

            return redirect(
                route(
                    'projectci.kampagne.SBS-Create',
                    ['step' => 1, 'id' => "SBS" . $ulid]
                )
            );
        } else if ($validated['key'] == 'name') {
            $validated = $request->validate([
                'key' => ['required'],
                'name' => ['required', 'string', 'max:255'],
            ]);
            Log::debug($validated);
            Log::debug($id);

            $data = Cache::get($id);
            $data['name'] = $validated['name'];

            Cache::put($id, $data);

            return to_route(
                'projectci.kampagne.SBS-Create',
                ['step' => 2, 'id' => $id]
            );
        } else if ($validated['key'] == 'filter') {
            $validated = $request->validate([
                'key' => ['required'],
                'filter' => ['required', 'string', 'max:255'],
                'values' => ['array'],
            ]);
            Log::debug($validated);
            Log::debug($id);

            $data = Cache::get($id);
            $data['filter'][$validated['filter']] = $validated['values'];

            Cache::put($id, $data);

            Log::debug(Cache::get($id));

            $nextStep = "2.1";
            if ($validated['filter'] == "plz") {
                $nextStep = "2.2";
            } else if ($validated['filter'] == "strasse") {
                $nextStep = "3";
            }
            return to_route(
                'projectci.kampagne.SBS-Create',
                ['step' => $nextStep, 'id' => $id]
            );
        } else if ($validated['key'] == 'vorlage') {
            $validated = $request->validate([
                'key' => ['required'],
                'vorlage' => ['required', File::types(['pdf'])->max(20 * 1024)],
                'bezeichnung' => ['required', 'string', 'max:255']
            ]);

            // Vorlage wird gespeichert und DB-Eintrag erstellt
            $fileName = Str::ulid();
            Storage::putFileAs('pdfVorlagen', $request->file('vorlage'), $fileName . "." . $request->vorlage->extension());
            $vorlage = PdfVorlage::create([
                'pfad' => 'pdfVorlagen/' . $fileName . "." . $request->vorlage->extension(),
                'bezeichnung' => $validated['bezeichnung'],
                'created_by' => Auth::user()->id,
                'updated_by' => Auth::user()->id,
            ]);

            // Kampagne wird in DB gespeichert
            $data = Cache::get($id);
            Log::debug($id);
            $vorlage->kampagnen()->save(
                $kampagne = new Kampagne([
                    'bezeichnung' => $data['name'],
                    'typ' => $data['typ'],
                    'status' => 0,
                    'filter' => $data['filter'],
                    'reichweite' => -1,
                    'created_by' => Auth::user()->id,
                    'updated_by' => Auth::user()->id,
                ])
            );
            Cache::forget($id);
            return to_route('projectci.kampagne.show', ['kampagne' => $kampagne->id]);

        } else {
            abort(404);
        }
    }


    public function abschliessen(Request $request, Kampagne $kampagne)
    {
        $this->print($kampagne);
    }

    private function print(Kampagne $kampagne)
    {
        // Vorlage wird geladen
        $kampagne->load('vorlage');
        $filter = $kampagne['filter'];
        // Log::debug(gettype($filter));

        // alle Projekte filtern
        $projekte = Projekt::whereRelation('akquise', 'nicht_gewuenscht', false)
            ->where(function (Builder $query) use ($filter) {
                $query->whereIn('strasse', $filter['strasse'] ?? [], 'and', !isset($filter['strasse']) || count($filter['strasse']) == 0)
                    ->whereIn('hausnummer', $filter['hausnummer'] ?? [], 'and', !isset($filter['hausnummer']) || count($filter['hausnummer']) == 0)
                    ->whereIn('stadtteil', $filter['stadtteil'] ?? [], 'and', !isset($filter['stadtteil']) || count($filter['stadtteil']) == 0)
                    ->whereIn('plz', $filter['plz'] ?? [], 'and', !isset($filter['plz']) || count($filter['plz']) == 0);
            })
            ->get();

        $pdf = new KampagnePdf();
        $pdf->SetTitle($kampagne['bezeichnung']);
        $pdf->SetMargins(20, 20, 20);
        $pdf->setFont('dejavusans');

        // Template
        $pdf->setSourceFile(Storage::readStream($kampagne['vorlage']['pfad']));
        $tpl = $pdf->importPage(1);

        // Alle Projekte werden behandelt
        foreach ($projekte as $projekt) {
            // Akquise laden
            $projekt = $projekt->load(['akquise.gruppen.personen']);

            // leeres Array empfaenger für dieses Projekterzeugt 
            // -> mehrere Empfaenger möglich, jeder mit Adresse
            $empfaenger = [];

            // wenn Gruppen zugeordnet
            if (count($projekt->akquise->gruppen) > 0) {
                // hat gruppen-elemente
                foreach ($projekt->akquise->gruppen as $gruppe) {
                    // an nachbarn wird kein Brief geschickt
                    if ($gruppe->pivot->typ == 'nachbar') {
                        continue;
                    }

                    $adressat = '';

                    // jede Person wird behandelt
                    foreach ($gruppe->personen as $person) {
                        if (!empty($adressat)) {
                            $adrssat .= ' und ';
                        }
                        $result = $person['name'];
                        if (!empty($person->nachname)) {
                            $adressat .= $result;
                        }

                    }

                    $dieserEmpfaenger = [
                        strlen($adressat) > 30 ? 'die Eigentümer' : (empty($adressat) ? 'die Eigentümer' : $adressat),
                    ];

                    // wenn Gruppe eine Adresse hat
                    if ($gruppe['strasse'] != null) {
                        $dieserEmpfaenger[] = $gruppe->strasse . " " . $gruppe->hausnummer;
                        $dieserEmpfaenger[] = $gruppe->plz . ' ' . $gruppe->stadt;
                        $dieserEmpfaenger[] = 'Sehr geehrte Damen und Herren,';
                    } else {
                        $dieserEmpfaenger[] = $projekt->strasse . " " . $projekt->hausnummer;
                        $dieserEmpfaenger[] = $projekt->plz . ' ' . $projekt->stadt;
                        $dieserEmpfaenger[] = 'Sehr geehrte Damen und Herren,';
                    }

                    $empfaenger[] = $dieserEmpfaenger;
                }

            } else {
                // keine Personen zugeordnet
                $empfaenger[] = [
                    'die Eigentümer',
                    $projekt->strasse . " " . $projekt->hausnummer,
                    $projekt->plz . ' ' . $projekt->stadt,
                    'Sehr geehrte Damen und Herren,'
                ];
            }


            // jede Gruppe zu Empfaenger hinzufügen -> mit Namen aller Personen bei zwei Personen -> als Methode des Models Gruppe implementieren -> Gruppenmitglieder müssen gleiche Adresse haben -> migration

            foreach ($empfaenger as $adressat) {
                $pdf->AddPage();

                $pdf->useTemplate($tpl);
                $pdf->setY(41);
                $pdf->writeHtml(View::make(
                    'projectci::pdf.serienbrief.adresse',
                    [
                        'absender' => '',
                        'empfaenger' => $adressat[0],
                        'strasseHausnummer' => $adressat[1],
                        'plzStadt' => $adressat[2],
                        'datum' => 'Hamburg, im Oktober 2023',
                        'ansprache' => $adressat[3]
                    ]
                )->render());
            }
        }

        Storage::put('kampagnen/serienbrief/' . $kampagne['id'] . ".pdf", $pdf->Output(null, 'S'));

        // Kampagnen den Projekten zuordnen
        $kampagne->akquise()->syncWithoutDetaching($projekte);

        $kampagne->update(
            [
                'reichweite' => $projekte->count(),
                'status' => 1,
            ]
        );

        // return Storage::download('kampagnen/serienbrief/'.$kampagne['id'].".pdf");
    }
}