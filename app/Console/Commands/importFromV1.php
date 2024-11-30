<?php

namespace App\Console\Commands;

use App\Models\Address;
use App\Models\Ci\Akquise;
use App\Models\Ci\Projekt;
use App\Models\Person;
use App\Models\Team;
use App\Models\Telefonnummer;
use App\Services\CoordinatesService;
use Carbon\Carbon;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use function Laravel\Prompts\text;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\info;

class importFromV1 extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:import-from-v1 {team} {path? : Pfad zu Import-Datei}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Command description';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $path = $this->argument('path');
        $unprocessed = [];
        if ($path == "") {
            $path = text(
                "Pfad zu der Datei, die importiert werden soll",
                "./file.json",
                required: true,
                hint: "Es muss eine .json Datei mit dem richtigen Format sein."
            );
        }

        $owner = Team::find($this->argument('team'));

        $raw = json_decode(Storage::get($path), 1);

        // adressen
        $resultAddresses = spin(
            fn() => $this->handleAdressen($this->getDataFromTable($raw, "adressen"), $owner),
            "Importing addresses"
        );
        info('Importing addresses was successfull.');
        $unprocessed["addresses"] = $resultAddresses['unprocessed'];

        // eigentuemer
        $resultEigentuemer = spin(
            fn() => $this->handleEigentuemer($this->getDataFromTable($raw, "eigentuemer"), $owner),
            "Importing owners"
        );
        info("Importing owners was successfull.");
        $unprocessed['eigentuemer'] = $resultEigentuemer['unprocessed'];

        // adressen - eigentuemer
        $resultAddressesEigentuemer = spin(
            fn() => $this->handleAdressenEigentuemer($this->getDataFromTable($raw, "adresseneigentuemer"), $owner, $resultEigentuemer['oldToNew'], $resultAddresses['oldToNew']),
            "Importing address owners"
        );
        info("Importing of the connections between addresses and owners was successfull.");
        $unprocessed['adressenEigentuemer'] = $resultAddressesEigentuemer['unprocessed'];

        $newPath = Str::replaceLast(".", "_unprocessed_" . Carbon::now()->format("Ymd_his") . ".", $path);
        Storage::put($newPath, json_encode($unprocessed));
    }

    private function handleAdressenEigentuemer(array $array, $owner, $oldToNewEigentuemer, $oldToNewAdressen): array
    {
        $unprocessed = [];
        $oldToNewEigentuemer = Arr::keyBy($oldToNewEigentuemer, "old");
        $oldToNewAdressen = Arr::keyBy($oldToNewAdressen, "old");
        foreach ($array as $item) {
            if (
                !($item['FlagVerknuepfung'] == "sichtbar" || $item['FlagVerknuepfung'] == "") ||
                !array_key_exists($item['IDAdressen'], $oldToNewAdressen) ||
                !array_key_exists($item['IDEigentuemer'], $oldToNewEigentuemer)
            ) {
                $unprocessed[] = [$item, "addressExists" => array_key_exists($item['IDAdressen'], $oldToNewAdressen), "eigentuemerExists" => array_key_exists($item['IDEigentuemer'], $oldToNewEigentuemer)];
                continue;
            }

            $connection = $item['Beziehung'];
            if ($item['Nachbar'] == "WAHR") {
                $connection = "Nachbar";
            }
            if ($item['Eigentümer'] == "WAHR") {
                $connection = "Eigentümer";
            }
            $akquise = Projekt::find($oldToNewAdressen[$item['IDAdressen']])->first()->akquise;
            $eigentuemer = Person::find($oldToNewEigentuemer[$item['IDEigentuemer']])->first();
            $akquise->personen()->save($eigentuemer);
            $akquise->personen()->updateExistingPivot($eigentuemer, ['type' => $connection]);

        }
        return ['unprocessed' => $unprocessed];
    }

    /**
     * @return ['unprocessed' => array, 'oldToNew' => [['old' => id, 'new' => newId]]]
     */
    private function handleEigentuemer($array, $owner): array
    {
        $unprocessed = [];
        $oldToNew = [];
        foreach ($array as $item) {
            if (!($item['Flag'] == "sichtbar" || $item['Flag'] == "")) {
                $unprocessed[] = $item;
                continue;
            }
            $person = new Person([
                "anrede" => $item['Anrede'],
                'prename' => $item['Vorname'],
                "lastname" => $item['Nachname'],
                "email" => $item['Mail']
            ]);
            $person->changeOwnerTo($owner)->save();
            // Hinzufügen neuer Telefonnummern
            foreach (explode(",", $item['Telefon']) as $newNumber) {
                if ($newNumber == "") {
                    continue;
                }
                $person->telefonnummern()->save(Telefonnummer::create(['telefonnummer' => trim($newNumber)]));
            }
            $newId = $person->id;
            $oldToNew[] = ['old' => $item['IDEigentuemer'], 'new' => $newId];
        }
        return ['unprocessed' => $unprocessed, 'oldToNew' => $oldToNew];
    }

    private function handleAdressen($array, $owner): array
    {
        $notProcessable = [];
        $oldToNew = [];

        foreach ($array as $item) {
            if ($item['lat'] == "0" || $item['lon'] == "0") {
                $result = CoordinatesService::getNominatimShortResponse(
                    $item['Straße'] . " " . $item['Hausnummer'],
                    zip_code: $item['Postleitzahl']
                );
                if (count($result) == 1) {
                    $item['lat'] = $result[0]['lat'];
                    $item['lon'] = $result[0]['lon'];
                } else {
                    $notProcessable[] = $item;
                    continue;
                }
            }
            if ($item['Flag'] != "sichtbar") {
                $notProcessable[] = $item;
                continue;
            }

            $address = Address::where('street', $item['Straße'])
                ->where('housenumber', $item['Hausnummer'])
                ->where('zip_code', $item['Postleitzahl'])
                ->first();
            if ($address == null) {
                $address = new Address([
                    'street' => $item['Straße'],
                    'housenumber' => $item['Hausnummer'],
                    'housenumber_number' => intval($item['Nummer']),
                    'zip_code' => $item['Postleitzahl'],
                    'city' => $item['Stadt'],
                    'district' => $item['Stadtteil'],
                    'lat' => floatval($item['lat']),
                    'lon' => floatval($item['lon'])
                ]);
                $address->changeOwnerTo($owner)->save();
            }

            $projekt = Projekt::create([]);

            $akquise = new Akquise([
                "teilung" => $item["Teilung"] == "WAHR",
                "abriss" => $item["Abriss"] == "WAHR",
                "nicht_gewuenscht" => $item["NichtGewuenscht"] == "WAHR" || $item["Status"] == "Nicht gewünscht",
                "retour" => $item["Retour"] == "WAHR",
                "status" => $item["Status"]
            ]);
            $akquise->projekt()->associate($projekt);
            $akquise->save();
            $akquise->fresh()->changeOwnerTo($owner);

            $akquise->save();
            $oldToNew[] = ['old' => $item['ID'], 'new' => $akquise->refresh()->id];
            $projekt->changeOwnerTo($owner);

            $address->changeOwnerTo($owner);
            $address->save();
            $projekt->address()->associate($address);
            $projekt->save();
        }
        return ["unprocessed" => $notProcessable, "oldToNew" => $oldToNew];
    }

    private function getDataFromTable($array, $key)
    {
        $result = [];
        foreach ($array as $sub) {
            if (isset($sub['type']) && $sub['type'] == "table" && isset($sub['name']) && $sub['name'] == $key) {
                $result = $sub['data'];
                break;
            }
        }
        return $result;
    }
}
