import { Users, UserCheck, Activity, Calendar, BadgeCheck, Target, Clock } from 'lucide-react';
import type { UserProfile } from '../lib/virality-engine';

interface UserProfileFormProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export function UserProfileForm({ profile, onChange }: UserProfileFormProps) {
  const updateField = <K extends keyof UserProfile>(field: K, value: UserProfile[K]) => {
    onChange({ ...profile, [field]: value });
  };

  const formatFollowerInput = (value: string): number => {
    // Handle K and M suffixes
    const cleanValue = value.toLowerCase().replace(/,/g, '');
    if (cleanValue.endsWith('k')) {
      return parseFloat(cleanValue) * 1000;
    }
    if (cleanValue.endsWith('m')) {
      return parseFloat(cleanValue) * 1000000;
    }
    return parseInt(cleanValue) || 0;
  };

  return (
    <div className="rounded-2xl bg-zinc-900/50 border border-zinc-700/50 p-6">
      <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
        <Target className="w-5 h-5 text-violet-400" />
        Your Profile
      </h3>
      <p className="text-sm text-zinc-400 mb-6">
        Adjust these settings to get more accurate predictions based on your account.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Followers */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <Users size={14} className="text-sky-400" />
            Followers
          </label>
          <input
            type="text"
            value={profile.followers >= 1000000 
              ? `${(profile.followers / 1000000).toFixed(1)}M`
              : profile.followers >= 1000 
                ? `${(profile.followers / 1000).toFixed(1)}K`
                : profile.followers.toString()
            }
            onChange={(e) => updateField('followers', formatFollowerInput(e.target.value))}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="e.g., 10K, 1.5M"
          />
        </div>
        
        {/* Following */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <UserCheck size={14} className="text-emerald-400" />
            Following
          </label>
          <input
            type="text"
            value={profile.following >= 1000 
              ? `${(profile.following / 1000).toFixed(1)}K`
              : profile.following.toString()
            }
            onChange={(e) => updateField('following', formatFollowerInput(e.target.value))}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="e.g., 500, 2K"
          />
        </div>
        
        {/* Engagement Rate */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <Activity size={14} className="text-rose-400" />
            Avg. Engagement Rate (%)
          </label>
          <input
            type="number"
            step="0.1"
            min="0"
            max="100"
            value={profile.avgEngagementRate}
            onChange={(e) => updateField('avgEngagementRate', parseFloat(e.target.value) || 0)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="e.g., 2.5"
          />
        </div>
        
        {/* Account Age */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <Calendar size={14} className="text-amber-400" />
            Account Age (days)
          </label>
          <input
            type="number"
            min="1"
            value={profile.accountAgeDays}
            onChange={(e) => updateField('accountAgeDays', parseInt(e.target.value) || 1)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
            placeholder="e.g., 365"
          />
        </div>
        
        {/* Niche */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <Target size={14} className="text-violet-400" />
            Niche/Topic
          </label>
          <select
            value={profile.niche}
            onChange={(e) => updateField('niche', e.target.value)}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="tech">Tech / Programming</option>
            <option value="ai">AI / Machine Learning</option>
            <option value="crypto">Crypto / Web3</option>
            <option value="startup">Startups / Entrepreneurship</option>
            <option value="marketing">Marketing / Growth</option>
            <option value="design">Design / Creative</option>
            <option value="finance">Finance / Investing</option>
            <option value="health">Health / Fitness</option>
            <option value="lifestyle">Lifestyle / Personal</option>
            <option value="news">News / Current Events</option>
            <option value="entertainment">Entertainment</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        {/* Post Frequency */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 text-sm text-zinc-300">
            <Clock size={14} className="text-cyan-400" />
            Post Frequency
          </label>
          <select
            value={profile.postFrequency}
            onChange={(e) => updateField('postFrequency', e.target.value as 'low' | 'medium' | 'high')}
            className="w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-sky-500 transition-colors"
          >
            <option value="low">Low ({"<"} 3/week)</option>
            <option value="medium">Medium (3-10/week)</option>
            <option value="high">High ({">"} 10/week)</option>
          </select>
        </div>
      </div>
      
      {/* Verified checkbox */}
      <div className="mt-4 flex items-center gap-3">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={profile.isVerified}
            onChange={(e) => updateField('isVerified', e.target.checked)}
            className="sr-only peer"
          />
          <div className="w-9 h-5 bg-zinc-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-sky-500"></div>
        </label>
        <span className="flex items-center gap-2 text-sm text-zinc-300">
          <BadgeCheck size={14} className="text-sky-400" />
          Verified Account (Blue/Gold checkmark)
        </span>
      </div>
      
      {/* Profile summary */}
      <div className="mt-6 p-3 bg-zinc-800/50 rounded-lg">
        <p className="text-xs text-zinc-400">
          <span className="text-zinc-300 font-medium">Profile Summary:</span>{' '}
          {profile.followers.toLocaleString()} followers in {profile.niche} niche with{' '}
          {profile.avgEngagementRate}% avg engagement. 
          {profile.isVerified && ' ✓ Verified.'}
        </p>
      </div>
    </div>
  );
}

