<?php

namespace App\Http\Controllers\Api\V1\Ci;

use App\Http\Controllers\Controller;
use App\Http\Requests\Ci\StoreRecordingRequest;
use App\Models\Ci\Recording;
use App\Services\CoordinatesService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class RecordingController extends Controller
{

    public function index(Request $request)
    {
        $this->authorize("viewAny", Recording::class);
        return Recording::ownedByTeam(session("team"))->ownedByUser(Auth::user()->id)->get()->setHidden(['locations']);
    }

    public function getAudio(Request $request, $domain, Recording $recording)
    {
        $this->authorize("view", $recording);
        return Storage::get("/teams//" . session("team") . "/ci/recordings/" . $recording->id . ".mp3");
    }

    public function show(Request $request, $domain, Recording $recording)
    {
        $this->authorize("view", $recording);
        return $recording;
    }

    public function store(StoreRecordingRequest $request)
    {
        $this->authorize("create", Recording::class);
        $locations = $request->validated("locations", []);
        $distance = 0;
        $before = null;
        foreach ($locations as $key => $location) {
            $lat = is_string($location['latitude']) ? floatval($location['latitude']) : $location['latitude'];
            $lon = is_string($location['longitude']) ? floatval($location['longitude']) : $location['longitude'];

            if ($key > 0) {
                $distance += CoordinatesService::getDistanceFromCoordinates($before['lat'], $before['lon'], $lat, $lon);
            }

            $before = ['lat' => $lat, 'lon' => $lon];
            $locations[$key]['latitude'] = $lat;
            $locations[$key]['longitude'] = $lon;
        }
        $recording = Recording::create([
            'locations' => $request->validated("locations"),
            "owned_by_team" => session("team"),
            "owned_by_user" => Auth::user()->id,
            'distance' => $distance
        ]);

        // storing audio file
        $request->file("audio")->storeAs("/teams//" . session("team") . "/ci/recordings", $recording->refresh()->id . "." . $request->file("audio")->getClientOriginalExtension());
    }

    // TODO: update, delete, forceDelete, restore
}
