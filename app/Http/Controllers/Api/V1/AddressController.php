<?php
namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\AddressFindOrCreateRequest;
use App\Models\Address;
use App\Models\SimpleAddressForAutocomplete;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AddressController extends Controller
{
    public function findOrCreate(AddressFindOrCreateRequest $request)
    {
        $team = Team::find(session()->get('team'));

        $address = Address::where('street', $request->validated('street'))
            ->where('lat', $request->validated('lat'))
            ->where('lon', $request->validated('lon'))
            ->whereOwnedBy($team)
            ->first();

        if (empty($address)) {
            // create new address
            $address = new Address($request->validated());
            $address->save();
            $address->changeOwnerTo($team)->save();
            return $address->refresh();
        } else {
            return $address;
        }
    }

    public function autocomplete(Request $request)
    {
        return SimpleAddressForAutocomplete::search($request->input("search"))->get()->take(20);
    }
}