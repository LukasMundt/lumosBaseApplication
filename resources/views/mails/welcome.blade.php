<x-mail::message>
# Willkommen
 
Moin {{$name}},

{{$creator}} hat gerade einen Account für dich erstellt.
Klicke jetzt unten, um dein Passwort festzulegen.

 
<x-mail::button :url="$url">
Passwort festlegen
</x-mail::button>

-------------------


 

</x-mail::message>