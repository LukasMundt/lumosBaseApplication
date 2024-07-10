@props(['content', 'date_for_print', 'sender', 'logo', 'line1', 'line2', 'line3'])

<body>
    <div class="flex justify-between" style="height: 75mm;">
        <div style="padding-top:30mm;" class="flex flex-col">
            <span style="font-size: 11px; margin-bottom: 5mm;">{{ $sender }}</span>
            <span class="hidden">An</span>
            <span>{{ $line1 }}</span>
            <span>{{ $line2 }}</span>
            <span>{{ $line3 }}</span>
        </div>
        <div class="flex flex-col justify-between">
            <div class="self-end">
                <img src={{ $logo }} style="height: 20mm;" />
            </div>

            <span class="self-end">{{ $date_for_print }}</span>
        </div>
    </div>
    <style>
        h1 {
            font-size: 25px;
        }
    </style>
    <main class="leading-tight">
        {!! $content !!}
    </main>
</body>
@pageBreak
