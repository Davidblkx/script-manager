const singletons = new Map();

export interface Singleton<T> {
  get value(): T;
}

export function singleton<T>(fn: () => T, key?: symbol): Singleton<T> {
  const uniqueKey = key ?? Symbol();

  return {
    get value() {
      if (!singletons.has(uniqueKey)) {
        singletons.set(uniqueKey, fn());
      }

      return singletons.get(uniqueKey) as T;
    }
  }
}
