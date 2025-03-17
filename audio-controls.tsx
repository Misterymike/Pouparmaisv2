import { useAudio } from "@/hooks/use-audio";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, Play, Pause, SkipBack, SkipForward } from "lucide-react";

export function AudioControls() {
  const {
    isMuted,
    toggleMute,
    volume,
    setVolume,
    isBackgroundMusicPlaying,
    toggleBackgroundMusic,
    currentTrack,
    availableTracks,
    playNextTrack,
    playPreviousTrack
  } = useAudio();

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={playPreviousTrack}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
        >
          <SkipBack className="h-4 w-4" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={toggleBackgroundMusic}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
        >
          {isBackgroundMusicPlaying ? (
            <Pause className="h-4 w-4" />
          ) : (
            <Play className="h-4 w-4" />
          )}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          onClick={playNextTrack}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
        >
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      <div className="hidden md:block text-sm text-cyan-400">
        {availableTracks[currentTrack].name}
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={toggleMute}
          className="text-cyan-400 hover:text-cyan-300 hover:bg-slate-800/50"
        >
          {isMuted ? (
            <VolumeX className="h-4 w-4" />
          ) : (
            <Volume2 className="h-4 w-4" />
          )}
        </Button>
        <Slider
          className="w-24"
          value={[volume]}
          onValueChange={([value]) => setVolume(value)}
          max={1}
          step={0.1}
          aria-label="Volume"
        />
      </div>
    </div>
  );
}