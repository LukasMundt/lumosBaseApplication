<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class AddressFindOrCreateRequest extends FormRequest
{
    /**
     * Prepare the data for validation.
     */
    protected function prepareForValidation(): void
    {
        $this->merge([
            'housenumber_number' => Str::match("([1-9][0-9]*)", $this->housenumber)
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'street' => ['required', 'string', 'max:255'],
            'housenumber' => ['required', 'string', 'max:50'],
            'housenumber_number' => ['required', 'numeric'],
            'zip_code' => ['required', 'string', 'max:5'],
            'district' => ['required', 'string', 'max:50'],
            'city' => ['nullable', 'string', 'max:255'],
            'lat' => ['nullable', 'numeric'],
            'lon' => ['nullable', 'numeric'],
        ];
    }
}
