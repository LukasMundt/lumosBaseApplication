<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Lumos Defaults
    |--------------------------------------------------------------------------
    */

    'registration' => [
        'allowed' => false,
        'message' => "Die Registrierung ist nicht erlaubt.",
    ],
    'nominatim' => [
        'uri' => env("LUMOS_NOMINATIM_SERVER", "https://nominatim.openstreetmap.org")
    ]

];
