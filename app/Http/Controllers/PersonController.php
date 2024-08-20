<?php

namespace App\Http\Controllers;

use App\Contracts\Contact;
use App\Models\Person;
use App\Models\ProjectManagement\Phase;
use App\Models\ProjectManagement\Project;
use Inertia\Inertia;

class PersonController extends Controller
{
    public function index()
    {
        $this->authorize("viewAny", Person::class);

        return Inertia::render('Contacts/Person/Index', [
            'persons' => Person::ownedByTeam(session("team"))
                ->withCount('akquise')
                ->with('address')
                ->get(),
        ]);
    }
}
