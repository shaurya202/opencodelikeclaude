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
export declare class CommandPalette {
    private groups;
    private config;
    private filterFn;
    private onOpenCallbacks;
    private onCloseCallbacks;
    private onSelectCallbacks;
    private isOpen;
    constructor(config?: Partial<PaletteConfig>);
    getConfig(): PaletteConfig;
    updateConfig(config: Partial<PaletteConfig>): void;
    isPaletteOpen(): boolean;
    registerGroup(name: string, items: PaletteItem[]): void;
    unregisterGroup(name: string): void;
    registerItem(groupName: string, item: PaletteItem): void;
    getGroups(): PaletteGroup[];
    getAllItems(): PaletteItem[];
    search(query: string): PaletteGroup[];
    setFilter(fn: PaletteFilter): void;
    open(): void;
    close(): void;
    toggle(): void;
    select(item: PaletteItem): void;
    onOpen(callback: () => void): void;
    onClose(callback: () => void): void;
    onSelect(callback: (item: PaletteItem) => void): void;
    destroy(): void;
}
export declare const commandPalette: CommandPalette;
//# sourceMappingURL=palette.d.ts.map