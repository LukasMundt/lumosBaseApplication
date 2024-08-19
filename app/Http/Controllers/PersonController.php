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
        $this->authorize("viewAny", Contact::class);

        $project = Project::create(['title' => fake()->text(), "description" => fake()->text(), "icon" => "123",]);
        $project->phases()->saveMany([new Phase(['title' => fake()->text(), "icon" => "123"])]);

        return Inertia::render('Contacts/Person/Index', [
            'persons' => Person::ownedByTeam(session("team"))
                ->withCount('akquise')
                ->with('address')
                ->get(),
        ]);
    }
}
