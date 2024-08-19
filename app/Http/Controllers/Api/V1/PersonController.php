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
    public function index(Request $request)
    {
        $this->authorize("viewAny", Person::class);
        $personen = Person::ownedByTeam(session("team"))->paginate();
        return $personen;
        // return Inertia::render("lukasmundt/projectci::Person/Index", ['personen' => $personen]);
    }

    public function store(StorePersonRequest $request)
    {
        $this->authorize("create", Person::class);
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

    public function show(Request $request, $domain, Person $person)
    {
        $this->authorize("show", $person);
        $person = $person->load(['akquise', 'address']);
        return $person;
    }

    public function update(UpdatePersonRequest $request, $domain, Person $person)
    {
        $this->authorize("update", $person);
        // Person updaten
        $person->update($request->validated());

        // Adresse zuordnen
        if (!empty($request->validated('address'))) {
            $person->address_id = $request->validated('address');
            $person->save();
        }

        // Hinzufügen neuer Telefonnummern
        foreach (explode(";", $request->validated('telefonnummern')) as $newNumber) {
            if ($newNumber == "") {
                continue;
            }
            $person->telefonnummern()->save(Telefonnummer::create(['telefonnummer' => trim($newNumber)]));
        }
        // $person->fresh()->changeOwnerTo(Team::find(session()->get('team')))->save();
        return $person->refresh();
    }
}