<?php

namespace App\Http\Requests\Ci;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rules\File;

class StoreRecordingRequest extends FormRequest
{
    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            "locations" => ["required"],
            "locations.*" => ["array:latitude,longitude,timestamp"],
            "audio" => ["required", "file"]
        ];
    }
}
