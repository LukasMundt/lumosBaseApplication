<?php

namespace App\Http\Requests\Ci;

use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Str;

class StoreAkquiseRequest extends FormRequest
{
    public function prepareForValidation(): void
    {
        $this->merge([
            'nicht_gewuenscht' => $this->status=='Nicht gewünscht'?true:$this->nicht_gewuenscht,
            'housenumber' => Str::lower($this->housenumber),
            'housenumber_number' => Str::remove(Str::of('a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z')->explode(','), $this->housenumber),
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
            'street' => ['required', 'string', 'max:255'],
            'housenumber' => ['required', 'string', 'max:50'],
            'housenumber_number' => ['required', 'numeric'],
            'zip_code' => ['required', 'string', 'max:5'],
            'district' => ['required', 'string', 'max:50'],
            'city' => ['nullable', 'string', 'max:255'],
            'lat' => ['nullable', 'numeric'],
            'lon' => ['nullable', 'numeric'],
            'teilung' => ['required', 'boolean'],
            'abriss' => ['required', 'boolean'],
            'nicht_gewuenscht' => ['required', 'boolean'],
            'retour' => ['required', 'boolean'],
            'status' => ['required', 'string', 'max:255']
        ];
    }
}
