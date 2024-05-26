<?php

namespace App\Jobs;

use App\Models\Campaign;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Rawilk\Settings\Facades\Settings;
use Spatie\Browsershot\Browsershot;
use Spatie\LaravelPdf\Facades\Pdf;

class PrintCampaign implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    /**
     * The number of seconds after which the job's unique lock will be released.
     *
     * @var int
     */
    public $uniqueFor = 3600;

    /**
     * Get the unique ID for the job.
     */
    public function uniqueId(): string
    {
        return $this->campaign->id;
    }

    private $salutations;

    /**
     * Create a new job instance.
     */
    public function __construct(public Campaign $campaign)
    {
        //
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $team = session('team');

        $logoPath = "/teams//" . $team . "/";
        $files = Storage::allFiles("/teams//" . $team . "/");
        $logoPath = null;
        foreach ($files as $file) {
            if (Str::of($file)->contains($logoPath . "logo.")) {
                $logoPath = $file;
            }
        }

        // TODO: what to do if no logo saved

        // get salutation (priorities: campaign -> team -> app)
        if (isset($this->campaign->salutations)) {
            $salutations = $this->campaign->salutations;
        } else if (Settings::get('campaigns.salutations', null)) {
            $salutations = Settings::get('campaigns.salutations');
        } else {
            $salutations = Settings::withoutTeams()->get('campaigns.salutations');
        }
        $salutations = [
            'not specified' => "Not specified",
            'female' => "female",
            'male' => 'male',
            'diverse' => "diverse"
        ];
        $this->salutations = $salutations;

        // get addresses
        $akquiseObjects = $this->campaign->addressList->getAddresses(["personen.address", "personen", "projekt.address"]);

        $recipients = [];
        $persons = [];

        foreach ($akquiseObjects as $akquise) {
            $address = $akquise->projekt->address;

            // for most of the cases the address of the current object is the right value
            $recipient = [
                "line2" => $address->street . " " . $address->housenumber,
                "line3" => $address->zip_code . " " . $address->city,
            ];

            if (count($akquise->personen)) {
                $printedRecipients = 0;

                foreach ($akquise->personen as $person) {
                    //TODO: ggf. in frontend auch noch anbieten, das nach prioritaet gefiltert wird
                    // hier werden behandelt: Eigentümer mit einem Nachnamen egal ob an adresse oder woanders ansässig
                    if ($person->lastname && $person->pivot->type == "Eigentümer" && !in_array($person->id, $persons)) {
                        $person = $person->append('name');
                        $recipients[] = $this->handleOwnerWithLastname($person, $recipient);
                        $printedRecipients++;
                    }
                    // owner without last name
                    else if ($person->pivot->type == "Eigentümer") {
                        $recipients[] = $this->handleOwner($recipient);
                        $printedRecipients++;
                    }
                    // only neighbours with address
                    else if ($person->pivot->type == "Nachbar" && $person->address) {
                        // TODO: um nachbarn kümmern
                    }
                }

                if ($printedRecipients == 0) {
                    $recipients[] = $this->handleOwner($recipient);
                }
            } else {
                $recipients[] = $this->handleOwner($recipient);
            }
        }


        // generation of the pdf
        Pdf::withBrowsershot(function (Browsershot $browsershot) {
            $browsershot->noSandbox();
        })->view('campaigns.multi', [
                    'content' => $this->campaign->content,
                    'title' => 'Dies ist der Titel',
                    'date_for_print' => $this->campaign->date_for_print,
                    'sender' => Settings::get('sender', ""),
                    'logo' => "data:image/png;base64," . base64_encode(Storage::get($logoPath)),
                    'recipients' => $recipients,
                ])
            ->footerView('campaigns.footer.default', [
                'content' => Settings::get('footer', ""),
                'margins' => '20mm'
            ])
            ->margins(20, 20, 20, 20)
            ->save(Storage::path("/teams//" . $team . '/campaigns//' . $this->campaign->id . ".pdf"));
    }

    private function handlePersonWithDifferentAddress($person, array $recipient): array
    {
        if ($person->address) {
            $recipient['line2'] = $person->address->street . " " . $person->address->housenumber;
            $recipient['line3'] = $person->address->zip_code . " " . $person->address->city;
        }

        return $recipient;
    }

    private function handleOwner(array $recipient): array
    {
        $recipient['line1'] = "Die Eigentümer";
        $recipient['anrede'] = $this->salutations['not specified'];
        return $recipient;
    }

    private function handleOwnerWithLastname($person, $recipient): array
    {
        $recipient = $this->handlePersonWithDifferentAddress($person, $recipient);
        $recipient["line1"] = $person->name;
        $recipient["anrede"] = str_replace("//nachname//", $person->nachname, $this->salutations[$person->gender]);
        return $recipient;
    }


}
