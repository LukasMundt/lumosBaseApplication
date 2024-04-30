<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\StorePersonRequest;
use App\Http\Requests\UpdatePersonRequest;
use App\Models\Address;
use App\Models\Person;
use App\Models\Team;
use App\Models\Telefonnummer;
use Inertia\Inertia;
use Illuminate\Http\Request;

class PersonController extends Controller
{

    // public function show(Request $request, Person $person)
    // {
    //     $person = $person->load('gruppe');
    //     $personenAuchInGruppe = [];
    //     foreach ($person->load('gruppe.personen')['gruppe']['personen'] as $value) {
    //         if ($value->id != $person->id) {
    //             $personenAuchInGruppe[] = $value;
    //         }
    //     }
    //     return Inertia::render('Person/Show', [
    //         'person' => $person,
    //         'personenAuchInGruppe' => $personenAuchInGruppe,
    //         'personStr' => $person->nameAsString(),
    //     ]);
    // }

    // public function store(StorePersonRequest $request): Response
    // {
    //     $person = Person::create($request->validated());

    //     return Inertia::render('lukasmundt/projectci::Person/Update', [
    //         'person' => $person,
    //     ]);
    // }

    // public function edit(Request $request, Person $person): Response
    // {
    //     // $person = Person::create($request->validated());

    //     return Inertia::render('lukasmundt/projectci::Person/Update', [
    //         'person' => $person,
    //     ]);
    // }

    public function index(Request $request)
    {
        $personen = Person::whereOwnedBy(Team::find(session('team')))->paginate();
        return $personen;
        // return Inertia::render("lukasmundt/projectci::Person/Index", ['personen' => $personen]);
    }

    // public function create(Request $request)
    // {
    //     return Inertia::render("lukasmundt/projectci::Person/Create");
    // }

    public function store(StorePersonRequest $request)
    {
        // Gruppe erzeugt
        // $gruppe = Gruppe::factory()->create();
        // $gruppe->update($request->validated());
        // $gruppe->save();

        // Person erzeugt
        $person = Person::factory()->create();
        $person->update($request->validated());

        // Gruppe speichern und Person zuordnen
        // $gruppe->personen()->save($person);
        if (!empty($request->validated('address'))) {
            $person->address_id = $request->validated('address');
            $person->save();
        }

        // if ($request->validated('telefonnummern') != null) {
        // Hinzufügen neuer Telefonnummern
        foreach (explode(";", $request->validated('telefonnummern')) as $newNumber) {
            if ($newNumber == "") {
                continue;
            }
            $person->telefonnummern()->save(Telefonnummer::create(['telefonnummer' => trim($newNumber)]));
        }
        $person->fresh()->changeOwnerTo(Team::find(session()->get('team')))->save();
        return $person->refresh();
    }

    public function edit(Request $request, Person $person)
    {
        $telefonnummern = [];
        foreach ($person->telefonnummern as $telefonnummer) {
            $telefonnummern[] = ["label" => $telefonnummer->telefonnummer, "value" => $telefonnummer->telefonnummer];
        }

        return Inertia::render("lukasmundt/projectci::Person/Edit", [
            'personId' => $person->id,
            'person' => $person->load('gruppe'),
            'personStr' => $person->nameAsString(),
            'telefonnummernDefault' => $telefonnummern,
        ]);
    }

    public function update(UpdatePersonRequest $request, Person $person)
    {
        // Ändern der Informationen der Person
        $person->update($request->validated());
        // Ändern der Informationen der Gruppe
        $person->gruppe->update($request->validated());


        if ($request->validated('telefonnummern') != null) {
            // Hinzufügen neuer Telefonnummern
            foreach ($request->validated('telefonnummern') as $newNumber) {
                $telefonnummerAdded = false;
                foreach ($person->telefonnummern as $addedNumber) {
                    if ($addedNumber['telefonnummer'] == $newNumber['value']) {
                        $telefonnummerAdded = true;
                    }
                }
                if (!$telefonnummerAdded) {
                    $person->telefonnummern()->save(Telefonnummer::create(['telefonnummer' => $newNumber['value']]));
                }
            }

            // Entfernen alter Telefonnummern
            foreach ($person->telefonnummern as $telefonnummer) {
                $detachNumber = true;
                foreach ($request->validated('telefonnummern') as $newNumber) {
                    if ($telefonnummer['telefonnummer'] == $newNumber['value']) {
                        $detachNumber = false;
                    }
                }
                if ($detachNumber) {
                    Telefonnummer::where('id', $telefonnummer['id'])->first()->delete();
                }
            }
        }


        return redirect(route('projectci.person.show', ['person' => $person->id]));
    }
}