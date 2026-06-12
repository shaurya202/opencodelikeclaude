export type BuddyMood = "happy" | "excited" | "thinking" | "working" | "sleepy" | "celebrate";

export interface BuddyConfig {
  enabled: boolean;
  mood: BuddyMood;
  animations: boolean;
  showOnStartup: boolean;
}

export interface BuddyCharacter {
  name: string;
  emoji: string;
  art: Partial<Record<BuddyMood, string[]>>;
}
