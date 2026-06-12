export class AttentionManager {
    notifications = [];
    config = {
        notificationsEnabled: true,
        soundsEnabled: true,
        soundVolume: 0.5,
        flashOnQuestion: true,
        flashOnPermission: true,
        flashOnError: true,
        showPermissionNotifications: true,
    };
    soundConfig = {
        enabled: true,
        volume: 0.5,
        sounds: {},
    };
    notifyCallbacks = [];
    dismissCallbacks = [];
    flashCallbacks = [];
    soundCallbacks = [];
    maxNotifications = 50;
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
        this.soundConfig.enabled = config.soundsEnabled ?? this.soundConfig.enabled;
        this.soundConfig.volume = config.soundVolume ?? this.soundConfig.volume;
    }
    getSoundConfig() {
        return { ...this.soundConfig };
    }
    updateSoundConfig(config) {
        this.soundConfig = { ...this.soundConfig, ...config };
    }
    notify(type, title, message, options) {
        const id = this.generateId();
        const notification = {
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
    info(title, message, options) {
        return this.notify("info", title, message, options);
    }
    success(title, message, options) {
        return this.notify("success", title, message, options);
    }
    warning(title, message, options) {
        return this.notify("warning", title, message, options);
    }
    error(title, message, options) {
        return this.notify("error", title, message, options);
    }
    question(title, message, options) {
        return this.notify("question", title, message, { ...options, actionable: true });
    }
    permission(title, message, options) {
        return this.notify("permission", title, message, { ...options, actionable: true });
    }
    dismiss(id) {
        const index = this.notifications.findIndex(n => n.id === id);
        if (index >= 0) {
            this.notifications.splice(index, 1);
            for (const cb of this.dismissCallbacks) {
                cb(id);
            }
        }
    }
    dismissAll() {
        const ids = this.notifications.map(n => n.id);
        this.notifications = [];
        for (const id of ids) {
            for (const cb of this.dismissCallbacks) {
                cb(id);
            }
        }
    }
    getNotifications() {
        return [...this.notifications];
    }
    getActiveNotifications() {
        return this.notifications.filter(n => {
            if (!n.duration)
                return true;
            return Date.now() - n.timestamp < n.duration;
        });
    }
    onNotify(callback) {
        this.notifyCallbacks.push(callback);
    }
    onDismiss(callback) {
        this.dismissCallbacks.push(callback);
    }
    onFlash(callback) {
        this.flashCallbacks.push(callback);
    }
    flash() {
        for (const cb of this.flashCallbacks) {
            cb();
        }
    }
    onSound(callback) {
        this.soundCallbacks.push(callback);
    }
    playSound(type) {
        if (!this.soundConfig.enabled)
            return;
        const soundFile = this.soundConfig.sounds[type];
        if (!soundFile)
            return;
        for (const cb of this.soundCallbacks) {
            cb(type, soundFile, this.soundConfig.volume);
        }
    }
    getDefaultDuration(type) {
        switch (type) {
            case "info": return 3000;
            case "success": return 3000;
            case "warning": return 5000;
            case "error": return 8000;
            case "question": return 0;
            case "permission": return 0;
        }
    }
    generateId() {
        return `notif-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    }
    destroy() {
        this.notifications = [];
        this.notifyCallbacks = [];
        this.dismissCallbacks = [];
        this.flashCallbacks = [];
        this.soundCallbacks = [];
    }
}
export const attentionManager = new AttentionManager();
//# sourceMappingURL=attention.js.map