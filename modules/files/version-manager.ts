export type SemVer = `${number}.${number}.${number}`;

export type Version<T> = T & { __version: SemVer };

export type VersionMatch = 'any' | {
  target: 'exact' | 'lower' | 'bigger'
  value: SemVer
}

export type Updater<T, X> = {
  type: string;
  match: VersionMatch;
  to: SemVer;
  update: (data: T) => X;
}

export interface IVersionManager {
  register<T, X>(updater: Updater<T, X>): void;
  update<T, X>(type: string, value: T, to?: SemVer): Version<X>;
}

export class VersionManager implements IVersionManager {
  #updaters: Map<string, Updater<unknown, unknown>[]> = new Map();

  register<T, X>(updater: Updater<T, X>): void {
    if (!this.#updaters.has(updater.type)) {
      this.#updaters.set(updater.type, []);
    }

    this.#updaters.get(updater.type)!.push(updater as Updater<unknown, unknown>);
  }

  update<T, X>(type: string, value: T, to?: SemVer): Version<X> {
    // TODO: this
  }
}
