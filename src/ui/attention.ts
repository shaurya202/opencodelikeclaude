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

export class AttentionManager {
  private notifications: Notification[] = [];
  private config: AttentionConfig = {
    notificationsEnabled: true,
    soundsEnabled: true,
    soundVolume: 0.5,
    flashOnQuestion: true,
    flashOnPermission: true,
    flashOnError: true,
    showPermissionNotifications: true,
  };
  private soundConfig: SoundConfig = {
    enabled: true,
    volume: 0.5,
    sounds: {},
  };
  private notifyCallbacks: Array<(notification: Notification) => void> = [];
  private dismissCallbacks: Array<(id: string) => void> = [];
  private flashCallbacks: Array<() => void> = [];
  private soundCallbacks: Array<(type: NotificationType, soundFile: string, volume: number) => void> = [];
  private maxNotifications: number = 50;

  constructor(config?: Partial<AttentionConfig>) {
    if (config) {
      this.config = { ...this.config, ...config };
    }
  }

  getConfig(): AttentionConfig {
    return { ...this.config };
  }

  updateConfig(config: Partial<AttentionConfig>): void {
    this.config = { ...this.config, ...config };
    this.soundConfig.enabled = config.soundsEnabled ?? this.soundConfig.enabled;
    this.soundConfig.volume = config.soundVolume ?? this.soundConfig.volume;
  }

  getSoundConfig(): SoundConfig {
    return { ...this.soundConfig };
  }

  updateSoundConfig(config: Partial<SoundConfig>): void {
    this.soundConfig = { ...this.soundConfig, ...config };
  }

  notify(type: NotificationType, title: string, message: string, options?: {
    duration?: number;
    actionable?: boolean;
    actionLabel?: string;
    onAction?: () => void;
  }): string {
    const id = this.generateId();
    const notification: Notification = {
      id,
      type,
      title,
      message,
      timestamp: Date.now(),
      duration: options?.duration ?? this.getDefaultDuration(type),
      actionable: options?.actionable ?? false,
      actionLabel: options?.actionLabel,
      onAction: options?.onAction,
    };

    this.notifications.push(notification);
    if (this.notifications.length > this.maxNotifications) {
      this.notifications.shift();
    }

    if (this.config.notificationsEnabled) {
      for (const cb of this.notifyCallbacks) {
        cb(notification);
      }
    }

    if (this.config.flashOnError && type === "error") {
      this.flash();
    }
    if (this.config.flashOnQuestion && type === "question") {
      this.flash();
    }
    if (this.config.flashOnPermission && type === "permission") {
      this.flash();
    }

    return id;
  }

  info(title: string, message: string, options?: { duration?: number }): string {
    return this.notify("info", title, message, options);
  }

  success(title: string, message: string, options?: { duration?: number }): string {
    return this.notify("success", title, message, options);
  }

  warning(title: string, message: string, options?: { duration?: number }): string {
    return this.notify("warning", title, message, options);
  }

  error(title: string, message: string, options?: { duration?: number }): string {
    return this.notify("error", title, message, options);
  }

  question(title: string, message: string, options?: { actionLabel?: string; onAction?: () => void }): string {
    return this.notify("question", title, message, { ...options, actionable: true });
  }

  permission(title: string, message: string, options?: { actionLabel?: string; onAction?: () => void }): string {
    return this.notify("permission", title, message, { ...options, actionable: true });
  }

  dismiss(id: string): void {
    const index = this.notifications.findIndex(n => n.id === id);
    if (index >= 0) {
      this.notifications.splice(index, 1);
      for (const cb of this.dismissCallbacks) {
        cb(id);
      }
    }
  }

  dismissAll(): void {
    const ids = this.notifications.map(n => n.id);
    this.notifications = [];
    for (const id of ids) {
      for (const cb of this.dismissCallbacks) {
        cb(id);
      }
    }
  }

  getNotifications(): Notification[] {
    return [...this.notifications];
  }

  getActiveNotifications(): Notification[] {
    return this.notifications.filter(n => {
      if (!n.duration) return true;
      return Date.now() - n.timestamp < n.duration;
    });
  }

  onNotify(callback: (notification: Notification) => void): void {
    this.notifyCallbacks.push(callback);
  }

  onDismiss(callback: (id: string) => void): void {
    this.dismissCallbacks.push(callback);
  }

  onFlash(callback: () => void): void {
    this.flashCallbacks.push(callback);
  }

  private flash(): void {
    for (const cb of this.flashCallbacks) {
      cb();
    }
  }

  onSound(callback: (type: NotificationType, soundFile: string, volume: number) => void): void {
    this.soundCallbacks.push(callback);
  }

  playSound(type: NotificationType): void {
    if (!this.soundConfig.enabled) return;
    const soundFile = this.soundConfig.sounds[type];
    if (!soundFile) return;
    for (const cb of this.soundCallbacks) {
      cb(type, soundFile, this.soundConfig.volume);
    }
  }

  private getDefaultDuration(type: NotificationType): number {
    switch (type) {
      case "info": return 3000;
      case "success": return 3000;
      case "warning": return 5000;
      case "error": return 8000;
      case "question": return 0;
      case "permission": return 0;
    }
  }

  private generateId(): string {
    return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  }

  destroy(): void {
    this.notifications = [];
    this.notifyCallbacks = [];
    this.dismissCallbacks = [];
    this.flashCallbacks = [];
    this.soundCallbacks = [];
  }
}

export const attentionManager = new AttentionManager();
