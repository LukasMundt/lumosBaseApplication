<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class PersonController extends Controller
{
    public function index()
    {
        return Inertia::render('Person/Index');
    }
}
