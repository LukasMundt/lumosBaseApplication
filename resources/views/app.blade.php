<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" >

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#141826"/>

    <title inertia>{{ config('app.name', 'Laravel') }}</title>
    <!-- Fonts -->
    <!-- Fonts now are loaded in the app.css-file from the public folder -->

    <link rel="preload" href="/logo.svg" as="image">

    <!-- Favicon -->
    <link rel="icon" type="image/png" href="/favicon.png" sizes="32x32">

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