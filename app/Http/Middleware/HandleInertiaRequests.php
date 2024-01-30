<?php

namespace App\Http\Middleware;

use App\Models\NavItem;
use App\Models\Team;
use App\Rules\DomainIsValid;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Inertia\Middleware;
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
        $domain = null;
        $domain = Validator::make(["domain" => $request->route('domain')], [
            'domain' => ['nullable', 'string', new DomainIsValid],
        ])->validated()['domain'];


        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
            'nav' => function () use ($domain) {
                if (Auth::check()) {

                    if ($domain == 'personal') {
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
                            $this->teamPermissionsAllowNavItemVisible($navItem->team_permissions)
                        ) {
                            $result[] = $navItem;
                        }
                    }
                }
                return $result;


            },
            'domain' => $domain,
            'teams' => Team::all(['id', 'name']),
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
        } else if (isset($roles['team-specific']) && Auth::user()->hasAnyRole($roles['team-specific'])) {
            return true;
        }
        return false;
    }

    private function teamPermissionsAllowNavItemVisible(array|null $roles): bool
    {
        if ($roles == null || empty($roles)) {
            return true;
        }
        return false;
    }
}
