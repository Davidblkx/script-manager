export function addToSet<T>(set: Set<T>, values: T[]): Set<T> {
  values.forEach(value => set.add(value));
  return set;
}
