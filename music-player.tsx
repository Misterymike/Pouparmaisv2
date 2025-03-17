import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Volume2, VolumeX, SkipForward, SkipBack, Play, Pause, Shuffle, Disc } from "lucide-react";
import { useAudio } from "@/hooks/use-audio";
import { useState, useEffect } from "react";

export function MusicPlayer() {
  const { 
    isBackgroundMusicPlaying, 
    toggleBackgroundMusic, 
    currentTrack,
    availableTracks,
    currentTime,
    duration,
    setCurrentTime,
    playNextTrack,
    playPreviousTrack,
    isMuted,
    toggleMute,
    volume,
    setVolume
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card 
      className={`fixed bottom-4 ${isExpanded ? 'left-4 right-4 md:left-auto md:right-4 md:w-80' : 'left-4 w-auto'} p-4 glass-card transition-all duration-300 ease-in-out backdrop-blur-xl bg-black/20 border border-white/10 group hover:bg-black/30 z-50`}
    >
      <div className="flex items-center gap-4">
        {/* Vinil Giratório */}
        <div 
          className={`relative w-12 h-12 ${isBackgroundMusicPlaying ? 'animate-spin-slow' : ''} cursor-pointer`}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <Disc className="w-full h-full text-cyan-400" />
          <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-cyan-500/20 to-transparent" />
        </div>

        {/* Controles Principais */}
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={playPreviousTrack}
              className="hover:scale-110 transition-transform duration-200 bg-white/5 border-white/10 hover:bg-white/10"
            >
              <SkipBack className="h-4 w-4 text-cyan-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleBackgroundMusic}
              className="hover:scale-110 transition-transform duration-200 bg-white/5 border-white/10 hover:bg-white/10"
            >
              {isBackgroundMusicPlaying ? (
                <Pause className="h-4 w-4 text-cyan-400" />
              ) : (
                <Play className="h-4 w-4 text-cyan-400" />
              )}
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={playNextTrack}
              className="hover:scale-110 transition-transform duration-200 bg-white/5 border-white/10 hover:bg-white/10"
            >
              <SkipForward className="h-4 w-4 text-cyan-400" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleMute}
              className="hover:scale-110 transition-transform duration-200 bg-white/5 border-white/10 hover:bg-white/10"
            >
              {isMuted ? (
                <VolumeX className="h-4 w-4 text-cyan-400" />
              ) : (
                <Volume2 className="h-4 w-4 text-cyan-400" />
              )}
            </Button>

            <Slider
              value={[volume]}
              max={1}
              step={0.1}
              className="w-24"
              onValueChange={([value]) => setVolume(value)}
            />
          </div>

          {isExpanded && (
            <div className="mt-2 space-y-2">
              {/* Barra de Progresso */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-400 min-w-[40px]">
                  {formatTime(currentTime)}
                </span>
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  className="flex-1"
                  onValueChange={([value]) => setCurrentTime(value)}
                />
                <span className="text-xs text-gray-400 min-w-[40px]">
                  {formatTime(duration)}
                </span>
              </div>

              {/* Nome da Música */}
              <div className="text-sm text-cyan-400 truncate text-center">
                {availableTracks[currentTrack]?.name || "Música Atual"}
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}