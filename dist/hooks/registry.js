export class HookRegistry {
    hooks = new Map();
    register(event, handler, options) {
        const registration = {
            event,
            handler,
            priority: options?.priority ?? 0,
            match: options?.match,
        };
        const existing = this.hooks.get(event) || [];
        existing.push(registration);
        existing.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
        this.hooks.set(event, existing);
    }
    unregister(event, handler) {
        const existing = this.hooks.get(event);
        if (!existing)
            return;
        const filtered = existing.filter(reg => reg.handler !== handler);
        this.hooks.set(event, filtered);
    }
    async dispatch(event, input) {
        const hooks = this.hooks.get(event) || [];
        const results = [];
        for (const registration of hooks) {
            if (registration.match && !registration.match(input)) {
                continue;
            }
            try {
                const result = await registration.handler(input);
                results.push(result);
            }
            catch (error) {
                console.error(`[HookRegistry] Error in ${event} hook:`, error);
            }
        }
        return results;
    }
    async dispatchFirst(event, input) {
        const hooks = this.hooks.get(event) || [];
        for (const registration of hooks) {
            if (registration.match && !registration.match(input)) {
                continue;
            }
            try {
                const result = await registration.handler(input);
                return result;
            }
            catch (error) {
                console.error(`[HookRegistry] Error in ${event} hook:`, error);
            }
        }
        return undefined;
    }
    getHooks(event) {
        return this.hooks.get(event) || [];
    }
    clear(event) {
        if (event) {
            this.hooks.delete(event);
        }
        else {
            this.hooks.clear();
        }
    }
}
export const hookRegistry = new HookRegistry();
//# sourceMappingURL=registry.js.map