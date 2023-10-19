<?php

namespace App\Providers;

use Illuminate\Support\Facades\Auth;
use Illuminate\Support\ServiceProvider;
use Spatie\Navigation\Navigation;
use Spatie\Navigation\Section;

class NavigationServiceProvider extends ServiceProvider
{
    /**
     * Register services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap services.
     */
    public function boot(): void
    {
        $this->app->booted(function () {
            app(Navigation::class)
            ->add('Home', route('dashboard'))
            ->addIf(
                Auth::check(),
                'Admin',
                route('admin.index'),
                // fn (Section $section) => $section->add('Create post', route('blog.create'))
            );
        });
        
            // ->add('Blog', route('blog.index'), function (Section $section) {
            //     $section
            //         ->add('All posts', route('blog.index'))
            //         ->add('Topics', route('blog.topics.index'));
            // })
            // ->addIf(Auth::user()->isAdmin(), function (Navigation $navigation) {
            //     $navigation->add('Admin', route('admin.index'));
            // });
    }
}