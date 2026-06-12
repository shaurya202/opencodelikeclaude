export type NotificationType = "info" | "success" | "warning" | "error" | "question" | "permission";
export interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    timestamp: number;
    duration?: number;
    actionable?: boolean;
    actionLabel?: string;
    onAction?: () => void;
}
export interface SoundConfig {
    enabled: boolean;
    volume: number;
    sounds: Partial<Record<NotificationType, string>>;
}
export interface AttentionConfig {
    notificationsEnabled: boolean;
    soundsEnabled: boolean;
    soundVolume: number;
    flashOnQuestion: boolean;
    flashOnPermission: boolean;
    flashOnError: boolean;
    showPermissionNotifications: boolean;
}
export declare class AttentionManager {
    private notifications;
    private config;
    private soundConfig;
    private notifyCallbacks;
    private dismissCallbacks;
    private flashCallbacks;
    private soundCallbacks;
    private maxNotifications;
    constructor(config?: Partial<AttentionConfig>);
    getConfig(): AttentionConfig;
    updateConfig(config: Partial<AttentionConfig>): void;
    getSoundConfig(): SoundConfig;
    updateSoundConfig(config: Partial<SoundConfig>): void;
    notify(type: NotificationType, title: string, message: string, options?: {
        duration?: number;
        actionable?: boolean;
        actionLabel?: string;
        onAction?: () => void;
    }): string;
    info(title: string, message: string, options?: {
        duration?: number;
    }): string;
    success(title: string, message: string, options?: {
        duration?: number;
    }): string;
    warning(title: string, message: string, options?: {
        duration?: number;
    }): string;
    error(title: string, message: string, options?: {
        duration?: number;
    }): string;
    question(title: string, message: string, options?: {
        actionLabel?: string;
        onAction?: () => void;
    }): string;
    permission(title: string, message: string, options?: {
        actionLabel?: string;
        onAction?: () => void;
    }): string;
    dismiss(id: string): void;
    dismissAll(): void;
    getNotifications(): Notification[];
    getActiveNotifications(): Notification[];
    onNotify(callback: (notification: Notification) => void): void;
    onDismiss(callback: (id: string) => void): void;
    onFlash(callback: () => void): void;
    private flash;
    onSound(callback: (type: NotificationType, soundFile: string, volume: number) => void): void;
    playSound(type: NotificationType): void;
    private getDefaultDuration;
    private generateId;
    destroy(): void;
}
export declare const attentionManager: AttentionManager;
//# sourceMappingURL=attention.d.ts.map