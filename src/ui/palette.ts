export interface PaletteItem {
  id: string;
  label: string;
  description?: string;
  category?: string;
  icon?: string;
  shortcut?: string;
  action: () => Promise<void> | void;
}

export interface PaletteGroup {
  name: string;
  items: PaletteItem[];
}

export interface PaletteConfig {
  enabled: boolean;
  shortcut: string;
  maxResults: number;
  showDescriptions: boolean;
}

export type PaletteFilter = (item: PaletteItem, query: string) => boolean;

const defaultFilter: PaletteFilter = (item, query) => {
  const lower = query.toLowerCase();
  const desc = item.description?.toLowerCase().includes(lower) ?? false;
  const cat = item.category?.toLowerCase().includes(lower) ?? false;
  return item.label.toLowerCase().includes(lower) || desc || cat;
};

export class CommandPalette {
  private groups: Map<string, PaletteGroup> = new Map();
  private config: PaletteConfig = {
    enabled: true,
    shortcut: "ctrl+p",
    maxResults: 10,
    showDescriptions: true,
  };
  private filterFn: PaletteFilter = defaultFilter;
  private onOpenCallbacks: Array<() => void> = [];
  private onCloseCallbacks: Array<() => void> = [];
  private onSelectCallbacks: Array<(item: PaletteItem) => void> = [];
  private isOpen: boolean = false;

  constructor(config?: Partial<PaletteConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): PaletteConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<PaletteConfig>): void {
    this.config = { ...this.config, ...config };
  }

  isPaletteOpen(): boolean {
    return this.isOpen;
  }

  registerGroup(name: string, items: PaletteItem[]): void {
    const existing = this.groups.get(name);
    if (existing) {
      existing.items.push(...items);
    } else {
      this.groups.set(name, { name, items });
    }
  }

  unregisterGroup(name: string): void {
    this.groups.delete(name);
  }

  registerItem(groupName: string, item: PaletteItem): void {
    const group = this.groups.get(groupName);
    if (group) {
      group.items.push(item);
    } else {
      this.groups.set(groupName, { name: groupName, items: [item] });
    }
  }

  getGroups(): PaletteGroup[] {
    return Array.from(this.groups.values());
  }

  getAllItems(): PaletteItem[] {
    const items: PaletteItem[] = [];
    for (const group of this.groups.values()) {
      items.push(...group.items);
    }
    return items;
  }

  search(query: string): PaletteGroup[] {
    if (!query.trim()) {
      return this.getGroups().map(g => ({
        ...g,
        items: g.items.slice(0, this.config.maxResults),
      }));
    }

    const results: PaletteGroup[] = [];
    for (const group of this.groups.values()) {
      const matched = group.items.filter(item => this.filterFn(item, query));
      if (matched.length > 0) {
        results.push({
          name: group.name,
          items: matched.slice(0, this.config.maxResults),
        });
      }
    }
    return results;
  }

  setFilter(fn: PaletteFilter): void {
    this.filterFn = fn;
  }

  open(): void {
    this.isOpen = true;
    for (const cb of this.onOpenCallbacks) {
      cb();
    }
  }

  close(): void {
    this.isOpen = false;
    for (const cb of this.onCloseCallbacks) {
      cb();
    }
  }

  toggle(): void {
    if (this.isOpen) {
      this.close();
    } else {
      this.open();
    }
  }

  select(item: PaletteItem): void {
    for (const cb of this.onSelectCallbacks) {
      cb(item);
    }
    item.action();
    this.close();
  }

  onOpen(callback: () => void): void {
    this.onOpenCallbacks.push(callback);
  }

  onClose(callback: () => void): void {
    this.onCloseCallbacks.push(callback);
  }

  onSelect(callback: (item: PaletteItem) => void): void {
    this.onSelectCallbacks.push(callback);
  }

  destroy(): void {
    this.groups.clear();
    this.onOpenCallbacks = [];
    this.onCloseCallbacks = [];
    this.onSelectCallbacks = [];
    this.isOpen = false;
  }
}

export const commandPalette = new CommandPalette();
