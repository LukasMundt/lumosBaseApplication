<x-mail::message>
# Welcome
 
Hello {{$name}},

{{$creator}} just created an account for you.
Click on the button to set your password.

 
<x-mail::button :url="$url">
Set password
</x-mail::button>

This password reset link will expire in 60 minutes.

If you are sure this email is not meant for you, no further action is required.

Regards,
Lumos

-------------------

If you're having trouble clicking the button, copy and paste the URL below into your web browser: {{$url}}
</x-mail::message>