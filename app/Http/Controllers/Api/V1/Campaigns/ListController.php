<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Contracts\SendList;
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
        $this->authorize('viewAny', SendList::class);
        
        return AddressList::where('owned_by_type', Team::class)->where('owned_by_id', session('team'))->get();
    }

    public function store(Request $request)
    {
        $this->authorize('create', SendList::class);

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

    public function update(Request $request, $domain, AddressList $list)
    {
        $this->authorize('update', $list);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'filtersDistricts' => ['nullable', 'array'],
            'ignoreDistricts' => ['boolean'],
            'filtersZipCodes' => ['nullable', 'array'],
            'ignoreZipCodes' => ['boolean'],
            'filtersStreets' => ['nullable', 'array'],
            'ignoreStreets' => ['boolean'],
        ]);
        Log::debug($validated);

        if ($validated['ignoreDistricts']) {
            $validated['filtersDistricts'] = [];
        }
        if ($validated['ignoreZipCodes']) {
            $validated['filtersZipCodes'] = [];
        }
        if ($validated['ignoreStreets']) {
            $validated['filtersStreets'] = [];
        }

        $list->name = $validated['name'];
        $list->filters = Arr::except($validated, ['name']);
        $list->save();

        return ['label' => $validated['name'], 'id' => $list->id];
    }
}
