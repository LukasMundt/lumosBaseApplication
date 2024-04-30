<?php

namespace App\Models;

use App\Models\Ci\Akquise;
use Database\Factories\NotizFactory;
use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\MorphTo;

class Notiz extends Model
{
    use HasUlids;
    use HasFactory;

    protected $table = 'notes';

    protected $fillable = ['inhalt', 'created_by', 'updated_by'];

    protected $appends = [];

    protected $casts = [
        'inhalt' => 'encrypted',
        // 'created_by' => User::class
    ];

    protected static function newFactory(): Factory
    {
        return NotizFactory::new();
    }

    public function notierbar(): MorphTo
    {
        return $this->morphTo('notierbar');
    }

    public static function getNotableModels(): array
    {
        return [
            Akquise::class,
        ];
    }

    public static function getClassForNotableModelHash(string $hash): string|null
    {
        $models = self::getNotableModels();
        foreach ($models as $model) {
            if (hash('sha256', $model) == $hash) {
                return $model;
            }
        }
        return null;
    }
}