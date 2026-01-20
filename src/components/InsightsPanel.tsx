import { 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Info,
  ChevronRight,
  BookOpen,
  Lightbulb
} from 'lucide-react';
import type { AlgorithmInsight } from '../lib/virality-engine';

interface InsightsPanelProps {
  insights: AlgorithmInsight[];
}

export function InsightsPanel({ insights }: InsightsPanelProps) {
  const getIcon = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case 'negative':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-amber-400" />;
      default:
        return <Info className="w-5 h-5 text-sky-400" />;
    }
  };
  
  const getBorderColor = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'border-l-emerald-500';
      case 'negative':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      default:
        return 'border-l-sky-500';
    }
  };
  
  const getBgColor = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-500/5 hover:bg-emerald-500/10';
      case 'negative':
        return 'bg-red-500/5 hover:bg-red-500/10';
      case 'warning':
        return 'bg-amber-500/5 hover:bg-amber-500/10';
      default:
        return 'bg-sky-500/5 hover:bg-sky-500/10';
    }
  };
  
  const getImpactBadge = (impact: AlgorithmInsight['impact']) => {
    const colors = {
      high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      low: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    };
    return colors[impact];
  };
  
  // Group insights by type for better organization
  const positiveInsights = insights.filter(i => i.type === 'positive');
  const warningInsights = insights.filter(i => i.type === 'warning' || i.type === 'negative');
  const neutralInsights = insights.filter(i => i.type === 'neutral');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-violet-500/20">
          <Lightbulb className="w-5 h-5 text-violet-400" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white">Algorithm Insights</h3>
          <p className="text-sm text-zinc-400">Based on X's Phoenix ranking model</p>
        </div>
      </div>
      
      {/* Positive signals */}
      {positiveInsights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
            <CheckCircle2 size={12} />
            Working in your favor ({positiveInsights.length})
          </h4>
          <div className="space-y-2">
            {positiveInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Warnings */}
      {warningInsights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider flex items-center gap-2">
            <AlertTriangle size={12} />
            Watch out ({warningInsights.length})
          </h4>
          <div className="space-y-2">
            {warningInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Suggestions */}
      {neutralInsights.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-semibold text-sky-400 uppercase tracking-wider flex items-center gap-2">
            <Info size={12} />
            Optimization suggestions ({neutralInsights.length})
          </h4>
          <div className="space-y-2">
            {neutralInsights.map((insight, index) => (
              <InsightCard key={index} insight={insight} />
            ))}
          </div>
        </div>
      )}
      
      {/* Algorithm reference */}
      <div className="mt-6 p-4 rounded-xl bg-zinc-800/30 border border-zinc-700/30">
        <div className="flex items-start gap-3">
          <BookOpen className="w-5 h-5 text-zinc-400 mt-0.5 shrink-0" />
          <div className="space-y-2 text-sm">
            <p className="text-zinc-300 font-medium">Understanding the Algorithm</p>
            <p className="text-zinc-500 text-xs leading-relaxed">
              These insights are derived from the open-sourced X algorithm's Phoenix ranking model 
              and weighted scorer. The model predicts engagement signals (likes, reposts, replies) 
              using a Grok transformer, and naturally more engagement equals higher visibility.
            </p>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-zinc-400">phoenix_scorer.rs</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-zinc-400">weighted_scorer.rs</span>
              <span className="text-xs px-2 py-1 rounded bg-zinc-700/50 text-zinc-400">recsys_model.py</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightCard({ insight }: { insight: AlgorithmInsight }) {
  const getIcon = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return <CheckCircle2 className="w-4 h-4 text-emerald-400" />;
      case 'negative':
        return <XCircle className="w-4 h-4 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-amber-400" />;
      default:
        return <Info className="w-4 h-4 text-sky-400" />;
    }
  };
  
  const getBorderColor = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'border-l-emerald-500';
      case 'negative':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-amber-500';
      default:
        return 'border-l-sky-500';
    }
  };
  
  const getBgColor = (type: AlgorithmInsight['type']) => {
    switch (type) {
      case 'positive':
        return 'bg-emerald-500/5 hover:bg-emerald-500/10';
      case 'negative':
        return 'bg-red-500/5 hover:bg-red-500/10';
      case 'warning':
        return 'bg-amber-500/5 hover:bg-amber-500/10';
      default:
        return 'bg-sky-500/5 hover:bg-sky-500/10';
    }
  };
  
  const getImpactBadge = (impact: AlgorithmInsight['impact']) => {
    const colors = {
      high: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
      medium: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      low: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30',
    };
    return colors[impact];
  };

  return (
    <div 
      className={`
        p-4 rounded-lg border-l-4 ${getBorderColor(insight.type)} ${getBgColor(insight.type)}
        transition-all duration-200
      `}
    >
      <div className="flex items-start gap-3">
        <div className="mt-0.5 shrink-0">
          {getIcon(insight.type)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h5 className="font-medium text-white text-sm">{insight.title}</h5>
            <span className={`text-xs px-1.5 py-0.5 rounded border ${getImpactBadge(insight.impact)}`}>
              {insight.impact}
            </span>
          </div>
          <p className="text-sm text-zinc-400 mt-1 leading-relaxed">
            {insight.description}
          </p>
          {insight.algorithmReference && (
            <div className="mt-2 flex items-center gap-1 text-xs text-zinc-500">
              <ChevronRight size={12} />
              <code className="font-mono text-violet-400">{insight.algorithmReference}</code>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

