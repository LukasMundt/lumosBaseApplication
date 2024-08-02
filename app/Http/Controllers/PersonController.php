<?php

namespace App\Http\Controllers;

use App\Contracts\Contact;
use App\Models\Person;
use Inertia\Inertia;

class PersonController extends Controller
{
    public function index()
    {
        $this->authorize("viewAny", Contact::class);
        return Inertia::render('Contacts/Person/Index', [
            'persons' => Person::ownedByTeam(session("team"))
                ->withCount('akquise')
                ->with('address')
                ->get(),
        ]);
    }
}
