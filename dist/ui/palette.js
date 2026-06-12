const defaultFilter = (item, query) => {
    const lower = query.toLowerCase();
    const desc = item.description?.toLowerCase().includes(lower) ?? false;
    const cat = item.category?.toLowerCase().includes(lower) ?? false;
    return item.label.toLowerCase().includes(lower) || desc || cat;
};
export class CommandPalette {
    groups = new Map();
    config = {
        enabled: true,
        shortcut: "ctrl+p",
        maxResults: 10,
        showDescriptions: true,
    };
    filterFn = defaultFilter;
    onOpenCallbacks = [];
    onCloseCallbacks = [];
    onSelectCallbacks = [];
    isOpen = false;
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
    isPaletteOpen() {
        return this.isOpen;
    }
    registerGroup(name, items) {
        const existing = this.groups.get(name);
        if (existing) {
            existing.items.push(...items);
        }
        else {
            this.groups.set(name, { name, items });
        }
    }
    unregisterGroup(name) {
        this.groups.delete(name);
    }
    registerItem(groupName, item) {
        const group = this.groups.get(groupName);
        if (group) {
            group.items.push(item);
        }
        else {
            this.groups.set(groupName, { name: groupName, items: [item] });
        }
    }
    getGroups() {
        return Array.from(this.groups.values());
    }
    getAllItems() {
        const items = [];
        for (const group of this.groups.values()) {
            items.push(...group.items);
        }
        return items;
    }
    search(query) {
        if (!query.trim()) {
            return this.getGroups().map(g => ({
                ...g,
                items: g.items.slice(0, this.config.maxResults),
            }));
        }
        const results = [];
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
    setFilter(fn) {
        this.filterFn = fn;
    }
    open() {
        this.isOpen = true;
        for (const cb of this.onOpenCallbacks) {
            cb();
        }
    }
    close() {
        this.isOpen = false;
        for (const cb of this.onCloseCallbacks) {
            cb();
        }
    }
    toggle() {
        if (this.isOpen) {
            this.close();
        }
        else {
            this.open();
        }
    }
    select(item) {
        for (const cb of this.onSelectCallbacks) {
            cb(item);
        }
        item.action();
        this.close();
    }
    onOpen(callback) {
        this.onOpenCallbacks.push(callback);
    }
    onClose(callback) {
        this.onCloseCallbacks.push(callback);
    }
    onSelect(callback) {
        this.onSelectCallbacks.push(callback);
    }
    destroy() {
        this.groups.clear();
        this.onOpenCallbacks = [];
        this.onCloseCallbacks = [];
        this.onSelectCallbacks = [];
        this.isOpen = false;
    }
}
export const commandPalette = new CommandPalette();
//# sourceMappingURL=palette.js.map