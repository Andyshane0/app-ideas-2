export type Archetype = 'STOIC_WARRIOR' | 'MONK_MODE' | 'CEO' | 'ARMY_OFFICER' | 'ATHLETE' | 'SCHOLAR';

export interface UserProfile {
  uid: string;
  email: string;
  displayName?: string;
  avatarUrl?: string;
  archetype?: Archetype;
  level: number;
  xp: number;
  aura: number;
  streak: number;
  disciplineScore: number;
  consistencyScore: number;
  createdAt: string;
  lastActive: string;
}

export interface Mission {
  id: string;
  userId: string;
  title: string;
  description: string;
  xpReward: number;
  completed: boolean;
  completedAt?: string;
  date: string;
  icon: string;
  locked?: boolean;
  unlockTime?: string;
}

export interface ChatMessage {
  id: string;
  userId: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  mode: Archetype;
}

export interface SocialPost {
  id: string;
  userId: string;
  userName: string;
  userArchetype: Archetype;
  userAvatar: string;
  content: string;
  imageUrl?: string;
  auraReacts: number;
  timestamp: string;
  achievement?: {
    type: string;
    title: string;
  };
}

export interface ArchetypeConfig {
  id: Archetype;
  name: string;
  description: string;
  icon: string;
  image: string;
  systemPrompt: string;
}
