import { BuddyConfig, BuddyMood, BuddyCharacter } from "./types";
export declare class BuddyPet {
    private config;
    private currentCharacter;
    private moodCallbacks;
    constructor(config?: Partial<BuddyConfig>);
    getConfig(): BuddyConfig;
    updateConfig(config: Partial<BuddyConfig>): void;
    isEnabled(): boolean;
    getCharacter(): BuddyCharacter;
    getCharacters(): BuddyCharacter[];
    setCharacter(name: string): boolean;
    getMood(): BuddyMood;
    setMood(mood: BuddyMood): void;
    getArt(): string[];
    render(): string;
    onMoodChange(callback: (mood: BuddyMood) => void): void;
    destroy(): void;
}
export declare const buddyPet: BuddyPet;
//# sourceMappingURL=pet.d.ts.map