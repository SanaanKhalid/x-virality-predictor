import { 
  Heart, 
  Repeat2, 
  MessageCircle, 
  Eye, 
  Bookmark, 
  TrendingUp,
  Sparkles,
  Zap
} from 'lucide-react';
import type { EngagementPrediction } from '../lib/virality-engine';
import { formatNumber, getViralityLevel } from '../lib/virality-engine';

interface PredictionDisplayProps {
  prediction: EngagementPrediction;
  isAnalyzing: boolean;
}

export function PredictionDisplay({ prediction, isAnalyzing }: PredictionDisplayProps) {
  const viralityInfo = getViralityLevel(prediction.viralityScore);
  
  const metrics = [
    {
      icon: Eye,
      label: 'Views',
      data: prediction.predictedViews,
      color: 'text-zinc-400',
      bgColor: 'bg-zinc-500/10',
    },
    {
      icon: Heart,
      label: 'Likes',
      data: prediction.predictedLikes,
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/10',
    },
    {
      icon: Repeat2,
      label: 'Reposts',
      data: prediction.predictedReposts,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10',
    },
    {
      icon: MessageCircle,
      label: 'Replies',
      data: prediction.predictedReplies,
      color: 'text-sky-400',
      bgColor: 'bg-sky-500/10',
    },
    {
      icon: Bookmark,
      label: 'Bookmarks',
      data: prediction.predictedBookmarks,
      color: 'text-amber-400',
      bgColor: 'bg-amber-500/10',
    },
  ];

  return (
    <div className={`space-y-6 transition-opacity duration-500 ${isAnalyzing ? 'opacity-50' : 'opacity-100'}`}>
      {/* Virality Score */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-800 border border-zinc-700/50 p-6">
        {/* Background glow */}
        <div 
          className="absolute inset-0 opacity-20"
          style={{
            background: `radial-gradient(circle at 30% 50%, ${
              prediction.viralityScore >= 70 ? '#22c55e' : 
              prediction.viralityScore >= 50 ? '#eab308' : '#ef4444'
            }22 0%, transparent 50%)`,
          }}
        />
        
        <div className="relative flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className={`w-20 h-20 rounded-full border-4 ${
                prediction.viralityScore >= 70 ? 'border-emerald-500' :
                prediction.viralityScore >= 50 ? 'border-yellow-500' : 'border-red-500'
              } flex items-center justify-center bg-zinc-900/80`}>
                <span className="text-2xl font-black text-white">{prediction.viralityScore}</span>
              </div>
              {prediction.viralityScore >= 70 && (
                <Sparkles className="absolute -top-1 -right-1 w-6 h-6 text-emerald-400 animate-pulse" />
              )}
            </div>
            
            <div>
              <h3 className={`text-xl font-bold ${viralityInfo.color}`}>
                {viralityInfo.level}
              </h3>
              <p className="text-sm text-zinc-400 max-w-xs">
                {viralityInfo.description}
              </p>
            </div>
          </div>
          
          <div className="hidden md:block text-right">
            <div className="flex items-center gap-2 text-zinc-400 text-sm">
              <TrendingUp size={16} />
              <span>Weighted Score</span>
            </div>
            <p className="text-2xl font-mono text-white">
              {prediction.weightedScore.toFixed(2)}
            </p>
          </div>
        </div>
        
        {/* Score bar */}
        <div className="mt-6 relative">
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full transition-all duration-1000 ease-out ${
                prediction.viralityScore >= 70 ? 'bg-gradient-to-r from-emerald-600 to-emerald-400' :
                prediction.viralityScore >= 50 ? 'bg-gradient-to-r from-yellow-600 to-yellow-400' :
                'bg-gradient-to-r from-red-600 to-red-400'
              }`}
              style={{ width: `${prediction.viralityScore}%` }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-zinc-600">
            <span>0</span>
            <span>50</span>
            <span>100</span>
          </div>
        </div>
      </div>
      
      {/* Predicted Metrics Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {metrics.map((metric) => (
          <div 
            key={metric.label}
            className={`${metric.bgColor} rounded-xl p-4 border border-zinc-700/30 hover:border-zinc-600/50 transition-all duration-300 hover:scale-105`}
          >
            <div className="flex items-center gap-2 mb-2">
              <metric.icon size={16} className={metric.color} />
              <span className="text-xs text-zinc-400">{metric.label}</span>
            </div>
            <div className="text-xl font-bold text-white">
              {formatNumber(metric.data.expected)}
            </div>
            <div className="text-xs text-zinc-500 mt-1">
              {formatNumber(metric.data.min)} - {formatNumber(metric.data.max)}
            </div>
          </div>
        ))}
      </div>
      
      {/* Engagement Probabilities */}
      <div className="rounded-2xl bg-zinc-900/50 border border-zinc-700/50 p-6">
        <h4 className="flex items-center gap-2 text-sm font-semibold text-zinc-300 mb-4">
          <Zap size={16} className="text-amber-400" />
          Phoenix Model Probabilities
        </h4>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'p(Like)', value: prediction.pFavorite, color: 'rose' },
            { label: 'p(Reply)', value: prediction.pReply, color: 'sky' },
            { label: 'p(Repost)', value: prediction.pRepost, color: 'emerald' },
            { label: 'p(Quote)', value: prediction.pQuote, color: 'violet' },
            { label: 'p(Click)', value: prediction.pClick, color: 'amber' },
            { label: 'p(Profile)', value: prediction.pProfileClick, color: 'cyan' },
            { label: 'p(Bookmark)', value: prediction.pBookmark, color: 'orange' },
            { label: 'p(Follow)', value: prediction.pFollowAuthor, color: 'pink' },
          ].map((prob) => (
            <div key={prob.label} className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-zinc-400">{prob.label}</span>
                <span className="text-zinc-300 font-mono">{(prob.value * 100).toFixed(1)}%</span>
              </div>
              <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full rounded-full bg-${prob.color}-500 transition-all duration-700`}
                  style={{ width: `${prob.value * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
        
        {/* Risk Signals */}
        <div className="mt-6 pt-4 border-t border-zinc-800">
          <h5 className="text-xs font-semibold text-red-400 mb-3 uppercase tracking-wider">
            ⚠️ Negative Signal Risk
          </h5>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'Not Interested', value: prediction.pNotInterested },
              { label: 'Block', value: prediction.pBlock },
              { label: 'Mute', value: prediction.pMute },
              { label: 'Report', value: prediction.pReport },
            ].map((risk) => (
              <div key={risk.label} className="text-center">
                <div className={`text-lg font-bold ${
                  risk.value > 0.1 ? 'text-red-400' : 
                  risk.value > 0.05 ? 'text-amber-400' : 'text-emerald-400'
                }`}>
                  {(risk.value * 100).toFixed(1)}%
                </div>
                <div className="text-xs text-zinc-500">{risk.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

