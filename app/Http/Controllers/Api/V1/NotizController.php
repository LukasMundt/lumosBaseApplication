<?php

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Http\Requests\SaveNotizRequest;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Notiz;

class NotizController extends Controller
{
    public function save(SaveNotizRequest $request)
    {
        $classString = Notiz::getClassForNotableModelHash($request->validated('class'));
        $model = null;
        if ($classString != null) {
            $model = $classString::where('id', $request->validated('model_id'))->first();
        }

        // neue Notiz
        if (empty($request->validated('id'))) {
            if ($model == null) {
                Log::error('Note was meant to be updated but no note found to update.', ['validated data from request' => $request->validated()]);
            } else {


                $model->notizen()
                    ->save(
                        $notiz = new Notiz([
                            'inhalt' => json_encode($request->validated('notiz')),
                            'created_by' => Auth::user()->id,
                            'updated_by' => Auth::user()->id,
                        ])
                    );
            }

        }
        // bestehende Notiz
        else {
            $notiz = Notiz::where('id', $request->validated('id'))->first();
            $notiz->inhalt = json_encode($request->validated('notiz'));
            $notiz->updated_by = Auth::user()->id;
            $notiz->save();
        }
        // Log::debug();
        // Log::debug($request->validated());

        return $notiz->refresh()->id;
        // return Inertia::lazy(fn() => 'hallo');
        // return redirect(route('akquise.akquise.showMitNotiz', ['projekt' => $model->projekt_id, 'notiz' => $notiz]));
    }
}