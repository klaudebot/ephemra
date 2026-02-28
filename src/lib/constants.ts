export const MOODS = [
  { value: "neutral", label: "Neutral", emoji: "✨" },
  { value: "energetic", label: "Energetic", emoji: "⚡" },
  { value: "chill", label: "Chill", emoji: "🌊" },
  { value: "thoughtful", label: "Thoughtful", emoji: "💭" },
  { value: "creative", label: "Creative", emoji: "🎨" },
  { value: "funny", label: "Funny", emoji: "😄" },
  { value: "vulnerable", label: "Vulnerable", emoji: "🤍" },
] as const;

export const RESONANCE_TYPES = [
  { value: "resonate", label: "Resonate", description: "This speaks to me" },
  { value: "amplify", label: "Amplify", description: "More people need to see this" },
  { value: "echo", label: "Echo", description: "This will stick with me" },
] as const;

// Post lifespan mechanics
export const DEFAULT_LIFESPAN = 6 * 60 * 60; // 6 hours in seconds
export const RESONANCE_TIME_BONUS = 30 * 60; // Each resonance adds 30 minutes
export const COMMENT_TIME_BONUS = 15 * 60; // Each comment adds 15 minutes
export const ETERNAL_THRESHOLD = 50; // Resonances needed to become eternal

export const MAX_POST_LENGTH = 500;
export const MAX_COMMENT_LENGTH = 280;
