<?php

namespace App\Http\Requests;

use App\Rules\AllPermissionsAreTeamPermissions;
use Illuminate\Foundation\Http\FormRequest;

class UpdateTeamPermissionsRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "teamPermissions" => ['present', "array", new AllPermissionsAreTeamPermissions]
        ];
    }
}
