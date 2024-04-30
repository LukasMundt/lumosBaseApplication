<?php

namespace Lukasmundt\Akquise\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;
use Lukasmundt\ProjectCI\Rules\StorePersonAssociation;

class StoreAssociationRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\Rule|array|string>
     */
    public function rules(): array
    {
        return [
            'nachname' => ['required', 'array'],
            'nachname.__isNew__' => 'sometimes|boolean',
            'nachname.label' => 'required|string|max:255',
            'nachname.value' => [new StorePersonAssociation],
            'typ.value' => ['required', 'string', 'max:255', Rule::in(['Nachbar', 'Eigentümer', 'Sonstiges'])]
        ];
    }
}
