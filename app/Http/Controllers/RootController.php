<?php

namespace App\Http\Controllers;

use App\Print\Invoice;
use App\Services\SimpleModelService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Lukasmundt\LaravelPrintable\Facades\Printable;
use Lukasmundt\LaravelPrintable\LaravelPrintableFacade;

class RootController extends Controller
{
    // public function root(Request $request)
    // {
    //     return redirect(route('domain.dashboard', ['domain' => 'personal']));
    // }

    public function domainDashboard(Request $request, string $domain)
    {
        // Log::debug(Printable::blob(new Invoice())."");
        // $printable->
        // Mail
        return Inertia::render('Dashboard');
    }
}
