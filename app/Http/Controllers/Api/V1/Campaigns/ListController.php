<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use App\Models\AddressList;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Log;

class ListController extends Controller
{
    public function index()
    {
        // TODO: Policy
        return AddressList::where('owned_by_type', Team::class)->where('owned_by_id', session('team'))->get();
    }

    public function store(Request $request)
    {
        // TODO: Policy
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'filtersDistricts' => ['nullable', 'array'],
            'ignoreDistricts' => ['boolean'],
            'filtersZipCodes' => ['nullable', 'array'],
            'ignoreZipCodes' => ['boolean'],
            'filtersStreets' => ['nullable', 'array'],
            'ignoreStreets' => ['boolean'],
        ]);

        if ($validated['ignoreDistricts']) {
            $validated['filtersDistricts'] = [];
        }
        if ($validated['ignoreZipCodes']) {
            $validated['filtersZipCodes'] = [];
        }
        if ($validated['ignoreStreets']) {
            $validated['filtersStreets'] = [];
        }

        $addresslist = AddressList::create(['name' => $validated['name'], 'filters' => Arr::except($validated, ['name'])]);
        $addresslist->changeOwnerTo(Team::find(session('team')))->save();

        return ['label' => $validated['name'], 'id' => $addresslist->fresh()->id];
    }
}
