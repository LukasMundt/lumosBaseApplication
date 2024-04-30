<?php

namespace App\Http\Middleware;

use App\Models\NavItem;
use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Middleware;
use Spatie\Permission\Models\Role;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'nav' => function () {
                if (Auth::check()) {
                    $domain = session()->get("team");
                    if ($domain == 'personal' || $domain == null) {
                        $domain = 0;
                    }

                    setPermissionsTeamId($domain);
                    Auth::user()->unsetRelation('roles');
                    Auth::user()->unsetRelation('permissions');


                    $navItems = NavItem::where('top_item', null)->get()->load('childs');
                    $result = [];
                    foreach ($navItems as $navItem) {
                        if (
                            $this->permissionsAllowNavItemVisible($navItem->permissions) &&
                            $this->rolesAllowNavItemVisible($navItem->roles) &&
                            $this->teamPermissionsAllowNavItemVisible($navItem->team_permissions, $domain)
                        ) {
                            $result[] = $navItem;
                        }
                    }
                    return $result;
                }



            },
            'domain' => session()->get("team"),
            'teams' => Auth::check()?$request->user()->getTeams(['id', 'name']):[]
            // 'teams' => Auth::check()?Team::whereKey(Role::with('users')->get(['id', 'team_id'])->filter(function ($role) use ($request) {
            //     return $role->users->where('id', $request->user()->id)->count() > 0;
            // })->groupBy('team_id')->keys())->get(['id', 'name']):[],
        ]);
    }

    private function permissionsAllowNavItemVisible(array|null $permissions): bool
    {
        if ($permissions == null || empty($permissions)) {
            return true;
        } else if (isset($permissions['team-specific']) && Auth::user()->hasAnyPermission($permissions['team-specific'])) {
            return true;
        }

        return false;
    }

    private function rolesAllowNavItemVisible(array|null $roles): bool
    {
        if ($roles == null || empty($roles)) {
            return true;
        } else if (isset($roles['team_specific']) && Auth::user()->hasAnyRole($roles['team_specific'])) {
            return true;
        }
        return false;
    }

    private function teamPermissionsAllowNavItemVisible(array|null $roles, int|null|string $team): bool
    {
        if ($roles == null || empty($roles)) {
            return true;
        } else if (Team::all()->count() > 0 && Team::where('id', $team)->first()->permissions()->where('name', 'tp-lumos-akquise-basic')->count() > 0) {
            return true;
        } else {
            return false;
        }
    }
}
