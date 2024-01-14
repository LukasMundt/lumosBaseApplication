<?php

namespace Tests\Feature\Admin;

use App\Models\Team;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use Tests\TestCase;

class TeamTest extends TestCase
{
    use RefreshDatabase;

    /**
     * A basic feature test example.
     */
    public function test_superadmin_can_access_team_pages_and_perform_all_actions(): void
    {
        $this->seed();

        $team = Team::factory()->create();

        $user = User::factory()->create();
        $user->assignRole("super-admin");

        $this->can_access_team_pages_and_perform_all_actions($user, $team);
        $this->can_delete_and_restore($user, $team);
    }

    public function test_manage_all_teams_permission_can_access_team_index(): void
    {
        $this->seed();

        $team = Team::factory()->create();

        $user = User::factory()->create();
        $user->givePermissionTo('manage-all-teams');

        $this->can_access_team_pages_and_perform_all_actions($user, $team);
        $this->can_delete_and_restore($user, $team);
    }

    public function test_manage_own_team_permission_can_access_team_index(): void
    {
        $this->seed();

        $user = User::factory()->create();
        $team = Team::factory()->create();

        setPermissionsTeamId($team->id);
        $user->unsetRelation('roles');
        $user->unsetRelation('permissions');

        $user->givePermissionTo('manage-own-team');

        $this->can_access_team_pages_and_perform_all_actions($user, $team, true);
    }

    private function can_access_team_pages_and_perform_all_actions(User $user, Team $team, $onlyOwnTeam = false): void
    {
        // Index
        $response = $this
            ->actingAs($user)
            ->get('/admin/teams');

        $response->assertStatus(200);

        // Create -> test is only made when performed for user who should
        // manage more than his own team
        if (!$onlyOwnTeam) {
            $response = $this
                ->actingAs($user)
                ->get('/admin/teams/create');

            $response->assertStatus(200);
        }

        // Store -> test is only made when performed for user who should
        // manage more than his own team
        if (!$onlyOwnTeam) {
            $teamName = fake()->slug(4);
            $teamDescription = fake()->text(230);

            $response = $this
                ->actingAs($user)
                ->post('/admin/teams', [
                    'name' => $teamName,
                    'description' => $teamDescription
                ]);

            $response->assertRedirectToRoute('admin.teams.index');
            $team = Team::where('name', $teamName)->first();
            $this->assertEquals($teamName, $team->name, "Team-Name ist nicht korrekt.");
            $this->assertEquals($teamDescription, $team->description, "Team-Description ist nicht korrekt");
        }

        // addMember
        setPermissionsTeamId(0);
        $secondUser = User::factory()->create();
        $role = Role::findByName('team-owner', 'web');

        $response = $this
            ->actingAs($user)
            ->post(route('admin.teams.addMember', ['team' => $team->id]), [
                'user' => $secondUser->id,
                'role' => $role->id,
            ]);

        $response->assertStatus(200);
        $userAndRoles = DB::table('model_has_roles')
            ->where('model_type', User::class)
            ->where('model_id', $secondUser->id)
            ->where('role_id', $role->id)
            ->where('team_id', $team->id)
            ->get();

        $this->assertNotNull($userAndRoles);

        // update Permissions of user
        $newRole = Role::create(['name' => 'TestRolle', 'team_id' => $team->id]);
        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'admin.teams.updatePermissionsOfMember',
                    ['team' => $team->id, 'user' => $secondUser->id]
                ),
                [
                    'roles' => [$newRole->id],
                ]
            );

        $response->assertStatus(200);
        $this->assertTrue($secondUser->hasRole($newRole, 'web'));

        // removeMember
        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'admin.teams.removeMember',
                    ['team' => $team->id, 'user' => $secondUser->id]
                )
            );

        $response->assertStatus(200);

        $rolesOfUser = $secondUser->fresh()->roles;
        $teamIds = data_get($rolesOfUser, "*.team_id");
        $this->assertFalse(in_array($team->id, $teamIds));

        $permsOfUser = $secondUser->fresh()->permissions;
        $teamIds = data_get($permsOfUser, "*.pivot.team_id");
        $this->assertFalse(in_array($team->id, $teamIds));


        // Edit
        $response = $this
            ->actingAs($user)
            ->get(route('admin.teams.edit', ['team' => $team]));

        $response->assertStatus(200);

        // Update
        $teamName = fake()->slug(4);
        $teamDescription = fake()->text(230);
        $response = $this
            ->actingAs($user)
            ->post(route('admin.teams.update', ['team' => $team]), [
                'name' => $teamName,
                'description' => $teamDescription
            ]);

        $response->assertStatus(200);
        $team = $team->fresh();
        $this->assertEquals($teamName, $team->name);
        $this->assertEquals($teamDescription, $team->description);
    }

    private function can_delete_and_restore(User $user, Team $team)
    {
        // Delete
        $response = $this
            ->actingAs($user)
            ->delete(route('admin.teams.delete', ['team' => $team]));

        $response->assertStatus(200);
        $this->assertNotEmpty($team->fresh()->deleted_at);

        // Restore
        $response = $this
            ->actingAs($user)
            ->patch(route('admin.teams.restore', ['team' => $team]));

        $response->assertStatus(200);
        $this->assertNull($team->fresh()->deleted_at);

        // Delete again
        $response = $this
            ->actingAs($user)
            ->delete(route('admin.teams.delete', ['team' => $team]));

        $response->assertStatus(200);
        $this->assertNotEmpty($team->fresh()->deleted_at);

        // permanent delete
        $response = $this
            ->actingAs($user)
            ->delete(route('admin.teams.delete', ['team' => $team]));

        $response->assertStatus(200);
        $this->assertNull($team->fresh());
    }

    public function test_guest_cant_perform_any_actions(): void
    {
        // Index
        $response = $this->get('/admin/teams');
        $response->assertRedirect('/login');

        // Create
        $response = $this->get('/admin/teams/create');
        $response->assertRedirect('/login');

        // Store
        $response = $this
            ->post('/admin/teams', [
                'name' => fake()->slug(4),
                'description' => fake()->text(230)
            ]);
        $response->assertRedirect('/login');

        // addMember
        $secondUser = User::factory()->create();
        $team = Team::factory()->create();
        $response = $this
            ->post(route('admin.teams.addMember', ['team' => $team->id]), [
                'user' => $secondUser->id,
                'role' => random_int(1, 10),
                // 'role' => Role::where('name', 'team-owner')->where('team_id', 0)->first(),
            ]);

        $response->assertRedirect('/login');

        // update Permissions of user
        $response = $this
            ->post(
                route(
                    'admin.teams.updatePermissionsOfMember',
                    ['team' => $team->id, 'user' => $secondUser->id]
                ),
                [
                    'role' => '',
                    'permission' => '',
                ]
            );

        $response->assertRedirect('/login');

        // removeMember
        $response = $this
            ->post(
                route(
                    'admin.teams.removeMember',
                    ['team' => $team->id, 'user' => $secondUser->id]
                )
            );

        $response->assertRedirect('/login');

        // Edit
        $response = $this
            ->get(route('admin.teams.edit', ['team' => $team]));

        $response->assertRedirect('/login');

        // Update
        $response = $this
            ->post(route('admin.teams.update', ['team' => $team]), [
                'name' => fake()->slug(4),
                'description' => fake()->text(230)
            ]);

        $response->assertRedirect('/login');

        // Delete
        $response = $this
            ->delete(route('admin.teams.delete', ['team' => $team]));

        $response->assertRedirect('/login');

        // Restore
        $response = $this
            ->patch(route('admin.teams.restore', ['team' => $team]));

        $response->assertRedirect('/login');
    }

    public function test_user_without_permissions_cant_perform_any_actions(): void
    {
        $this->seed();

        $user = User::factory()->create();

        // Index
        $response = $this
            ->actingAs($user)
            ->get('/admin/teams');
        $response->assertStatus(403);

        // Create
        $response = $this
            ->actingAs($user)
            ->get('/admin/teams/create');
        $response->assertStatus(403);

        // Store
        $response = $this
            ->actingAs($user)
            ->post('/admin/teams', [
                'name' => fake()->slug(4),
                'description' => fake()->text(230)
            ]);
        $response->assertStatus(403);

        // addMember
        $secondUser = User::factory()->create();
        $team = Team::factory()->create();
        $role = Role::where('name', 'team-owner')->where('team_id', 0)->first();

        $response = $this
            ->actingAs($user)
            ->post(route('admin.teams.addMember', ['team' => $team->id]), [
                'user' => $secondUser->id,
                'role' => $role->id,
                // 'role' => Role::where('name', 'team-owner')->where('team_id', 0)->first(),
            ]);
        $response->assertStatus(403);

        // update Permissions of user
        $newRole = Role::create(['name' => 'TestRolle', 'team_id' => $team->id]);
        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'admin.teams.updatePermissionsOfMember',
                    ['team' => $team, 'user' => $user]
                ),
                [
                    'roles' => [$newRole->id],
                ]
            );

        $response->assertStatus(403);

        // removeMember
        $response = $this
            ->actingAs($user)
            ->post(
                route(
                    'admin.teams.removeMember',
                    ['team' => $team, 'user' => $user]
                )
            );

        $response->assertStatus(403);

        // Edit
        $response = $this
            ->actingAs($user)
            ->get(route('admin.teams.edit', ['team' => $team]));

        $response->assertStatus(403);

        // Update
        $response = $this
            ->actingAs($user)
            ->post(route('admin.teams.update', ['team' => $team]), [
                'name' => fake()->slug(4),
                'description' => fake()->text(230)
            ]);

        $response->assertStatus(403);

        // Delete
        $response = $this
            ->actingAs($user)
            ->delete(route('admin.teams.delete', ['team' => $team]));

        $response->assertStatus(403);

        // Restore
        $response = $this
            ->actingAs($user)
            ->patch(route('admin.teams.restore', ['team' => $team]));

        $response->assertStatus(403);
    }

    public function test_template_and_team_role_can_be_assigned()
    {

    }

    public function test_team_permissions()
    {
        $team = Team::factory()->create();
        $permission = Permission::findOrCreate('test-permission', 'web');
        $team->permissions()->attach($permission);
        $this->assertEquals($permission->id, $team->fresh()->permissions()->first()->id);
    }
}