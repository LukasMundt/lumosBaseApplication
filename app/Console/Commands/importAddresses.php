<?php

namespace App\Console\Commands;

use App\Models\SimpleAddressForAutocomplete;
use Illuminate\Console\Command;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Storage;
use function Laravel\Prompts\spin;
use function Laravel\Prompts\text;

class importAddresses extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'lumos:import-addresses';

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
        $path = text(
            label: 'What is the path to the geojson file on the local storage?',
            default: "./addresses.geojson",
            // hint: 'This will be displayed on your profile.'
            required: true
        );
        $array = json_decode(Storage::get($path), 1);
        $properties = data_get($array, "features.*.properties");

        $streets = [];
        foreach ($properties as $value) {
            if (!in_array(['street_and_number' => $value["strname"]], $streets)) {
                $streets[] = ['street_and_number' => $value["strname"]];
            }
        }


        spin(
            fn() => SimpleAddressForAutocomplete::insertOrIgnore($streets),
            'Importing addresses...'
        );
    }
}
