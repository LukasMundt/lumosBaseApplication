<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class UpdatePersonRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            "anrede" => ["string", "max:255", "nullable", Rule::in(['', 'Frau', 'Herr', 'Familie'])],
            "titel" => "nullable|string|max:255",
            "vorname" => "nullable|string|max:255",
            "nachname" => "nullable|string|max:255",
            "email" => "nullable|string|max:255|email",
            "strasse" => "nullable|string|max:255",
            "hausnummer" => "nullable|string|max:255",
            "plz" => ["nullable", "string", "max:5"],
            // nur zahlen hinzufügen
            "stadt" => "nullable|string|max:255",
            "telefonnummern.*.value" => ["sometimes", "string", "max:30"] // nur zahlen, bindestrich, plus und leerzeichen
        ];
    }
}
