<?php

namespace App\Http\Requests;

use App\Rules\RoleIsInGlobalOrCurrentTeam;
use App\Rules\UserIsNotMemberOfTeam;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class AddMemberToTeamRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'user' => ['required', Rule::exists('users','id'), new UserIsNotMemberOfTeam],
            'role' => ['required', Rule::exists('roles', 'id'), new RoleIsInGlobalOrCurrentTeam],
        ];
    }
}
