<?php

namespace Tests\Feature\Campaigns;

use App\Models\Campaign;
use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\Log;
use SebastianBergmann\Type\VoidType;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class CampaignTest extends TestCase
{
    use RefreshDatabase;

    private $user;
    private $team;

    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
        $this->team = Team::factory()->create();

        $perm = Permission::findOrCreate("tp-lumos-campaigns-basic", "web");

        // add permission to team
        $this->team->permissions()->sync($perm, true);
        $this->actingAs($this->user);

        setPermissionsTeamId($this->team->id);
    }

    private function create_campaign()
    {
        $campaignName = fake()->slug(3);

        $response = $this
            ->actingAs($this->user)
            ->post(route('api.v1.campaigns.campaigns.store', ['domain' => $this->team->id]), [
                'name' => $campaignName
            ]);

        return ['campaignName' => $campaignName, 'response' => $response];
    }

    /**
     * Tests the creation of a campaign.
     */
    public function test_create_campaign(): void
    {
        $perm = Permission::findOrCreate("lumos-campaigns-create-campaign", "web");
        $this->user->givePermissionTo($perm);
        ['campaignName' => $campaignName, 'response' => $response] = $this->create_campaign();
        $response->assertStatus(200);
        $this->assertTrue(Campaign::ownedByTeam($this->team->id)->where('name', $campaignName)->get()->count() == 1);
    }

    /**
     * Tests that the creation of a campaign is not possible without the necessary permissions.
     */
    public function test_create_without_permissions_impossible(): void
    {
        ['campaignName' => $campaignName, 'response' => $response] = $this->create_campaign();
        $response->assertStatus(403);
    }

    /**
     * Tests that the a campaign can be updated if the user has the permission to do that.
     */
    public function test_update_campaign(): void
    {
        $perm1 = Permission::findOrCreate("lumos-campaigns-edit-own-campaigns", "web");
        $perm2 = Permission::findOrCreate("lumos-campaigns-create-campaign", "web");
        $this->user->givePermissionTo([$perm1, $perm2]);

        ['campaignName' => $campaignName, 'response' => $response] = $this->create_campaign();
        $response->assertStatus(200);
        $campaign = Campaign::ownedByTeam($this->team->id)->where('name', $campaignName)->first();

        $newValues = [
            'name' => fake()->slug(),
            'content' => fake()->realTextBetween(200, 400),
            'date_for_print' => fake()->text(),
            'line1_no_owner' => fake()->text(),
            'salutation_no_owner' => fake()->text()
        ];

        foreach ($newValues as $key => $value) {
            $this->test_update_single_attribute($key, $value, $campaign);
        }
    }

    private function test_update_single_attribute(string $key, string $value, Campaign $campaign): void
    {
        $response = $this->post(route("api.v1.campaigns.campaigns.update", ['domain' => $this->team->id, "campaign" => $campaign->id]), [
            $key => $value,
        ]);
        $response->assertStatus(200);

        $campaign = $campaign->fresh();
        $this->assertEquals($value, $campaign[$key]);
    }

    /**
     * Tests that a user can't update a campaign if he isn't permitted to do so.
     */
    public function test_update_without_permissions_impossible(): void
    {
        $perm = Permission::findOrCreate("lumos-campaigns-create-campaign", "web");
        $this->user->givePermissionTo($perm);

        // creating campaign
        ['campaignName' => $campaignName, 'response' => $response] = $this->create_campaign();
        $response->assertStatus(200);

        // retrieving campaign
        $campaign = Campaign::ownedByTeam($this->team->id)->where('name', $campaignName)->first();

        // trying to update
        $responseUpdate = $this->post(route("api.v1.campaigns.campaigns.update", ['domain' => $this->team->id, "campaign" => $campaign->id]), [
            'name' => fake()->slug(),
        ]);
        $responseUpdate->assertStatus(403);
    }

    /**
     * Tests if a campaign can be deleted if the user is permitted to do so.
     */
    public function test_delete_campaign(): void
    {
        $perm1 = Permission::findOrCreate("lumos-campaigns-edit-own-campaigns", "web");
        $perm2 = Permission::findOrCreate("lumos-campaigns-create-campaign", "web");
        $perm3 = Permission::findOrCreate("lumos-campaigns-delete-own-campaigns", "web");
        $this->user->givePermissionTo([$perm1, $perm2, $perm3]);

        ['campaignName' => $campaignName, 'response' => $response] = $this->create_campaign();
        $response->assertStatus(200);
        $campaign = Campaign::ownedByTeam($this->team->id)->where('name', $campaignName)->first();

        $responseDelete = $this
            ->actingAs($this->user)
            ->delete(route("api.v1.campaigns.campaigns.update", [
                'domain' => $this->team->id,
                "campaign" => $campaign->id
            ]));

        $responseDelete->assertStatus(200);
        $campaign = $campaign->fresh();
        $this->assertNotEquals(null, $campaign['deleted_at']);
    }
}
