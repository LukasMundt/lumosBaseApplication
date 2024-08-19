<?php

namespace Tests\Feature\Ci;

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Illuminate\Http\UploadedFile;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class RecordingTest extends TestCase
{
    use RefreshDatabase;

    /**
     * This Method creates a user which has the permission to create recordings and view his own.
     * @return \App\Models\User
     */
    private function setUpUserWithPermissions(): User
    {
        setPermissionsTeamId(20);
        $user = User::factory()->create();
        $perm = Permission::create(['name' => fake()->slug()]);
        $role = Role::create(["name" => fake()->slug()]);
        $role->givePermissionTo($perm);
        $user->assignRole($role);
        return $user;
    }

    /**
     * A basic feature test example.
     */
    public function test_index_fails_without_permissons(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->get(route("api.v1.ci.akquise.mobile-recording.index", ["domain" => 20]));

        $response->assertStatus(403);
    }

    /**
     * A basic feature test example.
     */
    public function test_index_succeeds_with_permissons(): void
    {
        $user = $this->setUpUserWithPermissions();

        $response = $this->actingAs($user)->get(route("api.v1.ci.akquise.mobile-recording.index", ["domain" => 20]));

        $response->assertStatus(200);
    }

    public function test_store_fails_without_permissions(): void
    {
        $user = User::factory()->create();

        $response = $this->actingAs($user)->json("POST", route("api.v1.ci.akquise.mobile-recording.store", ["domain" => 20]), ['locations' => [["latitude" => fake()->latitude(), 'longitude' => fake()->longitude(), "timestamp" => now()->unix()]], "audio" => UploadedFile::fake()->createWithContent("audioFile.mp3", crypt(fake()->randomHtml(), "salt"))]);

        $response->assertStatus(403);
    }

    public function test_store_succeeds_with_permissions(): void
    {
        $user = $this->setUpUserWithPermissions();

        $response = $this->actingAs($user)->json("POST", route("api.v1.ci.akquise.mobile-recording.store", ["domain" => 20]), ['locations' => [["latitude" => fake()->latitude(), 'longitude' => fake()->longitude(), "timestamp" => now()->unix()]], "audio" => UploadedFile::fake()->createWithContent("audioFile.mp3", crypt(fake()->randomHtml(), "salt"))]);

        $response->assertStatus(200);
    }

    public function test_user_can_only_access_own_recordings(): void
    {
        $user1 = $this->setUpUserWithPermissions();
        $user2 = $this->setUpUserWithPermissions();

        $creation1 = $this->actingAs($user1)->json("POST", route("api.v1.ci.akquise.mobile-recording.store", ["domain" => 20]), ['locations' => [["latitude" => fake()->latitude(), 'longitude' => fake()->longitude(), "timestamp" => now()->unix()]], "audio" => UploadedFile::fake()->createWithContent("audioFile.mp3", crypt(fake()->randomHtml(), "salt"))]);
        $creation2 = $this->actingAs($user2)->json("POST", route("api.v1.ci.akquise.mobile-recording.store", ["domain" => 20]), ['locations' => [["latitude" => fake()->latitude(), 'longitude' => fake()->longitude(), "timestamp" => now()->unix()]], "audio" => UploadedFile::fake()->createWithContent("audioFile.mp3", crypt(fake()->randomHtml(), "salt"))]);

        $creation1->assertStatus(200);
        $creation2->assertStatus(200);

        $index1 = $this->actingAs($user1)->get(route("api.v1.ci.akquise.mobile-recording.index", ["domain" => 20]));
        $index2 = $this->actingAs($user2)->get(route("api.v1.ci.akquise.mobile-recording.index", ["domain" => 20]));

        $content1 = json_decode($index1->getContent());
        $content2 = json_decode($index2->getContent());

        $this->assertTrue(count($content1) == 1);
        $this->assertTrue(count($content2) == 1);
        $this->assertTRue($content1 != $content2);
    }

    // TODO: Update testen
    // TODO: Delete testen (auch force delete und restore)
}
