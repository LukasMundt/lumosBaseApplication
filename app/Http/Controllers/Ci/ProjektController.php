<?php

namespace Lukasmundt\ProjectCI\Http\Controllers;

use App\Http\Controllers\Controller;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Request;
use Spatie\Navigation\Navigation;

class ProjektController extends Controller
{
    public function index(Request $request): Response
    {
        return Inertia::render(
            'Projekt/Create',
            [
                'navigation' => app(Navigation::class)->tree(),
            ]
        );
    }
}