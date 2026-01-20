import { useState } from 'react';
import { Image, Video, Link2, Hash, AtSign, MessageCircle } from 'lucide-react';

interface TweetComposerProps {
  value: string;
  onChange: (value: string) => void;
  hasImage: boolean;
  onImageToggle: () => void;
  hasVideo: boolean;
  onVideoToggle: () => void;
  isThread: boolean;
  onThreadToggle: () => void;
  threadLength: number;
  onThreadLengthChange: (length: number) => void;
}

export function TweetComposer({
  value,
  onChange,
  hasImage,
  onImageToggle,
  hasVideo,
  onVideoToggle,
  isThread,
  onThreadToggle,
  threadLength,
  onThreadLengthChange,
}: TweetComposerProps) {
  const [isFocused, setIsFocused] = useState(false);
  
  const charCount = value.length;
  const maxChars = 280;
  const charPercentage = (charCount / maxChars) * 100;
  
  const getCharCountColor = () => {
    if (charCount > maxChars) return 'text-red-500';
    if (charCount > maxChars * 0.9) return 'text-amber-500';
    return 'text-zinc-500';
  };
  
  const getProgressColor = () => {
    if (charCount > maxChars) return 'stroke-red-500';
    if (charCount > maxChars * 0.9) return 'stroke-amber-500';
    return 'stroke-sky-500';
  };

  return (
    <div className={`
      relative rounded-2xl border-2 transition-all duration-300
      ${isFocused 
        ? 'border-sky-500/50 bg-zinc-900/80 shadow-lg shadow-sky-500/10' 
        : 'border-zinc-700/50 bg-zinc-900/50 hover:border-zinc-600'}
    `}>
      {/* Main textarea */}
      <div className="p-4 pb-2">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder="What's happening? Write your tweet to predict its viral potential..."
          className="w-full min-h-[140px] bg-transparent text-white text-lg placeholder:text-zinc-500 resize-none focus:outline-none leading-relaxed"
        />
      </div>
      
      {/* Media toggles */}
      <div className="px-4 py-3 border-t border-zinc-800 flex items-center justify-between">
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onImageToggle}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              hasImage 
                ? 'bg-sky-500/20 text-sky-400' 
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle image"
          >
            <Image size={20} />
          </button>
          
          <button
            type="button"
            onClick={onVideoToggle}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              hasVideo 
                ? 'bg-emerald-500/20 text-emerald-400' 
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle video"
          >
            <Video size={20} />
          </button>
          
          <button
            type="button"
            onClick={onThreadToggle}
            className={`p-2.5 rounded-full transition-all duration-200 ${
              isThread 
                ? 'bg-violet-500/20 text-violet-400' 
                : 'hover:bg-zinc-800 text-zinc-400 hover:text-zinc-300'
            }`}
            title="Toggle thread mode"
          >
            <MessageCircle size={20} />
          </button>
          
          {isThread && (
            <div className="ml-2 flex items-center gap-2">
              <span className="text-xs text-zinc-500">Thread length:</span>
              <input
                type="number"
                min={2}
                max={25}
                value={threadLength}
                onChange={(e) => onThreadLengthChange(Math.max(2, Math.min(25, parseInt(e.target.value) || 2)))}
                className="w-12 px-2 py-1 text-sm bg-zinc-800 border border-zinc-700 rounded text-white text-center"
              />
            </div>
          )}
        </div>
        
        {/* Character count */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            {charCount > 0 && (
              <>
                <svg className="w-6 h-6 -rotate-90" viewBox="0 0 24 24">
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-zinc-700"
                  />
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    fill="none"
                    strokeWidth="2"
                    strokeDasharray={`${Math.min(charPercentage, 100) * 0.628} 100`}
                    className={`${getProgressColor()} transition-all duration-300`}
                  />
                </svg>
                <span className={`text-sm font-mono ${getCharCountColor()}`}>
                  {charCount > maxChars * 0.8 && (
                    <span>{maxChars - charCount}</span>
                  )}
                </span>
              </>
            )}
          </div>
        </div>
      </div>
      
      {/* Stats bar */}
      {value.length > 0 && (
        <div className="px-4 py-2 border-t border-zinc-800/50 flex items-center gap-4 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Hash size={12} />
            {(value.match(/#\w+/g) || []).length} hashtags
          </span>
          <span className="flex items-center gap-1">
            <AtSign size={12} />
            {(value.match(/@\w+/g) || []).length} mentions
          </span>
          <span className="flex items-center gap-1">
            <Link2 size={12} />
            {(value.match(/https?:\/\/[^\s]+/g) || []).length} links
          </span>
          {hasImage && <span className="text-sky-400">📸 Image</span>}
          {hasVideo && <span className="text-emerald-400">🎬 Video</span>}
          {isThread && <span className="text-violet-400">🧵 Thread ({threadLength})</span>}
        </div>
      )}
    </div>
  );
}

