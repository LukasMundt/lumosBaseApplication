<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConnectContactRequest;
use App\Models\Ci\Akquise;
use App\Models\Person;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class ContactController extends Controller
{
    /**
     * Returns contacts matching the search criteria
     */
    public function index(Request $request)
    {
        // TODO: Policy
        $result = [
            'persons' => Person::search($request->input('search'))->where('owned_by_type', Team::class)->where('owned_by_id', session()->get('team'))->get(),
        ];
        return $result;
    }

    public function connect(ConnectContactRequest $request)
    {
        // TODO: policy
        $contact = $request->validated('contact_type')::find($request->validated('contact_id'));
        $model = $request->validated('this_type')::find($request->validated('this_id'));

        $this->authorize('update', [$model, Team::find(session()->get("team"))]);

        $model->personen()->save($contact);
        $model->personen()->updateExistingPivot($contact, ["type" => $request->validated("type")]);
    }

    public function deconnect(Request $request)
    {
        // TODO: Policy
        $validated = $request->validate([
            "this_type" => ["string", "required"],
            "this_id" => ["string", "required"], // validate if exists for the given model
            "contact_type" => ["string", "required", Rule::in(["App\\Models\\Person"])],
            "contact_id" => ["string", "required"] // validate if exists for the given model
        ]);

        $contact = $validated['contact_type']::find($validated['contact_id']);
        $model = $validated['this_type']::find($validated['this_id']);

        $model->personen()->detach($contact);
    }
}
