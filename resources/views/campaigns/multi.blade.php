@props(['content', 'title', 'date_for_print', 'sender', 'logo', 'recipients'])
<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <title>{{ $title }}</title>
    {{-- @vite(['resources/css/app.css']) --}}
    {{-- @vite('resources/css/app.css') --}}
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Source+Sans+3:ital,wght@0,200..900;1,200..900&display=swap"
        rel="stylesheet">
    <meta charset="utf-8">
    {{-- @inertia --}}
</head>
@foreach ($recipients as $recipient)
    @php
        $newContent = str_replace('//anrede//', $recipient['anrede'], $content);
    @endphp
    @include('campaigns.body.default', [
        'content' => $newContent,
        'date_for_print' => $date_for_print,
        'sender' => $sender,
        'logo' => $logo,
        'line1' => $recipient['line1'],
        'line2' => $recipient['line2'],
        'line3' => $recipient['line3'],
    ])
@endforeach


</html>
