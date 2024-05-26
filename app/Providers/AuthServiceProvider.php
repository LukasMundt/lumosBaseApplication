<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Campaign;
use App\Models\Ci\Akquise;
use App\Models\Team;
use App\Policies\Admin\TeamPolicy;
use App\Policies\CampaignPolicy;
use App\Policies\Ci\AkquisePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        Team::class => TeamPolicy::class,
        Akquise::class => AkquisePolicy::class,
        Campaign::class => CampaignPolicy::class
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
