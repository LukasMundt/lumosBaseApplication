<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ToolController extends Controller
{
    public function fixBauantrag2LinkView(Request $request)
    {
        return Inertia::render('Tools/FixBauantrag2Link');
    }

    public function fixBauantrag2Link(Request $request)
    {
        $validated = $request->validate([
            'rawLink' => ['required', 'min:2', 'url:http,https'],
        ]);
        $input = $validated['rawLink'];
        $posOfQm = Str::of($input)->position("?");
        $link = Str::of($input)->substr(0, $posOfQm + 1)->remove("-");
        $rawParams = Str::of($input)->substr($posOfQm + 1)->explode("&");

        foreach ($rawParams as $param) {
            $exploded = Str::of($param)->explode("=");
            $key = Str::of($exploded[0])->remove("-");

            if ($key == "uuid") {
                if (Str::isUuid($exploded[1])) {
                    $value = $exploded[1];
                } else {
                    $raw = Str::of($exploded[1])->remove("-");
                    //  dd($raw);
                    $value = Str::take($raw, 8) . "-";
                    $value .= Str::of($raw)->substr(8, 4) . "-";
                    $value .= Str::of($raw)->substr(12, 4) . "-";
                    $value .= Str::of($raw)->substr(16, 4) . "-";
                    $value .= Str::of($raw)->substr(20);
                }
            } else if ($key == 'kennung') {
                $value = Str::of($exploded[1])->remove(Str::of("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,-, ,?,")->explode(","), false);
            } else if ($key == 'praefix' || $key == 'digest') {
                $value = Str::of($exploded[1])->remove('-');
            } else if ($key == 'typ') {
                $value = Str::of($exploded[1])->remove(Str::of("a,b,c,d,e,f,g,h,i,j,k,l,m,n,o,p,q,r,s,t,u,v,w,x,y,z,-, ,?,")->explode(","), false);
            } else if ($key == 'az') {
                $reverseTemp = Str::of($exploded[1])->remove('-')->reverse();
                $value = Str::of($reverseTemp)->take(4) . "-";
                $value .= Str::of($reverseTemp)->substr(4, 4) . "-";
                $value .= Str::of($reverseTemp)->substr(8);
                $value = Str::of($value)->reverse();
            }

            if (!empty($key) && !empty($value)) {
                $link .= $key . "=" . $value . "&";
            }
            unset($value);
        }
        return Str::of($link)->substr(0, Str::of($link)->length() - 1);
    }
}