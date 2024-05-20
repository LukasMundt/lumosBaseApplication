<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use App\Models\AddressList;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Crypt;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{
    public function store(Request $request)
    {
        // TODO: Policy
        $validated = $request->validate(['name' => ['string', 'max:255', 'required']]);

        $campaign = Campaign::create([
            'date_for_print' => now()->format('d.m.Y') . "",
            'content' => '',
            'content_type' => '',
            'send' => false,
            'name' => $validated['name'],
        ]);
        return ['label' => $validated['name'], 'id' => $campaign->refresh()->id];
    }

    public function update(Request $request, $domain, Campaign $campaign)
    {
        // TODO: Policy

        $validated = $request->validate([
            'name' => ['string', 'max:255', 'required'],
            'content' => ['string', 'required'],
            'date_for_print' => ['string', 'max:255', 'nullable'],
            'list_id' => ['string', 'nullable', Rule::exists('campaigns_lists_address', 'id')]
        ]);

        $campaign->update(
            array_merge(
                [
                    'name' => $validated['name'],
                    'content' => $validated['content'],
                    'date_for_print' => $validated['date_for_print'],
                    'content_type' => 'html',
                ],
            )
        );
        // TODO: Liste mittels Relation verbinden können
    }
}
