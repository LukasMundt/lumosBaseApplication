<?php

namespace App\Http\Controllers;

use App\Models\Team;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Inertia\Inertia;

class RootController extends Controller
{
  // public function root(Request $request)
  // {
  //     return redirect(route('team.dashboard', ['domain' => 'personal']));
  // }
  public function logo($domain, string $size = null)
  {
    // TODO: validate size
    $logoPath = "/teams//" . session('team') . "/";
    $files = Storage::allFiles("/teams//" . session('team') . "/");
    $logoPath = null;
    foreach ($files as $file) {
      if (Str::of($file)->contains($logoPath . "logo.")) {
        $logoPath = $file;
      }
    }

    // TODO: what to do if no logo saved
    // TODO: respond with different sizes of logos

    return response()->file(Storage::path($logoPath));
  }

  public function domainDashboard(Request $request, string $domain)
  {
    $team = session('team');
    if ($team == 0) {
      return Inertia::render("PersonalDashboard");
    }
    return Inertia::render('Dashboard', ['team' => Team::where('id', $team)->first()]);
  }
}
