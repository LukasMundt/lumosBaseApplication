<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" class="dark">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.8.1/flowbite.min.js"></script> -->
    <!-- <script src="https://cdn.tailwindcss.com"></script> -->
    <!-- Fonts -->
    <!-- Fonts now are loaded in the app.css-file from the public folder -->
    <!-- <link rel="preconnect" href="https://fonts.bunny.net"> -->
    <!-- <link href="https://fonts.bunny.net/css?family=figtree:400,500,600&display=swap" rel="stylesheet" /> -->

    <!-- PWA -->
    <link rel="manifest" href="/build/manifest.webmanifest" />
    <script src="/build/registerSW.js"></script>

    <!-- Scripts -->
    @routes
    @viteReactRefresh
    @vite(['resources/js/app.jsx', str_contains($page['component'], '::')?"vendor/".substr($page['component'], 0,
    strpos($page['component'],'::'))."/src/resources/js/Pages/".substr($page['component'],
    strpos($page['component'],'::')+2).".jsx":"resources/js/Pages/{$page['component']}.jsx"])
    @inertiaHead
</head>

<body class="font-sans antialiased">
    @inertia
</body>

</html>