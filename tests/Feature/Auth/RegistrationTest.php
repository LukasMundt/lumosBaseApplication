<?php

namespace Tests\Feature\Auth;

use App\Providers\RouteServiceProvider;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class RegistrationTest extends TestCase
{
    use RefreshDatabase;

    public function test_registration_screen_can_be_rendered_when_allowed(): void
    {
        $default = config('lumos.registration.allowed');
        config(['lumos.registration.allowed' => true]);

        $response = $this->get('/register');

        $response->assertStatus(200);

        config(['lumos.registration.allowed' => $default]);
    }

    public function test_registration_screen_can_be_rendered_when_not_allowed(): void
    {
        $default = config('lumos.registration.allowed');
        config(['lumos.registration.allowed' => false]);

        $response = $this->get('/register');

        $response->assertStatus(403);

        config(['lumos.registration.allowed' => $default]);
    }

    public function test_new_users_can_register_when_allowed(): void
    {
        $default = config('lumos.registration.allowed');

        config(['lumos.registration.allowed' => true]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $this->assertAuthenticated();
        $response->assertRedirect(RouteServiceProvider::HOME);

        config(['lumos.registration.allowed' => $default]);
    }

    public function test_new_users_can_register_when_not_allowed(): void
    {
        $default = config('lumos.registration.allowed');

        config(['lumos.registration.allowed' => false]);

        $response = $this->post('/register', [
            'name' => 'Test User',
            'email' => 'test@example.com',
            'password' => 'password',
            'password_confirmation' => 'password',
        ]);

        $response->assertStatus(403);

        config(['lumos.registration.allowed' => $default]);
    }
}
