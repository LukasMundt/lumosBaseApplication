@props(['content', 'margins', 'textAlign' => 'center'])
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    {{-- @vite(['resources/css/app.css']) --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <meta charset="utf-8">
    {{-- @inertia --}}

</head>

<body>
    <main style="font-size: 11px; padding-inline:{{ $margins }}; text-align: {{ $textAlign }};">
        {{ $content }}
    </main>
</body>

</html>
