import { useState, useEffect, useMemo } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { Flame, Sparkles, Zap, ChevronDown, ChevronUp, Github } from 'lucide-react';

import { TweetComposer } from '../components/TweetComposer';
import { PredictionDisplay } from '../components/PredictionDisplay';
import { InsightsPanel } from '../components/InsightsPanel';
import { UserProfileForm } from '../components/UserProfileForm';
import { AccuracyInfoDialog } from '../components/AccuracyInfoDialog';
import { 
  analyzeTweet, 
  predictEngagement, 
  generateInsights,
  type UserProfile,
} from '../lib/virality-engine';

export const Route = createFileRoute('/')({ component: App });

const DEFAULT_PROFILE: UserProfile = {
  followers: 5000,
  following: 500,
  avgEngagementRate: 2.5,
  accountAgeDays: 365,
  isVerified: false,
  niche: 'tech',
  postFrequency: 'medium',
};

function App() {
  const [tweetText, setTweetText] = useState('');
  const [hasImage, setHasImage] = useState(false);
  const [hasVideo, setHasVideo] = useState(false);
  const [isThread, setIsThread] = useState(false);
  const [threadLength, setThreadLength] = useState(3);
  const [profile, setProfile] = useState<UserProfile>(DEFAULT_PROFILE);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // Debounced analysis
  const [debouncedText, setDebouncedText] = useState('');
  
  useEffect(() => {
    setIsAnalyzing(true);
    const timer = setTimeout(() => {
      setDebouncedText(tweetText);
      setIsAnalyzing(false);
    }, 300);
    return () => clearTimeout(timer);
  }, [tweetText, hasImage, hasVideo, isThread, threadLength, profile]);
  
  // Memoized predictions
  const { prediction, insights } = useMemo(() => {
    if (!debouncedText.trim()) {
      return { prediction: null, insights: [] };
    }
    
    const analysis = analyzeTweet(debouncedText, { 
      hasVideo, 
      hasImage, 
      isThread, 
      threadLength 
    });
    const prediction = predictEngagement(analysis, profile);
    const insights = generateInsights(analysis, prediction);
    
    return { prediction, insights };
  }, [debouncedText, hasImage, hasVideo, isThread, threadLength, profile]);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero gradient */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-sky-600/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-emerald-600/5 rounded-full blur-[120px]" />
      </div>
      
      <div className="relative">
        {/* Header */}
        <header className="border-b border-zinc-800/50 backdrop-blur-xl bg-zinc-900/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-sky-500 flex items-center justify-center">
                    <Flame className="w-6 h-6 text-white" />
                  </div>
                  <Sparkles className="absolute -top-1 -right-1 w-4 h-4 text-amber-400" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-white tracking-tight">
                    X Virality Predictor
                  </h1>
                  <p className="text-xs text-zinc-500">Powered by Phoenix Algorithm Analysis</p>
                </div>
              </div>
              
              <a
                href="https://github.com/xai-org/x-algorithm"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm transition-colors"
              >
                <Github size={16} />
                <span className="hidden sm:inline">View Algorithm</span>
              </a>
            </div>
          </div>
        </header>
        
        {/* Main content */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          {/* Intro */}
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Will Your Tweet Go{' '}
              <span className="bg-gradient-to-r from-orange-400 via-rose-500 to-violet-500 bg-clip-text text-transparent">
                Viral
              </span>
              ?
            </h2>
            <p className="text-zinc-400 max-w-2xl mx-auto">
              Analyze your tweet against X's Phoenix ranking algorithm. Get predicted engagement 
              metrics and actionable insights based on the actual open-sourced algorithm.
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left column - Composer */}
            <div className="space-y-6">
              <TweetComposer
                value={tweetText}
                onChange={setTweetText}
                hasImage={hasImage}
                onImageToggle={() => {
                  setHasImage(!hasImage);
                  if (!hasImage) setHasVideo(false);
                }}
                hasVideo={hasVideo}
                onVideoToggle={() => {
                  setHasVideo(!hasVideo);
                  if (!hasVideo) setHasImage(false);
                }}
                isThread={isThread}
                onThreadToggle={() => setIsThread(!isThread)}
                threadLength={threadLength}
                onThreadLengthChange={setThreadLength}
              />
              
              {/* Profile settings collapsible */}
              <div className="rounded-2xl border border-zinc-700/50 overflow-hidden">
                <button
                  type="button"
                  onClick={() => setShowProfileSettings(!showProfileSettings)}
                  className="w-full px-4 py-3 bg-zinc-900/50 hover:bg-zinc-800/50 transition-colors flex items-center justify-between"
                >
                  <span className="text-sm font-medium text-zinc-300 flex items-center gap-2">
                    <Zap size={16} className="text-amber-400" />
                    Profile Settings
                    <span className="text-xs text-zinc-500">
                      ({profile.followers.toLocaleString()} followers)
                    </span>
                  </span>
                  {showProfileSettings ? (
                    <ChevronUp size={16} className="text-zinc-400" />
                  ) : (
                    <ChevronDown size={16} className="text-zinc-400" />
                  )}
                </button>
                
                {showProfileSettings && (
                  <div className="border-t border-zinc-800">
                    <UserProfileForm profile={profile} onChange={setProfile} />
                  </div>
                )}
              </div>
              
              {/* Algorithm tips */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-violet-500/10 to-sky-500/10 border border-violet-500/20">
                <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                  <Sparkles size={14} className="text-violet-400" />
                  Quick Algorithm Tips
                </h4>
                <ul className="text-xs text-zinc-400 space-y-1.5">
                  <li>• <strong className="text-zinc-300">Replies = 27x likes</strong> in ranking weight</li>
                  <li>• <strong className="text-zinc-300">Bookmarks = 50x multiplier</strong> ("Save" is gold)</li>
                  <li>• <strong className="text-zinc-300">Links = -75% reach</strong> (keep in bio/reply)</li>
                  <li>• <strong className="text-zinc-300">Video demos are non-negotiable</strong> for max reach</li>
                  <li>• <strong className="text-zinc-300">Reply to yourself fast</strong> for 75x signal boost</li>
                </ul>
              </div>
            </div>
            
            {/* Right column - Predictions */}
            <div className="space-y-6">
              {prediction ? (
                <>
                  <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="text-sm font-semibold text-amber-300">
                        Disclaimer
                      </div>
                      <AccuracyInfoDialog />
                    </div>
                    <p className="mt-1 text-xs leading-relaxed text-zinc-300">
                      The open-sourced <span className="font-semibold">X algorithm</span> repo
                      does not include production model weights, embedding tables, or full
                      ranking/retrieval infrastructure. Results shown here are{" "}
                      <span className="font-semibold">not fully accurate predictions</span>
                      {" "}—they’re a best-effort simulation to demonstrate{" "}
                      <span className="font-semibold">how</span> the algorithm’s scoring
                      signals and weighting work.
                    </p>
                  </div>
                  <PredictionDisplay 
                    prediction={prediction} 
                    isAnalyzing={isAnalyzing}
                  />
                  <InsightsPanel insights={insights} />
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full min-h-[400px] rounded-2xl border-2 border-dashed border-zinc-700/50 bg-zinc-900/20">
                  <div className="text-center p-8">
                    <div className="w-16 h-16 rounded-full bg-zinc-800 flex items-center justify-center mx-auto mb-4">
                      <Flame className="w-8 h-8 text-zinc-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-zinc-400 mb-2">
                      Write Your Tweet
                    </h3>
                    <p className="text-sm text-zinc-500 max-w-xs">
                      Start typing in the composer to see real-time virality predictions 
                      based on X's algorithm
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Algorithm breakdown footer */}
          <div className="mt-16 pt-8 border-t border-zinc-800">
            <div className="text-center mb-8">
              <h3 className="text-xl font-semibold text-white mb-2">
                How the X Algorithm Works
              </h3>
              <p className="text-sm text-zinc-400 max-w-2xl mx-auto">
                Based on the open-sourced Phoenix ranking model from x-algorithm
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {[
                {
                  title: 'Phoenix Scorer',
                  description: 'Grok transformer predicts engagement probabilities for likes, replies, reposts, and 15+ other actions',
                  file: 'phoenix_scorer.rs',
                  color: 'violet',
                },
                {
                  title: 'Weighted Scorer',
                  description: 'Combines predicted signals with different weights. Replies (27x), bookmarks (50x), blocks (-74x)',
                  file: 'weighted_scorer.rs',
                  color: 'sky',
                },
                {
                  title: 'Content Analysis',
                  description: 'Video/image detection, dwell time prediction, link penalties, and engagement hooks',
                  file: 'recsys_model.py',
                  color: 'emerald',
                },
                {
                  title: 'Ranking Output',
                  description: 'Final score determines feed position. Higher engagement probability = more visibility',
                  file: 'runners.py',
                  color: 'amber',
                },
              ].map((item) => (
                <div 
                  key={item.title}
                  className={`p-5 rounded-xl bg-zinc-900/50 border border-zinc-700/50 hover:border-${item.color}-500/30 transition-colors`}
                >
                  <h4 className={`font-semibold text-${item.color}-400 mb-2`}>{item.title}</h4>
                  <p className="text-sm text-zinc-400 mb-3">{item.description}</p>
                  <code className="text-xs px-2 py-1 bg-zinc-800 rounded text-zinc-500">
                    {item.file}
                  </code>
                </div>
              ))}
            </div>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="border-t border-zinc-800 mt-16 py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-sm text-zinc-500">
              Built from the open-sourced X algorithm. Predictions are estimates based on algorithm structure and incomplete public information (e.g. missing weights/embeddings).
            </p>
            <p className="text-xs text-zinc-600 mt-2">
              Not affiliated with X Corp. For educational purposes only.
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
