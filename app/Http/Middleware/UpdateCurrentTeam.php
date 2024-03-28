<?php

namespace App\Http\Middleware;

use App\Rules\DomainIsValid;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Symfony\Component\HttpFoundation\Response;

class UpdateCurrentTeam
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $domain = null;
        $domain = Validator::make(["domain" => $request->route('domain')], [
            'domain' => ['nullable', 'string', new DomainIsValid],
        ])->validated()['domain'];

        if($domain == "personal")
        {
            $domain = "0";
        }

        session()->put("team", $domain);

        return $next($request);
    }
}
