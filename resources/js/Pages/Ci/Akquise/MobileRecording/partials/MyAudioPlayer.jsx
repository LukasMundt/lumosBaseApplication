import { Button } from "@/Components/ui/button";
import { useRef, useState } from "react";
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";
import { Progress } from "@/Components/ui/progress";
import {
    FastForward,
    Pause,
    Play,
    RefreshCcw,
    RefreshCw,
    RefreshCwOff,
    Repeat,
    Rewind,
    Volume2,
    VolumeX,
} from "lucide-react";

export default function MyAudioPlayer({ src, onCurrentTimeChange = null }) {
    const player = useRef();
    const [state, setState] = useState();

    const playingTime = setInterval(() => getTime(), 500);

    function getTime() {
        if (player && onCurrentTimeChange != null && state === "playing") {
            onCurrentTimeChange(player.current.audio.current.currentTime);
        }
    }

    return (
        <div>
            <AudioPlayer
                src={src}
                listenInterval={500}
                ref={player}
                layout="horizontal"
                className="rounded-lg"
                onPlay={(e) => setState("playing")}
                onPause={(e) => {
                    setState("paused");
                    clearInterval(playingTime);
                }}
                onEnded={(e) => {
                    setState("ended");
                    clearInterval(playingTime);
                }}
                onSuspend={(e) => {
                    setState("suspended");
                    clearInterval(playingTime);
                }}
                customIcons={{
                    play: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <Play className="stroke-black group-hover:fill-black" />
                        </div>
                    ),
                    pause: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <Pause className="stroke-black group-hover:fill-black" />
                        </div>
                    ),
                    volume: (
                        <div className="flex justify-center w-full rounded hover:bg-gray-300">
                            <Volume2 className="stroke-black" />
                        </div>
                    ),
                    volumeMute: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <VolumeX className="stroke-black " />
                        </div>
                    ),
                    loop: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <RefreshCw className="stroke-black " />
                        </div>
                    ),
                    loopOff: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <RefreshCwOff className="stroke-black " />
                        </div>
                    ),
                    forward: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <FastForward className="stroke-black group-hover:fill-black" />
                        </div>
                    ),
                    rewind: (
                        <div className="flex justify-center w-full group rounded hover:bg-gray-300">
                            <Rewind className="stroke-black group-hover:fill-black" />
                        </div>
                    ),
                }}
                // other props here
            />
            {/* <Progress value={player.current. * 10} /> */}
        </div>
    );
}
