<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use App\Jobs\PrintCampaign;
use App\Models\AddressList;
use App\Models\Campaign;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
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
        // TODO: update only can made when campaign is a draft and not already send
        // TODO: salutation and line1

        $validated = $request->validate([
            'name' => ['string', 'max:255', 'required'],
            'content' => ['string', 'required'],
            'date_for_print' => ['string', 'max:255', 'nullable'],
            'list_id' => ['string', 'nullable', Rule::exists('campaigns_lists_address', 'id')],
            'line1_no_owner' => ['string', 'nullable'],
            'salutation_no_owner' => ['string', 'nullable']
        ]);

        $campaign->update(
            [
                'name' => $validated['name'],
                'content' => $validated['content'],
                'date_for_print' => $validated['date_for_print'],
                'content_type' => 'html',
                'line1_no_owner' => $validated['line1_no_owner'],
                'salutation_no_owner' => $validated['salutation_no_owner']
            ]
        );

        if ($validated['list_id']) {
            AddressList::find($validated['list_id'])->campaign()->save($campaign);
        }
    }

    public function send($domain, Campaign $campaign)
    {
        // TODO: policy and only executable if not already send
        // validate
        $validator = validator($campaign->toArray(), [
            'content' => ["string", 'required'],
            'list_id' => ['required'],
        ]);

        if ($validator->fails()) {
            abort(response(['errors' => $validator->errors()], 400));
        } else {
            PrintCampaign::dispatch($campaign);
        }


        // In queuealble task:
        $campaign->send = true;
        $campaign->save();
    }

    // TODO: Kampagne duplizieren können
}
