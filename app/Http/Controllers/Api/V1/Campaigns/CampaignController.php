<?php

namespace App\Http\Controllers\Api\V1\Campaigns;

use App\Http\Controllers\Controller;
use App\Jobs\PrintCampaign;
use App\Models\AddressList;
use App\Models\Campaign;
use App\Models\Team;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class CampaignController extends Controller
{
    public function store(Request $request)
    {
        $this->authorize('create', Campaign::class);
        $validated = $request->validate(['name' => ['string', 'max:255', 'required']]);

        $campaign = Campaign::create([
            'date_for_print' => now()->format('d.m.Y') . "",
            'content' => '',
            'content_type' => '',
            'name' => $validated['name'],
        ]);
        // $campaign->withDefaultOwner()->save();
        $campaign->changeOwnerTo(Team::find(session('team')))->save();
        return ['label' => $validated['name'], 'id' => $campaign->id];
    }

    public function update(Request $request, $domain, Campaign $campaign)
    {
        $this->authorize('update', $campaign);
        // update only can made when campaign is a draft and not already send
        if ($campaign->sent_at != null) {
            abort(422, "Kampagne ist bereits abgesendet, daher können keine Änderungen mehr vorgenommen werden.");
        }

        $validated = $request->validate([
            'name' => ['string', 'max:255', 'required'],
            'content' => ['string', 'nullable'],
            'date_for_print' => ['string', 'max:255', 'nullable'],
            'list_id' => ['string', 'nullable', Rule::exists('campaigns_lists_address', 'id')],
            'line1_no_owner' => ['string', 'nullable'],
            'salutation_no_owner' => ['string', 'nullable']
        ]);

        $campaign->update(
            [
                'name' => $validated['name'],
                'content' => $validated['content']??"",
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
        $this->authorize('send', $campaign);
        // only executable if not already send
        if ($campaign->sent_at != null) {
            abort(422, "Kampagne ist bereits abgesendet.");
        }
        // validate
        $validator = validator($campaign->toArray(), [
            'name' => ['string', 'max:255', 'required'],
            'content' => ['string', 'required'],
            'date_for_print' => ['string', 'max:255', 'required'],
            'list_id' => ['string', 'required', Rule::exists('campaigns_lists_address', 'id')],
            'line1_no_owner' => ['string', 'nullable'],
            'salutation_no_owner' => ['string', 'nullable']
        ]);

        if ($validator->fails()) {
            abort(response(['errors' => $validator->errors()], 400));
        } else {
            PrintCampaign::dispatch($campaign);
        }


        // In queuealble task:
        $campaign->sent_at = Carbon::now();
        $campaign->save();
    }

    public function replicate($domain, Campaign $campaign)
    {
        // Nutzer muss das Recht haben, die zu duplizierende Kampagne einzusehen um sie duplizieren zu können
        $this->authorize('view', $campaign);
        $this->authorize('create', Campaign::class);

        $newCampaign = $campaign->replicate();
        $newCampaign->save();
        $newCampaign->update(['name' => $campaign->name . "_kopie", 'content' => $campaign->content]);

        return $newCampaign->refresh()->only(['id', 'name']);
    }

    // TODO: Kampagne löschen können
}
