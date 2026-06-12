import { BuddyConfig, BuddyMood, BuddyCharacter } from "./types";

const DEFAULT_CHARACTERS: BuddyCharacter[] = [
  {
    name: "cat",
    emoji: "🐱",
    art: {
      happy: ["  ∧_∧", " (•‿•)", " (　 )", " ｜｜｜"],
      excited: ["  ∧_∧", " (★‿★)", " (　 )", " ｜｜｜"],
      thinking: ["  ∧_∧", " (･_･)", " (つ　)", " ｜｜｜"],
      working: ["  ∧_∧", " (･ω･)", " (⊃　)", " ｜｜｜"],
      sleepy: ["  ∧_∧", " (˘˘)", " (　 )", " ｜｜｜"],
      celebrate: ["  ∧_∧", " (★‿★)", " (　 )ﾉ", " ｜｜｜"],
    },
  },
  {
    name: "fox",
    emoji: "🦊",
    art: {
      happy: ["  /\\ /\\", " (‿‿)", "  (　)", "  ｜｜"],
      excited: ["  /\\ /\\", " (★‿★)", "  (　)", "  ｜｜"],
      thinking: ["  /\\ /\\", " (･_･)", "  (　)", "  ｜｜"],
      working: ["  /\\ /\\", " (･ω･)", "  (⊃)", "  ｜｜"],
      sleepy: ["  /\\ /\\", " (˘˘)", "  (　)", "  ｜｜"],
      celebrate: ["  /\\ /\\", " (★‿★)", "  (　)ﾉ", "  ｜｜"],
    },
  },
  {
    name: "robot",
    emoji: "🤖",
    art: {
      happy: ["  ┌─┐", " [◉‿◉]", "  ┴┬┴", "  │││"],
      excited: ["  ┌─┐", " [★‿★]", "  ┴┬┴", "  │││"],
      thinking: ["  ┌─┐", " [･_･]", "  ┴┬┴", "  │││"],
      working: ["  ┌─┐", " [･ω･]", "  ┴┬┴", "  │││"],
      sleepy: ["  ┌─┐", " [˘˘]", "  ┴┬┴", "  │││"],
      celebrate: ["  ┌─┐", " [★‿★]", "  ┴┬┴ﾉ", "  │││"],
    },
  },
];

export class BuddyPet {
  private config: BuddyConfig = {
    enabled: false,
    mood: "happy",
    animations: true,
    showOnStartup: false,
  };
  private currentCharacter: BuddyCharacter = DEFAULT_CHARACTERS[0];
  private moodCallbacks: Array<(mood: BuddyMood) => void> = [];

  constructor(config?: Partial<BuddyConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): BuddyConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<BuddyConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  getCharacter(): BuddyCharacter {
    return this.currentCharacter;
  }

  getCharacters(): BuddyCharacter[] {
    return DEFAULT_CHARACTERS;
  }

  setCharacter(name: string): boolean {
    const found = DEFAULT_CHARACTERS.find(c => c.name === name);
    if (!found) return false;
    this.currentCharacter = found;
    return true;
  }

  getMood(): BuddyMood {
    return this.config.mood;
  }

  setMood(mood: BuddyMood): void {
    this.config.mood = mood;
    for (const cb of this.moodCallbacks) {
      cb(mood);
    }
  }

  getArt(): string[] {
    const art = this.currentCharacter.art[this.config.mood];
    return art || this.currentCharacter.art.happy || [];
  }

  render(): string {
    const art = this.getArt();
    return [this.currentCharacter.emoji, ...art].join("\n");
  }

  onMoodChange(callback: (mood: BuddyMood) => void): void {
    this.moodCallbacks.push(callback);
  }

  destroy(): void {
    this.moodCallbacks = [];
  }
}

export const buddyPet = new BuddyPet();
