const DEFAULT_CHARACTERS = [
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
    config = {
        enabled: false,
        mood: "happy",
        animations: true,
        showOnStartup: false,
    };
    currentCharacter = DEFAULT_CHARACTERS[0];
    moodCallbacks = [];
    constructor(config) {
        if (config) {
            this.config = { ...this.config, ...config };
        }
    }
    getConfig() {
        return { ...this.config };
    }
    updateConfig(config) {
        this.config = { ...this.config, ...config };
    }
    isEnabled() {
        return this.config.enabled;
    }
    getCharacter() {
        return this.currentCharacter;
    }
    getCharacters() {
        return DEFAULT_CHARACTERS;
    }
    setCharacter(name) {
        const found = DEFAULT_CHARACTERS.find(c => c.name === name);
        if (!found)
            return false;
        this.currentCharacter = found;
        return true;
    }
    getMood() {
        return this.config.mood;
    }
    setMood(mood) {
        this.config.mood = mood;
        for (const cb of this.moodCallbacks) {
            cb(mood);
        }
    }
    getArt() {
        const art = this.currentCharacter.art[this.config.mood];
        return art || this.currentCharacter.art.happy || [];
    }
    render() {
        const art = this.getArt();
        return [this.currentCharacter.emoji, ...art].join("\n");
    }
    onMoodChange(callback) {
        this.moodCallbacks.push(callback);
    }
    destroy() {
        this.moodCallbacks = [];
    }
}
export const buddyPet = new BuddyPet();
//# sourceMappingURL=pet.js.map