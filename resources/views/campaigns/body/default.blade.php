@props(['content', 'date_for_print', 'sender', 'logo'])

<body>
    <div class="flex justify-between" style="height: 80mm;">
        <div style="padding-top:30mm;" class="flex flex-col">
            <span style="font-size: 11px; margin-bottom: 5mm;">{{ $sender }}</span>
            <span class="hidden">An</span>
            <span>Empfänger</span>
            <span>Straße Nummer</span>
            <span>Postleitzahl Stadt</span>
        </div>
        <div class="flex flex-col justify-between">
            <div class="self-end">
                <img src={{ $logo }} style="height: 20mm;" />
            </div>

            <span class="self-end">{{ $date_for_print }}</span>
        </div>
    </div>
    <main>
        {!! $content !!}
    </main>
</body>
