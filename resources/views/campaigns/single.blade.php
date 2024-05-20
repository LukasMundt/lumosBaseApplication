@props(['content', 'title', 'date_for_print', 'sender', 'logo'])
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <title>{{ $title }}</title>
    {{-- @vite(['resources/css/app.css']) --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <meta charset="utf-8">
    {{-- @inertia --}}
</head>

@include('campaigns.body.default', [
    'content' => $content,
    'date_for_print' => $date_for_print,
    'sender' => $sender,
    'logo' => $logo,
])

</html>
