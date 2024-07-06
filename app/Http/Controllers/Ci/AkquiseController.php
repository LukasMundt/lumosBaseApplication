<?php

namespace App\Http\Controllers\Ci;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ci\StoreAkquiseRequest;
use App\Http\Requests\Ci\UpdateAkquiseRequest;
use App\Http\Requests\ListAddressesRequest;
use App\Models\Address;
use App\Models\Ci\Akquise;
use App\Models\Ci\Projekt;
use App\Models\Team;
use App\Services\CoordinatesService;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\URL;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;

class AkquiseController extends Controller
{
    // public function __construct()
    // {
    //     $this->authorizeResource(Akquise::class, 'akquise');
    // }

    public function index(Request $request)
    {
        $this->authorize('viewAny', Akquise::class);

        $team = session()->get('team');
        // $addresses = Address::search($request->input("search", ""))->where("owned_by_type", Team::class)->where("owned_by_id", $team)->get()->toArray();
        // $addresses = data_get($addresses, "*.id");

        return Inertia::render('Ci/Akquise/Index', [
            // 'strasse' => $this->getClause()->select(DB::raw('count(strasse) as strasse_count,strasse'))
            //     ->groupBy('strasse')
            //     ->get(),
            // 'plz' => $this->getClause()->select(DB::raw('count(plz) as count,plz'))->groupBy('plz')->get(),
            // 'projekte' => $this->getClause($request->search)->select('projectci_projekt.*', 'akquise_akquise.*')->paginate(15, null, 'page', $page),
            // 'projekte' => $projekteEmpty ? [] : $projekte->toQuery()->paginate(),
            // 'projekte' => [],
            // 'projekte' => Projekt::with("address")->whereIn('address_id', $addresses)->paginate(15),
            'projects' => Projekt::ownedByTeam($team)->with(["address", 'akquise'])->get()->setHidden(['deleted_at', 'created_by', 'updated_by', 'owned_by_id', 'owned_by_type', 'address_id']),
            // 'search' => $request->input("search", ""),
            // 'filter' => $filterVals,
            // 'filterCols' => [
            //     'Stadtteil' => $projekteEmpty ? [] : Projekt::all()->toQuery()->select(DB::raw('count(stadtteil) as count,stadtteil as value'))->groupBy('stadtteil')->get(),
            //     'PLZ' => $projekteEmpty ? [] : Projekt::all()->toQuery()->select(DB::raw('count(plz) as count,plz as value'))->groupBy('plz')->get(),
            //     'Strasse' => $projekteEmpty ? [] : Projekt::all()->toQuery()->select(DB::raw('count(strasse) as count,strasse as value'))->groupBy('strasse')->get(),
            //     // 'Retoure' => $projekte->toQuery()->select(DB::raw('count(akquise.retour) as count,akquise.retour'))->groupBy('akquise.retour')->get(),
            // ],
        ]);
    }

    public function map(Request $request)
    {
        $this->authorize('viewAny', Akquise::class);
        $defaultCenter = [
            'latitude' => 53.55522722948935,
            'longitude' => 9.995317259820599,
        ];

        // $projekte = $this->getClause($request->search)->select('projectci_projekt.coordinates_lat', 'projectci_projekt.coordinates_lon', 'projectci_projekt.strasse', 'projectci_projekt.hausnummer', 'akquise_akquise.id', 'akquise_akquise.retour', 'akquise_akquise.nicht_gewuenscht')->get();
        $addresses = Address::search($request->input("search", ""))->where("owned_by_type", Team::class)->where("owned_by_id", session()->get('team'))->get()->toArray();
        $addresses = data_get($addresses, "*.id");

        $projekte = Projekt::ownedByTeam(session('team'))->with("address")->where("owned_by_type", Team::class)->where("owned_by_id", session()->get('team'))->whereIn('address_id', $addresses)->get()->load(['address', 'akquise']);

        $normalMarkers = [];
        $retourMarkers = [];
        $nichtGewuenschtMarkers = [];

        $lat = 0;
        $lon = 0;
        $count = 0;

        foreach ($projekte as $projekt) {
            if ($projekt->akquise->retour ?? false) {
                $retourMarkers[] = [
                    'lat' => $projekt->address->lat,
                    'lon' => $projekt->address->lon,
                    'label' => $projekt->address->street . ' ' . $projekt->address->housenumber,
                    'url' => route('akquise.akquise.show', ['projekt' => $projekt->id, 'domain' => session()->get('team')])
                ];
            } else if ($projekt->akquise->nicht_gewuenscht ?? false) {
                $nichtGewuenschtMarkers[] = [
                    'lat' => $projekt->address->lat,
                    'lon' => $projekt->address->lon,
                    'label' => $projekt->address->street . ' ' . $projekt->address->housenumber,
                    'url' => route('akquise.akquise.show', ['projekt' => $projekt->id, 'domain' => session()->get('team')])
                ];
            } else if (isset($projekt->address->lat) && isset($projekt->address->lon)) {
                $normalMarkers[] = [
                    'lat' => $projekt->address->lat,
                    'lon' => $projekt->address->lon,
                    'label' => $projekt->address->street . ' ' . $projekt->address->housenumber,
                    'url' => route('akquise.akquise.show', ['projekt' => $projekt->id, 'domain' => session()->get('team')])
                ];
            }
            $lat += $projekt->address->lat;
            $lon += $projekt->address->lon;
            $count++;
        }
        $markers = [
            'layers' => [
                [
                    'name' => 'Projekte',
                    'markers' => $normalMarkers,
                ],
                [
                    'name' => 'retour-Projekte',
                    'markers' => $retourMarkers,
                    'markerColor' => 'yellow',
                ],
                [
                    'name' => 'nicht gewünscht-Projekte',
                    'markers' => $nichtGewuenschtMarkers,
                    'markerColor' => 'red',
                ],
            ]
        ];
        return Inertia::render('Ci/Akquise/IndexMap', [
            // 'projekte' => $projekte,
            'markers' => $markers,
            'centerAdr' => $count == 0 ? $defaultCenter : ['latitude' => $lat / $count, 'longitude' => $lon / $count]
        ]);
    }

    // private function getClause($search = "")
    // {
    //     return DB::table('projectci_projekt')
    //         // Suche
    //         ->where('projectci_projekt.strasse', 'LIKE', '%' . $search . '%')
    //         ->orWhere('projectci_projekt.hausnummer', 'LIKE', '%' . $search . '%')
    //         ->orWhere('projectci_projekt.plz', 'LIKE', '%' . $search . '%')
    //         ->orWhere('projectci_projekt.stadt', 'LIKE', '%' . $search . '%')
    //         ->orWhere('akquise_akquise.status', 'LIKE', '%' . $search . '%')
    //         // other

    //         ->join('akquise_akquise', 'projectci_projekt.id', '=', 'akquise_akquise.id', 'inner');
    //     //->join('projectci_gruppeverknuepfung', 'akquise_akquise.id', '=', 'projectci_gruppeverknuepfung.gruppeverknuepfung_id')
    //     // ->orderBy('projectci_projekt.strasse')
    //     // ->orderBy('projectci_projekt.hausnummer_nummer');
    // }

    public function create(Request $request): Response
    {
        $this->authorize('create', Akquise::class);

        return Inertia::render('Ci/Akquise/CreateComplete');
    }

    public function listCreatables(ListAddressesRequest $request)
    {
        // $this->authorize('create', Akquise::class);
        $validated = $request->validated();

        $results = CoordinatesService::getNominatimShortResponse($validated['street_and_number'], listOfAddressTypes: isset($validated['address_types']) && $validated['address_types'] != null ? Str::of($validated['address_types'])->explode(",")->toArray() : []);

        return $results;
    }

    public function detailsByCoordinates(Request $request)
    {
        $validated = $request->validate(['lat' => 'required', 'lon' => 'required']);
        return CoordinatesService::detailsByCoordinates($validated['lat'], $validated['lon']);
    }

    public function store(StoreAkquiseRequest $request, string $key = null)
    {
        $this->authorize('create', Akquise::class);

        if (!empty($key)) {
            Cache::forget($key);
        }



        $team = Team::find(session('team'));

        $projekt = Projekt::create(['created_by' => Auth::user()->id, 'updated_by' => Auth::user()->id]);
        // $projekt->save();
        // dd($request->safe()->only(['teilung', 'abriss', 'retour', 'status', 'nicht_gewuenscht']));
        $akquise = new Akquise($request->safe()->only(['teilung', 'abriss', 'retour', 'status', 'nicht_gewuenscht']));
        $akquise->projekt()->associate($projekt);
        $akquise->changeOwnerTo($team);
        $akquise->save();
        $projekt->changeOwnerTo($team);
        $address = Address::firstOrNew(
            array_merge($request->safe()->only(['street', 'housenumber', 'housenumber_number', 'district', 'zip_code', 'city', 'lat', 'lon']), ['owned_by_type' => Team::class, 'owned_by_id' => session('team')])
        );
        $address->changeOwnerTo($team);
        $address->save();
        $projekt->address()->associate($address);
        $projekt->save();

        // return response($projekt->id, 201);
    }

    public function show(string $domain, Akquise $projekt): Response
    {
        $akquise = $projekt;
        $this->authorize('view', $akquise);
        $projekt = $projekt->projekt;

        return Inertia::render('Ci/Akquise/Show', [
            'projekt' => $projekt->load(['akquise', 'akquise.notizen', "akquise.personen.telefonnummern", 'address', 'akquise.campaigns']),
            'creationUrlNotes' => URL::signedRoute('api.v1.notes.save', ['class' => hash('sha256', get_class($akquise)), 'model_id' => $akquise->id], null, true),
            'this_type' => $akquise::class,
            // 'notiz' => $notiz,
        ]);
    }

    public function edit(Request $request, Projekt $projekt): Response
    {
        $this->authorize('update', $projekt);

        return Inertia::render('lukasmundt/akquise::Akquise/Edit', [
            'projekt' => $projekt->load(['akquise']),
        ]);
    }

    public function update(UpdateAkquiseRequest $request, $domain, Akquise $project)
    {
        $akquise = $project;
        $this->authorize('update', [$akquise, Team::find(session()->get('team'))]);

        $data = Arr::whereNotNull($request->validated());
        $akquise->update($data);

        // return redirect(route('akquise.akquise.show', ['projekt' => $akquise]));
    }
}