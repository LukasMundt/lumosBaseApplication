<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\ConnectContactRequest;
use App\Models\Person;
use App\Models\Team;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function connect(ConnectContactRequest $request)
    {
        $contact = $request->validated('contact_type')::find($request->validated('contact_id'));
        $model = $request->validated('this_type')::find($request->validated('this_id'));

        $this->authorize('update', [$model, Team::find(session()->get("team"))]);

        $model->personen()->save($contact);
        $model->personen()->updateExistingPivot($contact, ["type" => $request->validated("type")]);
    }

    /**
     * Returns contacts matching the search criteria
     */
    public function index(Request $request)
    {
        $result = [
            'persons' => Person::search($request->input('search'))->where('owned_by_type', Team::class)->where('owned_by_id', session()->get('team'))->get(),
        ];
        return $result;
    }
}
