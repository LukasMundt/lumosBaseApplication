<?php

namespace App\Mail;

use App\Models\User;
use Illuminate\Auth\Passwords\DatabaseTokenRepository;
use Illuminate\Auth\Passwords\PasswordBrokerManager;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Password;

class WelcomePasswordSetting extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     */
    public function __construct(protected User $user, protected User $creator)
    {

    }

    /**
     * Get the message envelope.
     */
    public function envelope(): Envelope
    {
        return new Envelope(
            subject: 'Willkommen bei Lumos',
        );
    }

    /**
     * Get the message content definition.
     */
    public function content(): Content
    {
        return new Content(
            markdown: 'mails.welcome',
            with: [
                'name' => $this->user->name,
                'creator' => $this->creator->name,
                'url' => route("password.reset", [
                    "token" => Password::createToken($this->user),
                    'email' => $this->user->email
                ])
            ]
        );
    }

    /**
     * Get the attachments for the message.
     *
     * @return array<int, \Illuminate\Mail\Mailables\Attachment>
     */
    public function attachments(): array
    {
        return [];
    }
}
