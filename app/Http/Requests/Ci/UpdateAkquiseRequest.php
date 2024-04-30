<?php

namespace App\Http\Requests\Ci;

use Illuminate\Foundation\Http\FormRequest;

class UpdateAkquiseRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        $this->merge([
            'nicht_gewuenscht' => $this->status == 'Nicht gewünscht' ? true : $this->nicht_gewuenscht,
        ]);
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            // 'strasse' => [ 'string', 'max:255'],
            // 'hausnummer' => [ 'string', 'max:50'],
            // 'hausnummer_nummer' => [ 'numeric'],
            // 'plz' => [ 'string', 'max:5'],
            // 'stadtteil' => [ 'string', 'max:50'],
            // 'stadt' => ['nullable', 'string', 'max:255'],
            // 'coordinates_lat' => ['nullable', 'numeric'],
            // 'coordinates_lon' => ['nullable', 'numeric'],
            'teilung' => ["nullable", 'boolean'],
            'abriss' => ["nullable", 'boolean'],
            'nicht_gewuenscht' => ["nullable", 'boolean'],
            'retour' => ["nullable", 'boolean'],
            'status' => ['string', 'max:255']
        ];
    }
}
