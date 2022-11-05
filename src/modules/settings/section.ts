import type { ISettingsManager } from "./manager.ts";
import { JsonSettings } from "./models.ts";

export interface ISection<T extends JsonSettings = JsonSettings> {
  readonly value: Readonly<T>;

  set<K extends keyof T>(key: K, value: T[K]): Promise<void>;
  delete<K extends keyof T>(key: K): Promise<void>;
}

export class Section<T extends JsonSettings> implements ISection<T> {
  #manager: ISettingsManager;
  #proxy?: Readonly<T>;

  get value(): Readonly<T> {
    if (!this.#proxy) {
      this.#proxy = this.#buildProxy();
    }
    return this.#proxy;
  }

  constructor(manager: ISettingsManager) {
    this.#manager = manager;
  }

  async set<K extends keyof T>(key: K, value: T[K]): Promise<void> {
    const unit = this.#manager.get(key.toString());
    unit.value = value;
    this.#manager.set(unit);
    await this.#manager.save();
  }

  async delete<K extends keyof T>(key: K): Promise<void> {
    const unit = this.#manager.get(key.toString());
    this.#manager.delete(unit);
    await this.#manager.save();
  }

  #buildProxy(): Readonly<T> {
    return new Proxy({} as unknown as Readonly<T>, {
      get: (_, key: string) => {
        return this.#manager.get(key).value;
      },
    });
  }
}
