<?php
namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CoordinatesService
{
    public static function getNominatimShortResponse($strasseUndNummer, $city = "", $country = "de", $zip_code = "", array $listOfAddressTypes = []): array
    {
        $results = [];

        // hier wird die Anfrage an OSM gestellt
        $response = Http::get(config("lumos.nominatim.uri") . '/search.php', [
            'addressdetails' => '1',
            'street' => $strasseUndNummer,
            'country' => $country,
            'format' => 'jsonv2',
            'category' => 'building,place',
            'limit' => 40,
        ]);

        if ($response->successful()) {
            foreach ($response->json() as $item) {
                if (empty($listOfAddressTypes) || !isset($item['addresstype']) || collect($listOfAddressTypes)->contains($item['addresstype'])) {
                    $item['composed'] = self::composeDetails($item);

                    $results[] = $item;
                }
            }
        } else {
            Log::error($response);
            return [];
        }


        return $results;
    }

    private static function composeDetails($item): array
    {
        $composed = [
            'housenumber' => '',
            'street' => '',
            'zip_code' => '',
            'city' => '',
            'district' => '',
            'lat' => 0,
            'lon' => 0,
        ];
        $composed['street'] = isset($item['address']['road']) ? $item['address']['road'] : "";
        $composed['housenumber'] = isset($item['address']['house_number']) ? $item['address']['house_number'] : "";
        $composed['zip_code'] = isset($item['address']['postcode']) ? $item['address']['postcode'] : "";
        $composed['city'] = isset($item['address']['city']) ? $item['address']['city'] : (isset($item['address']['town']) ? $item['address']['town'] : (isset($item['address']['village']) ? $item['address']['village'] : ""));
        $composed['district'] = isset($item['address']['neighbourhood']) ? $item['address']['neighbourhood'] : (isset($item['address']['suburb']) ? $item['address']['suburb'] : "");
        $composed['lat'] = isset($item['lat']) ? $item['lat'] : 0;
        $composed['lon'] = isset($item['lon']) ? $item['lon'] : 0;

        Log::debug($composed);
        return $composed;
    }

    public static function detailsByCoordinates($lat, $lon): array
    {
        // hier wird das Array initialiesiert, und alle Werte leer gesetzt. Einige werden später ggf. geändert
        // $result = [
        //     'housenumber' => '',
        //     'street' => '',
        //     'zip_code' => '',
        //     'city' => '',
        //     'district' => '',
        //     'lat' => 0,
        //     'lon' => 0,
        // ];

        $secondResponse = Http::get(config("lumos.nominatim.uri") . '/reverse.php', [
            'addressdetails' => '1',
            // 'osmtype' => $response->json()[0]['osm_type'],
            // 'osmid' => $response->json()[0]['osm_id'],
            'lat' => $lat,
            'lon' => $lon,
            'hierarchy' => 0,
            'group_hierarchy' => 1,
            'format' => 'jsonv2',
        ]);
        if (!$secondResponse->successful()) {
            Log::error($secondResponse);
            return [];
        }
        $result = self::composeDetails($secondResponse->json());
        // $result['street'] = isset($secondResponse->json()['address']['road']) ? $secondResponse->json()['address']['road'] : "";
        // $result['housenumber'] = isset($secondResponse->json()['address']['house_number']) ? $secondResponse->json()['address']['house_number'] : "";
        // $result['zip_code'] = isset($secondResponse->json()['address']['postcode']) ? $secondResponse->json()['address']['postcode'] : "";
        // $result['city'] = isset($secondResponse->json()['address']['city']) ? $secondResponse->json()['address']['city'] : "";
        // $result['district'] = isset($secondResponse->json()['address']['suburb']) ? $secondResponse->json()['address']['suburb'] : "";
        // $result['lon'] = $lon;
        // $result['lat'] = $lat;

        // Log::debug($secondResponse->json());

        return self::composeDetails($secondResponse->json());
    }

    /**
     * This function calculates the distance between two coordinates in kilometers.
     * @param float $lat1 Latitude of the first coordinate
     * @param float $lon1 Longitude of the first coordinate
     * @param float $lat2 Latitude of the second coordinate
     * @param float $lon2 Longitude of the second coordinate
     * @return float distance in kilometers
     */
    public static function getDistanceFromCoordinates(float $lat1, float $lon1, float $lat2, float $lon2): float
    {
        $R = 6371; // Radius of the earth in km
        $dLat = self::deg2rad($lat2 - $lat1); // deg2rad below
        $dLon = self::deg2rad($lon2 - $lon1);
        $a =
            sin($dLat / 2) * sin($dLat / 2) +
            cos(self::deg2rad($lat1)) *
            cos(self::deg2rad($lat2)) *
            sin($dLon / 2) *
            sin($dLon / 2);
        $c = 2 * atan2(sqrt($a), sqrt(1 - $a));
        $d = $R * $c; // Distance in km
        return $d;
    }

    private static function deg2rad($deg)
    {
        return $deg * (pi() / 180);
    }
}