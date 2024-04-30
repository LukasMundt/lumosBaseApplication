<?php

namespace App\Print;

use Illuminate\Support\Facades\Storage;
use Lukasmundt\LaravelPrintable\Content;
use Lukasmundt\LaravelPrintable\Printable;

class Invoice extends Printable
{
    public function content(): Content
    {
        $data = Storage::get('logo-512x512.png');
        return new Content(data: ['cols' => ['Pos.', 'Bezeichnung', 'Menge', 'Einheit', 'Preis', 'Gesamt']], view: 'laravel-printable::layouts.a4letter', viewHeader: 'laravel-printable::header.default', viewFooter: 'laravel-printable::footer.default', htmlStringHeader: '<html><div>Hallo<img src="data:image/png;base64,' . base64_encode($data) . '" width="100" style="margin: 100;"/></div></html>');
    }
}