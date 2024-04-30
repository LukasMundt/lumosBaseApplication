<?php
namespace App\Services;

use HaydenPierce\ClassFinder\ClassFinder;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use InvalidArgumentException;

class SimpleModelService
{
    static public function generateSimpleNames()
    {
        $modelsRaw = ClassFinder::getClassesInNamespace("App\Models", ClassFinder::RECURSIVE_MODE);
        $models = [];
        foreach ($modelsRaw as $model) {
            $hash = Hash::make($model);
            Cache::add("simpleModelName_" . $model, $hash);
            Cache::add("simpleModelName_" . $hash, $model);
        }
        return $models;
    }

    /**
     * @return string simple name for a model
     * @throws InvalidArgumentException if the input class is not a namespace or 
     */
    static public function getSimpleName(string $namespaceAndClass): string
    {
        $hash = Cache::get("simpleModelName_" . $namespaceAndClass, null);
        if ($hash == null) {
            // be aware of the sideeffects of the evaluation of the static method call in the next line
            if (!in_array($namespaceAndClass, self::generateSimpleNames())) {
                Log::error("Classname not found.", [$namespaceAndClass]);
                throw new InvalidArgumentException("Classname not found.");
            }
            $hash = Cache::get("simpleModelName_" . $namespaceAndClass, null);
        }
        return $hash;
    }

    /**
     * @return string classname for simple name
     */
    static public function getModelFromSimpleName(string $simpleName): string
    {
        $name = Cache::get("simpleModelName_" . $simpleName, null);
        if ($name == null) {
            self::generateSimpleNames();
            $name = Cache::get("simpleModelName_" . $simpleName, null);
            if ($name == null) {
                Log::error("Simple model name not found", [$simpleName]);
                throw new InvalidArgumentException("Simple model name not found.");
            }
        }
        return $name;
    }
}