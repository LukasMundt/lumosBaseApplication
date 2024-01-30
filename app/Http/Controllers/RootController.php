<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class RootController extends Controller
{
    // public function root(Request $request)
    // {
    //     return redirect(route('domain.dashboard', ['domain' => 'personal']));
    // }

    public function domainDashboard(Request $request, String $domain)
    {
        return Inertia::render('Dashboard');
    }
}
