import { useState, useRef, useEffect } from "react";
import { useCounter, useGeolocation, useMap } from "@uidotdev/usehooks";
import { Pause, Play, Square, TriangleAlert } from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/Components/ui/button";
import { useRemember } from "@inertiajs/react";
import { Switch } from "@/Components/ui/switch";
import { Label } from "@/Components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/Components/ui/alert";
const AudioRecorder = ({ domain, setBreadcrumb = null }) => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [
        duration,
        {
            increment: incrementDuration,
            decrement: decrementDuration,
            reset: resetDuration,
        },
    ] = useCounter(0);
    const mimeType = "audio/mpeg";
    const location = useGeolocation({
        enableHighAccuracy: true,
        maximumAge: 5,
    });
    const locations = useMap();
    const [bigButtons, setBigButtons] = useRemember(false, "audio.bigButtons");

    setBreadcrumb != null && setBreadcrumb("Neue Aufnahme");

    useEffect(() => {
        const interval = setInterval(() => {
            if (recordingStatus == "recording" && !location.loading) {
                locations.set(location.timestamp, location);
            }
        }, 5000);
    }, [recordingStatus]);

    const startRecording = async () => {
        setRecordingStatus("recording");
        //create new Media recorder instance using the stream
        const media = new MediaRecorder(stream, { type: mimeType });
        //set the MediaRecorder instance to the mediaRecorder ref
        mediaRecorder.current = media;
        //invokes the start method to start the recording process
        mediaRecorder.current.start();
        let localAudioChunks = [];
        mediaRecorder.current.ondataavailable = (event) => {
            if (typeof event.data === "undefined") return;
            if (event.data.size === 0) return;
            localAudioChunks.push(event.data);
        };
        setAudioChunks(localAudioChunks);
    };

    const pauseRecording = () => {
        setRecordingStatus("paused");
        mediaRecorder.current.pause();
    };

    const resumeRecording = () => {
        setRecordingStatus("recording");
        mediaRecorder.current.resume();
    };

    const stopRecording = () => {
        setRecordingStatus("inactive");
        //stops the recording instance
        mediaRecorder.current.stop();
        mediaRecorder.current.onstop = () => {
            //creates a blob file from the audiochunks data
            // const audioBlob = new Blob(audioChunks, { type: mimeType });
            // //creates a playable URL from the blob file.
            // const audioUrl = URL.createObjectURL(audioBlob);
            toast.promise(
                axios.postForm(
                    route("api.v1.ci.akquise.mobile-recording.store", {
                        domain: domain,
                    }),
                    {
                        locations: Array.from(locations.values()),
                        audio: new File(audioChunks, "audio.mp3", {
                            type: mimeType,
                        }),
                        duration: duration,
                    }
                ),
                {
                    loading: "Aufnahme wird gespeichert.",
                    success: () => {
                        setAudioChunks([]);
                        locations.clear();
                        return "Aufnahme erfolgreich gespeichert.";
                    },
                    error: (error) => "Fehler",
                }
            );
        };
    };

    const getMicrophonePermission = async () => {
        if ("MediaRecorder" in window) {
            try {
                const streamData = await navigator.mediaDevices.getUserMedia({
                    audio: true,
                    video: false,
                });
                setPermission(true);
                setStream(streamData);
            } catch (err) {
                alert(err.message);
            }
        } else {
            alert("The MediaRecorder API is not supported in your browser.");
        }
    };

    return (
        <div className="w-full h-full">
            <div className="relative w-full flex h-full justify-center">
                <div className="absolute end-0 top-0 flex items-center">
                    <Switch
                        id="bigButtons"
                        checked={bigButtons}
                        aria-label="toggle big buttons"
                        onCheckedChange={(e) => setBigButtons(!bigButtons)}
                    ></Switch>
                    <Label htmlFor="bigButtons" className="ml-2">
                        Große Buttons
                    </Label>
                </div>
                {!permission ? (
                    <div className="h-full flex items-center">
                        <div className="flex flex-col justify-center">
                            <Button
                                onClick={() => getMicrophonePermission()}
                                type="button"
                            >
                                Mikrofoneinsatz erlauben
                            </Button>
                            <Alert variant="destructive" className="mt-4">
                                <TriangleAlert className="h-4 w-4" />
                                <AlertTitle>Achtung!</AlertTitle>
                                <AlertDescription>
                                    Das Bedienen von Handys kann ablenken. Daher
                                    darf Lumos im Allgemeinen keinesfalls im
                                    Straßenverkehr oder anderen Situationen, die
                                    Ihre Aufmerksamkeit erfordern, verwendet
                                    werden.
                                </AlertDescription>
                            </Alert>
                        </div>
                    </div>
                ) : (
                    <div className="h-full w-full flex items-center pt-7 justify-center">
                        {permission &&
                        !bigButtons &&
                        recordingStatus === "inactive" ? (
                            <Button
                                onClick={() => startRecording()}
                                type="button"
                                className="rounded-full w-36 h-36 bg-red-600 hover:bg-red-700 border-4 border-black dark:border-white "
                                size="icon"
                            >
                                <span className="sr-only">
                                    Aufnahme starten
                                </span>
                            </Button>
                        ) : null}

                        {permission &&
                        bigButtons &&
                        recordingStatus === "inactive" ? (
                            <Button
                                onClick={() => startRecording()}
                                type="button"
                                className="w-full h-full bg-red-600 hover:bg-red-700 border-4 border-black dark:border-white "
                                size="icon"
                            >
                                <span className="sr-only">
                                    Aufnahme starten
                                </span>
                            </Button>
                        ) : null}
                        {!bigButtons && recordingStatus === "recording" ? (
                            <div className="flex items-center gap-10">
                                <div className="w-16 sm:w-24" />
                                <Button
                                    onClick={() => pauseRecording()}
                                    type="button"
                                    className="rounded-full w-24 sm:w-36 h-24 sm:h-36 group"
                                >
                                    <Pause className="h-12 sm:h-16 w-12 sm:w-16 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme pausieren
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => stopRecording()}
                                    type="button"
                                    className="rounded-full w-16 sm:w-24 h-16 sm:h-24 group"
                                >
                                    <Square className="h-12 w-12 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme beenden
                                    </span>
                                </Button>
                            </div>
                        ) : null}
                        {bigButtons && recordingStatus === "recording" ? (
                            <div className="flex items-center gap-2 w-full h-full">
                                <Button
                                    onClick={() => pauseRecording()}
                                    type="button"
                                    className="w-full h-full group"
                                >
                                    <Pause className="h-12 sm:h-16 w-12 sm:w-16 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme pausieren
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => stopRecording()}
                                    type="button"
                                    className="w-full sm:w-24 h-full sm:h-24 group"
                                >
                                    <Square className="h-12 w-12 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme beenden
                                    </span>
                                </Button>
                            </div>
                        ) : null}
                        {!bigButtons && recordingStatus === "paused" ? (
                            <div className="flex items-center gap-10">
                                <div className="w-16 sm:w-24">
                                    <div />
                                </div>
                                <Button
                                    onClick={() => resumeRecording()}
                                    type="button"
                                    className="rounded-full w-24 sm:w-36 h-24 sm:h-36 group"
                                >
                                    <Play className="h-12 sm:h-16 w-12 sm:w-16 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme pausieren
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => stopRecording()}
                                    type="button"
                                    className="rounded-full w-16 sm:w-24 h-16 sm:h-24 group"
                                >
                                    <Square className="h-12 w-12 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme beenden
                                    </span>
                                </Button>
                            </div>
                        ) : null}
                        {bigButtons && recordingStatus === "paused" ? (
                            <div className="flex items-center gap-2 w-full h-full">
                                <Button
                                    onClick={() => resumeRecording()}
                                    type="button"
                                    className="w-full h-full group"
                                >
                                    <Play className="h-12 sm:h-16 w-12 sm:w-16 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme pausieren
                                    </span>
                                </Button>
                                <Button
                                    onClick={() => stopRecording()}
                                    type="button"
                                    className="w-full h-full group"
                                >
                                    <Square className="h-12 w-12 group-hover:fill-black" />
                                    <span className="sr-only">
                                        Aufnahme beenden
                                    </span>
                                </Button>
                            </div>
                        ) : null}
                    </div>
                )}
            </div>
        </div>
    );
};
export default AudioRecorder;
