<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class ListAddressesRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'street_and_number' => ['required', 'string', 'max:255'],
            'address_types' => ['string', 'nullable']
        ];
    }
}
