<?php

namespace App\Http\Controllers\Api\V1\Ci;

use App\Http\Controllers\Controller;
use App\Models\Ci\Projekt;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
use Illuminate\Validation\Rule;

class AkquiseController extends Controller
{
    public function addressAttributes(Request $request)
    {
        $validated = $request->validate([
            'attributes.*' => [Rule::in(['street', 'district', 'zip_code'])],
        ]);
        // $attributes = ['zip_code', 'street', 'district'];

        $projekte = Projekt::where('owned_by_id', session()->get('team'))->where('owned_by_type', Team::class)->has('akquise')->with(['address'])->get()->toArray();
        $addressData = [];
        foreach ($projekte as $projekt) {
            foreach ($projekt['address'] as $label => $attribute) {
                if (in_array($label, $validated['attributes']) && (!isset($addressData[$label]) || !in_array($attribute, $addressData[$label]))) {
                    $addressData[$label][] = $attribute;
                }
            }
        }
        $addressData = Arr::sortRecursive($addressData);

        // $addresses = Arr::map($projekte, function($item){
        //     return [$item['address']];
        // });
        return $addressData;
    }
}
