/**
 * X Algorithm Virality Prediction Engine
 * 
 * Based on the open-sourced X algorithm from x-algorithm repository.
 * This implements a simplified version of the Phoenix scoring model.
 * 
 * Key scoring factors from the algorithm:
 * - Engagement signals (favorite, reply, retweet, quote, share)
 * - Dwell time and video quality views
 * - Negative signals (block, mute, report, not_interested)
 * - Author diversity and out-of-network penalties
 * - Content type multipliers (video, images, links)
 */

// Scoring weights based on X algorithm's weighted_scorer.rs
// Note: Actual weights are not disclosed, these are estimations based on the algorithm structure
export const WEIGHTS = {
  // Positive engagement signals
  FAVORITE_WEIGHT: 1.0,
  REPLY_WEIGHT: 27.0,  // Replies are heavily weighted
  RETWEET_WEIGHT: 1.0,
  QUOTE_WEIGHT: 1.0,
  SHARE_WEIGHT: 1.0,
  SHARE_VIA_DM_WEIGHT: 1.0,
  SHARE_VIA_COPY_LINK_WEIGHT: 1.0,
  
  // Engagement depth signals
  PHOTO_EXPAND_WEIGHT: 0.5,
  CLICK_WEIGHT: 0.5,
  PROFILE_CLICK_WEIGHT: 1.0,
  DWELL_WEIGHT: 1.0,
  CONT_DWELL_TIME_WEIGHT: 0.25,
  VQV_WEIGHT: 0.5,  // Video Quality View
  QUOTED_CLICK_WEIGHT: 0.5,
  FOLLOW_AUTHOR_WEIGHT: 4.0,
  
  // Negative signals (these reduce visibility significantly)
  NOT_INTERESTED_WEIGHT: -74.0,
  BLOCK_AUTHOR_WEIGHT: -74.0,
  MUTE_AUTHOR_WEIGHT: -74.0,
  REPORT_WEIGHT: -369.0,  // Reports are extremely punishing
  
  // Content type multipliers
  VIDEO_MULTIPLIER: 2.0,
  IMAGE_MULTIPLIER: 1.5,
  LINK_PENALTY: 0.25,  // -75% for outbound links ("Link Tax")
  
  // Other factors
  BOOKMARK_MULTIPLIER: 50.0,  // Bookmarks are gold (50x)
  REPLY_CHAIN_MULTIPLIER: 75.0,  // Reply + response is strongest signal
  
  // Network factors
  OON_WEIGHT_FACTOR: 0.7,  // Out-of-network penalty
  AUTHOR_DIVERSITY_DECAY: 0.85,
  AUTHOR_DIVERSITY_FLOOR: 0.3,
} as const;

// Minimum video duration for VQV scoring (in ms)
export const MIN_VIDEO_DURATION_MS = 6000;

export interface TweetAnalysis {
  text: string;
  hasVideo: boolean;
  hasImage: boolean;
  hasLink: boolean;
  hasHashtags: boolean;
  hashtagCount: number;
  hasQuestion: boolean;
  hasCTA: boolean;
  wordCount: number;
  charCount: number;
  isThread: boolean;
  threadLength: number;
  hasEmoji: boolean;
  emojiCount: number;
  hasMention: boolean;
  mentionCount: number;
  isControversial: boolean;
  isNiche: boolean;
  hasHook: boolean;
  hasAbsurdity: boolean;
}

export interface EngagementPrediction {
  viralityScore: number;  // 0-100
  predictedLikes: { min: number; max: number; expected: number };
  predictedReposts: { min: number; max: number; expected: number };
  predictedReplies: { min: number; max: number; expected: number };
  predictedViews: { min: number; max: number; expected: number };
  predictedBookmarks: { min: number; max: number; expected: number };
  
  // Probability scores (0-1) like Phoenix model output
  pFavorite: number;
  pReply: number;
  pRepost: number;
  pQuote: number;
  pClick: number;
  pProfileClick: number;
  pShare: number;
  pBookmark: number;
  pDwell: number;
  pFollowAuthor: number;
  
  // Risk factors
  pNotInterested: number;
  pBlock: number;
  pMute: number;
  pReport: number;
  
  // Weighted combined score
  weightedScore: number;
  normalizedScore: number;
}

export interface AlgorithmInsight {
  type: 'positive' | 'negative' | 'neutral' | 'warning';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  algorithmReference?: string;
}

export interface UserProfile {
  followers: number;
  following: number;
  avgEngagementRate: number;
  accountAgeDays: number;
  isVerified: boolean;
  niche: string;
  postFrequency: 'low' | 'medium' | 'high';
}

// Analyze tweet content
export function analyzeTweet(text: string, options?: { hasVideo?: boolean; hasImage?: boolean; isThread?: boolean; threadLength?: number }): TweetAnalysis {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hashtagRegex = /#\w+/g;
  const mentionRegex = /@\w+/g;
  const emojiRegex = /[\u{1F600}-\u{1F64F}]|[\u{1F300}-\u{1F5FF}]|[\u{1F680}-\u{1F6FF}]|[\u{1F1E0}-\u{1F1FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu;
  
  const hashtags = text.match(hashtagRegex) || [];
  const mentions = text.match(mentionRegex) || [];
  const emojis = text.match(emojiRegex) || [];
  const urls = text.match(urlRegex) || [];
  
  // Detect hooks and patterns
  const hookPatterns = [
    /^(here's|here is|this is|i just|just|wow|breaking|unpopular opinion|hot take|thread|🧵)/i,
    /^(the truth about|nobody talks about|what they don't tell you|secret|revealed)/i,
    /^(stop|don't|never|always|you need to|you have to|you should)/i,
    /^\d+\s*(things|ways|reasons|tips|tricks|secrets|lessons)/i,
  ];
  
  const absurdityPatterns = [
    /fireplace|warmer|bizarre|crazy|insane|wild|unhinged/i,
    /🔥|💀|😭|🤯|😱/,
  ];
  
  const controversialPatterns = [
    /politics|political|democrat|republican|liberal|conservative/i,
    /controversy|controversial|debate|fight|war|hate|love it or hate/i,
  ];
  
  const ctaPatterns = [
    /follow|retweet|rt|share|like|comment|reply|subscribe|join|click|tap|check out/i,
    /link in bio|dm me|let me know|what do you think|thoughts\?/i,
  ];
  
  const hasHook = hookPatterns.some(p => p.test(text));
  const hasAbsurdity = absurdityPatterns.some(p => p.test(text));
  const isControversial = controversialPatterns.some(p => p.test(text));
  const hasCTA = ctaPatterns.some(p => p.test(text));
  const hasQuestion = text.includes('?');
  
  // Word count (excluding URLs)
  const textWithoutUrls = text.replace(urlRegex, '');
  const words = textWithoutUrls.trim().split(/\s+/).filter(w => w.length > 0);
  
  return {
    text,
    hasVideo: options?.hasVideo ?? false,
    hasImage: options?.hasImage ?? false,
    hasLink: urls.length > 0,
    hasHashtags: hashtags.length > 0,
    hashtagCount: hashtags.length,
    hasQuestion,
    hasCTA,
    wordCount: words.length,
    charCount: text.length,
    isThread: options?.isThread ?? false,
    threadLength: options?.threadLength ?? 1,
    hasEmoji: emojis.length > 0,
    emojiCount: emojis.length,
    hasMention: mentions.length > 0,
    mentionCount: mentions.length,
    isControversial,
    isNiche: false, // Would need more context
    hasHook,
    hasAbsurdity,
  };
}

// Calculate engagement probabilities based on X algorithm
export function predictEngagement(
  analysis: TweetAnalysis,
  profile: UserProfile
): EngagementPrediction {
  // Base probabilities influenced by follower count and engagement rate
  const baseMultiplier = Math.log10(Math.max(profile.followers, 100)) / 6;
  const engagementMultiplier = profile.avgEngagementRate / 2;
  
  // Content quality signals
  let qualityScore = 0.5;
  
  // Hook and curiosity (per algorithm: curiosity hooks spike initial dwell)
  if (analysis.hasHook) qualityScore += 0.15;
  if (analysis.hasAbsurdity) qualityScore += 0.1;
  if (analysis.hasQuestion) qualityScore += 0.08; // Conversation bait
  if (analysis.hasCTA) qualityScore += 0.05;
  
  // Optimal length (not too short, not too long)
  const optimalWords = analysis.wordCount >= 10 && analysis.wordCount <= 50;
  if (optimalWords) qualityScore += 0.1;
  
  // Media content (video demos spike dwell + p(video_view))
  if (analysis.hasVideo) qualityScore *= WEIGHTS.VIDEO_MULTIPLIER;
  else if (analysis.hasImage) qualityScore *= WEIGHTS.IMAGE_MULTIPLIER;
  
  // Link penalty (Link Tax: outbound links = -400% reach)
  if (analysis.hasLink) qualityScore *= WEIGHTS.LINK_PENALTY;
  
  // Thread bonus
  if (analysis.isThread && analysis.threadLength > 1) {
    qualityScore *= 1 + (analysis.threadLength * 0.1);
  }
  
  // Hashtag optimization (1-2 hashtags is optimal)
  if (analysis.hashtagCount >= 1 && analysis.hashtagCount <= 2) {
    qualityScore += 0.05;
  } else if (analysis.hashtagCount > 3) {
    qualityScore -= 0.1; // Too many hashtags looks spammy
  }
  
  // Calculate individual probabilities (like Phoenix model's action predictions)
  const baseProbability = Math.min(qualityScore * baseMultiplier * engagementMultiplier, 0.95);
  
  // Engagement probabilities
  const pFavorite = Math.min(baseProbability * 1.0, 0.95);
  const pReply = Math.min(baseProbability * 0.15 * (analysis.hasQuestion ? 2.5 : 1), 0.7);
  const pRepost = Math.min(baseProbability * 0.08, 0.5);
  const pQuote = Math.min(baseProbability * 0.03, 0.3);
  const pClick = Math.min(baseProbability * 0.4, 0.8);
  const pProfileClick = Math.min(baseProbability * 0.12, 0.5);
  const pShare = Math.min(baseProbability * 0.05, 0.3);
  const pBookmark = Math.min(baseProbability * 0.04, 0.25);
  const pDwell = Math.min(baseProbability * 0.6 * (analysis.hasVideo ? 1.5 : 1), 0.9);
  const pFollowAuthor = Math.min(baseProbability * 0.02, 0.15);
  
  // Risk probabilities (lower is better)
  let pNotInterested = 0.05;
  let pBlock = 0.01;
  let pMute = 0.02;
  let pReport = 0.005;
  
  // Controversial content increases negative signals
  if (analysis.isControversial) {
    pNotInterested += 0.15;
    pBlock += 0.05;
    pMute += 0.08;
    pReport += 0.02;
  }
  
  // Calculate weighted score (based on weighted_scorer.rs)
  const positiveScore = 
    pFavorite * WEIGHTS.FAVORITE_WEIGHT +
    pReply * WEIGHTS.REPLY_WEIGHT +
    pRepost * WEIGHTS.RETWEET_WEIGHT +
    pQuote * WEIGHTS.QUOTE_WEIGHT +
    pClick * WEIGHTS.CLICK_WEIGHT +
    pProfileClick * WEIGHTS.PROFILE_CLICK_WEIGHT +
    pShare * WEIGHTS.SHARE_WEIGHT +
    pDwell * WEIGHTS.DWELL_WEIGHT +
    pFollowAuthor * WEIGHTS.FOLLOW_AUTHOR_WEIGHT +
    pBookmark * WEIGHTS.BOOKMARK_MULTIPLIER * 0.01; // Bookmarks are gold
  
  const negativeScore = 
    pNotInterested * Math.abs(WEIGHTS.NOT_INTERESTED_WEIGHT) +
    pBlock * Math.abs(WEIGHTS.BLOCK_AUTHOR_WEIGHT) +
    pMute * Math.abs(WEIGHTS.MUTE_AUTHOR_WEIGHT) +
    pReport * Math.abs(WEIGHTS.REPORT_WEIGHT);
  
  const weightedScore = positiveScore - negativeScore;
  
  // Normalize to 0-100 virality score
  const maxPossibleScore = 100;
  const normalizedScore = Math.max(0, Math.min(100, (weightedScore / maxPossibleScore) * 100 + 50));
  
  // Predict actual numbers based on follower count and virality
  const viralityFactor = normalizedScore / 100;
  const baseViews = profile.followers * (0.1 + viralityFactor * 0.5);
  
  // Views can go viral beyond follower count
  const viralMultiplier = viralityFactor > 0.7 ? Math.pow(viralityFactor, 3) * 10 : 1;
  
  const expectedViews = Math.round(baseViews * viralMultiplier);
  const expectedLikes = Math.round(expectedViews * pFavorite * 0.05);
  const expectedReposts = Math.round(expectedViews * pRepost * 0.02);
  const expectedReplies = Math.round(expectedViews * pReply * 0.01);
  const expectedBookmarks = Math.round(expectedViews * pBookmark * 0.005);
  
  // Calculate ranges (±30-50% variance)
  const variance = 0.4;
  
  return {
    viralityScore: Math.round(normalizedScore),
    
    predictedLikes: {
      min: Math.round(expectedLikes * (1 - variance)),
      max: Math.round(expectedLikes * (1 + variance)),
      expected: expectedLikes,
    },
    predictedReposts: {
      min: Math.round(expectedReposts * (1 - variance)),
      max: Math.round(expectedReposts * (1 + variance)),
      expected: expectedReposts,
    },
    predictedReplies: {
      min: Math.round(expectedReplies * (1 - variance)),
      max: Math.round(expectedReplies * (1 + variance)),
      expected: expectedReplies,
    },
    predictedViews: {
      min: Math.round(expectedViews * (1 - variance)),
      max: Math.round(expectedViews * (1 + variance)),
      expected: expectedViews,
    },
    predictedBookmarks: {
      min: Math.round(expectedBookmarks * (1 - variance)),
      max: Math.round(expectedBookmarks * (1 + variance)),
      expected: expectedBookmarks,
    },
    
    pFavorite,
    pReply,
    pRepost,
    pQuote,
    pClick,
    pProfileClick,
    pShare,
    pBookmark,
    pDwell,
    pFollowAuthor,
    
    pNotInterested,
    pBlock,
    pMute,
    pReport,
    
    weightedScore,
    normalizedScore,
  };
}

// Generate algorithm insights
export function generateInsights(
  analysis: TweetAnalysis,
  prediction: EngagementPrediction
): AlgorithmInsight[] {
  const insights: AlgorithmInsight[] = [];
  
  // Hook detection
  if (analysis.hasHook) {
    insights.push({
      type: 'positive',
      title: 'Strong Hook Detected',
      description: 'Your opening creates curiosity. Hooks spike initial dwell time, triggering the engagement snowball.',
      impact: 'high',
      algorithmReference: 'Dwell score + early engagement signals',
    });
  } else {
    insights.push({
      type: 'neutral',
      title: 'Consider a Stronger Hook',
      description: 'Start with a pattern interrupt, number, or provocative statement to stop the scroll.',
      impact: 'high',
    });
  }
  
  // Video content
  if (analysis.hasVideo) {
    insights.push({
      type: 'positive',
      title: 'Video Content Bonus',
      description: 'Videos spike dwell time and p(video_view). Looping clips are especially effective for the algorithm.',
      impact: 'high',
      algorithmReference: 'VQV_WEIGHT applies when video > 6s duration',
    });
  } else if (!analysis.hasImage) {
    insights.push({
      type: 'warning',
      title: 'Text-Only May Get Buried',
      description: 'The algorithm favors media-rich content. Video demos are non-negotiable for maximum reach.',
      impact: 'high',
      algorithmReference: 'Photo expand and VQV scores missing',
    });
  }
  
  // Link penalty
  if (analysis.hasLink) {
    insights.push({
      type: 'negative',
      title: 'Link Tax Applied',
      description: 'Outbound links reduce reach by ~75%. Move links to bio or first reply instead.',
      impact: 'high',
      algorithmReference: 'Algorithm penalizes exits from platform',
    });
  }
  
  // Conversation bait
  if (analysis.hasQuestion) {
    insights.push({
      type: 'positive',
      title: 'Conversation Bait Detected',
      description: 'Questions drive replies, and reply_score has massive weight (27x). Smart move.',
      impact: 'high',
      algorithmReference: 'REPLY_WEIGHT is 27x FAVORITE_WEIGHT',
    });
  } else {
    insights.push({
      type: 'neutral',
      title: 'Add Conversation Bait',
      description: 'End with a question or invite opinions. Replies weight 27x more than likes in ranking.',
      impact: 'high',
    });
  }
  
  // Controversial content warning
  if (analysis.isControversial) {
    insights.push({
      type: 'warning',
      title: 'Polarizing Content Risk',
      description: 'Controversial takes can hijack your embeddings toward drama clusters. This affects future distribution permanently.',
      impact: 'high',
      algorithmReference: 'SimCluster lock-in from negative signals',
    });
  }
  
  // Hashtag analysis
  if (analysis.hashtagCount === 0) {
    insights.push({
      type: 'neutral',
      title: 'Consider 1-2 Hashtags',
      description: 'Strategic hashtags help discovery. Avoid more than 2 as it triggers spam signals.',
      impact: 'low',
    });
  } else if (analysis.hashtagCount > 3) {
    insights.push({
      type: 'negative',
      title: 'Too Many Hashtags',
      description: 'Excessive hashtags signal spam. Reduce to 1-2 relevant ones max.',
      impact: 'medium',
    });
  }
  
  // Absurdity bonus
  if (analysis.hasAbsurdity) {
    insights.push({
      type: 'positive',
      title: 'Absurdity Factor',
      description: 'Unusual/absurd content spikes initial dwell and sets up the engagement snowball.',
      impact: 'medium',
      algorithmReference: 'Dwell time multiplier',
    });
  }
  
  // Thread analysis
  if (analysis.isThread && analysis.threadLength > 1) {
    insights.push({
      type: 'positive',
      title: 'Thread Format',
      description: 'Threads increase total dwell time and create multiple engagement touchpoints.',
      impact: 'medium',
    });
  }
  
  // Mention analysis
  if (analysis.mentionCount > 0) {
    insights.push({
      type: 'positive',
      title: 'Power User Potential',
      description: 'Engaging power users can amplify your signal disproportionately. Add real value in their threads.',
      impact: 'medium',
      algorithmReference: 'Network effects through engaged followers',
    });
  }
  
  // Reply strategy reminder
  insights.push({
    type: 'neutral',
    title: 'Reply to Your Own Post Fast',
    description: 'Reply to your own tweet immediately. A reply + your response is the strongest signal (75x) and trains the transformer on your content.',
    impact: 'high',
    algorithmReference: 'REPLY_CHAIN_MULTIPLIER in scoring',
  });
  
  // Negative signal warning
  if (prediction.pNotInterested > 0.1 || prediction.pBlock > 0.03) {
    insights.push({
      type: 'warning',
      title: 'High Negative Signal Risk',
      description: 'This content may trigger blocks/mutes. Negatives hit small accounts way harder - one salty wave = semi-permanent suppression.',
      impact: 'high',
      algorithmReference: 'BLOCK_AUTHOR_WEIGHT: -74, REPORT_WEIGHT: -369',
    });
  }
  
  // Bookmark optimization
  if (prediction.pBookmark < 0.02) {
    insights.push({
      type: 'neutral',
      title: 'Make It Bookmark-Worthy',
      description: 'Bookmarks are 50x multipliers. If your post isn\'t worth referencing later, it\'s invisible to the algorithm.',
      impact: 'high',
      algorithmReference: 'Save/Bookmark is weighted 50x in scoring',
    });
  }
  
  return insights;
}

// Format large numbers
export function formatNumber(num: number): string {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
}

// Get virality level description
export function getViralityLevel(score: number): { level: string; color: string; description: string } {
  if (score >= 85) {
    return {
      level: 'Viral Potential',
      color: 'text-emerald-400',
      description: 'High probability of significant reach beyond your followers',
    };
  }
  if (score >= 70) {
    return {
      level: 'Strong',
      color: 'text-green-400',
      description: 'Above average engagement expected, good out-of-network potential',
    };
  }
  if (score >= 55) {
    return {
      level: 'Moderate',
      color: 'text-yellow-400',
      description: 'Decent engagement within your network, limited viral potential',
    };
  }
  if (score >= 40) {
    return {
      level: 'Below Average',
      color: 'text-orange-400',
      description: 'May underperform. Consider the optimization suggestions',
    };
  }
  return {
    level: 'Low',
    color: 'text-red-400',
    description: 'Likely to be buried. Significant improvements needed',
  };
}

