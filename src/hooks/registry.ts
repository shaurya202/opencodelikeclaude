import { HookEventType, HookHandler, HookInput, HookOutput, HookRegistration } from "./types";

export class HookRegistry {
  private hooks: Map<HookEventType, Array<HookRegistration<HookInput, HookOutput>>> = new Map();

  register<T extends HookInput, R extends HookOutput>(
    event: HookEventType,
    handler: HookHandler<T, R>,
    options?: { priority?: number; match?: (input: T) => boolean }
  ): void {
    const registration: HookRegistration<T, R> = {
      event,
      handler,
      priority: options?.priority ?? 0,
      match: options?.match,
    };

    const existing = this.hooks.get(event) || [];
    existing.push(registration as unknown as HookRegistration<HookInput, HookOutput>);
    existing.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
    this.hooks.set(event, existing);
  }

  unregister(event: HookEventType, handler: HookHandler): void {
    const existing = this.hooks.get(event);
    if (!existing) return;
    
    const filtered = existing.filter(reg => reg.handler !== handler);
    this.hooks.set(event, filtered);
  }

  async dispatch<T extends HookInput, R extends HookOutput>(
    event: HookEventType,
    input: T
  ): Promise<R[]> {
    const hooks = this.hooks.get(event) || [];
    const results: R[] = [];

    for (const registration of hooks) {
      if (registration.match && !registration.match(input)) {
        continue;
      }

      try {
        const result = await registration.handler(input);
        results.push(result as R);
      } catch (error) {
        console.error(`[HookRegistry] Error in ${event} hook:`, error);
      }
    }

    return results;
  }

  async dispatchFirst<T extends HookInput, R extends HookOutput>(
    event: HookEventType,
    input: T
  ): Promise<R | undefined> {
    const hooks = this.hooks.get(event) || [];

    for (const registration of hooks) {
      if (registration.match && !registration.match(input)) {
        continue;
      }

      try {
        const result = await registration.handler(input);
        return result as R;
      } catch (error) {
        console.error(`[HookRegistry] Error in ${event} hook:`, error);
      }
    }

    return undefined;
  }

  getHooks(event: HookEventType): Array<HookRegistration<HookInput, HookOutput>> {
    return this.hooks.get(event) || [];
  }

  clear(event?: HookEventType): void {
    if (event) {
      this.hooks.delete(event);
    } else {
      this.hooks.clear();
    }
  }
}

export const hookRegistry = new HookRegistry();