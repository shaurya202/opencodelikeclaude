import { CommandDefinition, CommandContext, CommandResult } from "../commands/types";
import { commandRegistry } from "../commands/registry";
import { buddyPet } from "../buddy/pet";
import { BuddyMood } from "../buddy/types";

export const buddyCommand: CommandDefinition = {
  name: "buddy",
  description: "Terminal companion pet",
  usage: "/buddy [on|off|mood <mood>|character <name>|toggle]",
  aliases: ["pet"],
  category: "ui",
  flags: [
    { name: "on", description: "Show buddy", type: "boolean" },
    { name: "off", description: "Hide buddy", type: "boolean" },
    { name: "toggle", short: "t", description: "Toggle buddy visibility", type: "boolean" },
    { name: "mood", short: "m", description: "Set mood (happy, excited, thinking, working, sleepy, celebrate)", type: "string" },
    { name: "character", short: "c", description: "Set character (cat, fox, robot)", type: "string" },
    { name: "list", short: "l", description: "List available characters", type: "boolean" },
  ],
  handler: async (context: CommandContext): Promise<CommandResult> => {
    const { flags } = context;

    if (flags.list) {
      const chars = buddyPet.getCharacters();
      const current = buddyPet.getCharacter();
      let output = "Available characters:\n\n";
      for (const c of chars) {
        const mark = c.name === current.name ? " (active)" : "";
        output += `  ${c.emoji} ${c.name}${mark}\n`;
      }
      return { output };
    }

    if (flags.mood) {
      const validMoods: BuddyMood[] = ["happy", "excited", "thinking", "working", "sleepy", "celebrate"];
      const mood = flags.mood as BuddyMood;
      if (!validMoods.includes(mood)) {
        return { error: `Invalid mood: ${mood}. Valid: ${validMoods.join(", ")}`, exitCode: 1 };
      }
      buddyPet.setMood(mood);
      return { output: buddyPet.render() };
    }

    if (flags.character) {
      const found = buddyPet.setCharacter(flags.character as string);
      if (!found) {
        const names = buddyPet.getCharacters().map(c => c.name).join(", ");
        return { error: `Character not found: ${flags.character}. Available: ${names}`, exitCode: 1 };
      }
      return { output: `Switched to: ${buddyPet.getCharacter().emoji} ${buddyPet.getCharacter().name}\n${buddyPet.render()}` };
    }

    if (flags.on) {
      buddyPet.updateConfig({ enabled: true });
      buddyPet.setMood("happy");
      return { output: buddyPet.render() };
    }

    if (flags.off) {
      buddyPet.updateConfig({ enabled: false });
      return { output: "Buddy hidden." };
    }

    if (flags.toggle !== undefined) {
      const enabled = !buddyPet.isEnabled();
      buddyPet.updateConfig({ enabled });
      if (enabled) {
        buddyPet.setMood("happy");
        return { output: buddyPet.render() };
      }
      return { output: "Buddy hidden." };
    }

    if (buddyPet.isEnabled()) {
      return { output: buddyPet.render() };
    }
    return { output: `Buddy is hidden. Use /buddy --on to show.\n\nCharacters:\n  cat 🐱  fox 🦊  robot 🤖\nMoods: happy, excited, thinking, working, sleepy, celebrate` };
  },
};

commandRegistry.register({ ...buddyCommand, source: "builtin" });
