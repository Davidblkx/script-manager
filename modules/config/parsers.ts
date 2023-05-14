export function defaultParser<T>(defaultValue: T): (e: unknown) => T {
  return (e: unknown) => {
    if ("undefined" === typeof e || null === e) {
      return defaultValue;
    }
    return e as T;
  };
}
