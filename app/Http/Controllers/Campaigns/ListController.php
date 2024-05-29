<?php

namespace App\Http\Controllers\Campaigns;

use App\Contracts\SendList;
use App\Http\Controllers\Controller;
use App\Models\AddressList;
use App\Models\Team;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ListController extends Controller
{
    public function index()
    {
        $this->authorize('viewAny', SendList::class);
        
        $lists = AddressList::ownedByTeam(session('team'))->get();
        return Inertia::render('Campaigns/List/Index', ['lists' => $lists]);
    }

    public function edit(Request $request, $domain, AddressList $list)
    {
        $this->authorize('update', $list);
        
        return Inertia::render('Campaigns/List/Edit', ['list' => $list]);
    }
}
