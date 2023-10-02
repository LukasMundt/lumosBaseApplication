<?php

namespace App\Http\Requests;

use App\Rules\HasPermissionsOfRole;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rule;

class UpdateUserRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        setPermissionsTeamId(0);
        return Auth::user()->hasPermissionTo('edit-user');
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array|string>
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'email' => [
                'required',
                'email',
                Rule::unique('users', 'email')->ignore($this->user->id),
            ],
            'status' => 'required|string|max:255',
            'roles' => [
                'array',
                new HasPermissionsOfRole
            ],
            'teams' => [
                'array',
            ],
        ];
    }
}