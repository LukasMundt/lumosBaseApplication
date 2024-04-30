<?php

namespace Tests\Browser;

use Illuminate\Foundation\Testing\DatabaseMigrations;
use Laravel\Dusk\Browser;
use Tests\DuskTestCase;

class ExampleTest extends DuskTestCase
{
    /**
     * A basic browser test example.
     */
    public function testRedirectFromHomepageToLogin(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit('/')
                    ->assertRouteIs('login');
        });
    }

    public function testLoginDefaultCredentials(): void
    {
        $this->browse(function (Browser $browser) {
            $browser->visit(route('login'))
                    ->type('email', 'admin@example.local')
                    ->type('password', 'changeme')
                    ->press('login-button');
        });
    }
}
