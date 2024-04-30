<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class ConnectContactRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "type" => "string|required|max:255",
            "this_type" => ["string", "required"],
            "this_id" => ["string", "required"], // validate if exists for the given model
            "contact_type" => ["string", "required", Rule::in(["App\\Models\\Person"])],
            "contact_id" => ["string", "required"] // validate if exists for the given model
        ];
    }
}
