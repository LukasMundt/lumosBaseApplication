<?php

namespace App\Models;

use App\Services\SimpleModelService;
use Illuminate\Database\Eloquent\Model as ModelLaravel;

class Model extends ModelLaravel
{
    static public function getSimpleName(): string
    {
        return SimpleModelService::getSimpleName(self::class);
    }
}