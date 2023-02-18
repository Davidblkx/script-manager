import type { SettingRecord, SettingsSource } from "./models.ts";

export class SettingsContainer {
  #sources: SettingsSource[] = [];
  #default: SettingsSource | undefined;

  get sources() {
    return [...this.#sources]
  }

  get default() {
    return this.#default;
  }

  add(source: SettingsSource, priority = -1, defaultTo = false) {
    if (this.#sources.some(s => s === source)) {
      return this;
    }

    if (priority < 0) {
      this.#sources.push(source);
    } else {
      this.#sources.splice(priority, 0, source);
    }

    if (defaultTo || !this.#default) {
      this.#default = source;
    }

    return this;
  }

  remove(source: SettingsSource | string) {
    const index = typeof source === 'string'
      ? this.#sources.findIndex(s => s.name === source)
      : this.#sources.indexOf(source);

    if (index < 0) {
      return;
    }

    const [src] = this.#sources.splice(index, 1);

    if (this.#default === src) {
      this.#default = undefined;
    }

    return this;
  }

  defaultTo(source: SettingsSource | string) {
    const index = typeof source === 'string'
      ? this.#sources.findIndex(s => s.name === source)
      : this.#sources.indexOf(source);

    if (index < 0) {
      return;
    }

    this.#default = this.#sources[index];

    return this;
  }

  read(key: string, to?: string): SettingRecord | undefined {
    if (to) {
      const source = this.#sources.find(s => s.name === to);
      if (!source) {
        throw new Error(`No source found with name ${to}`);
      }

      return source.read(key);
    }

    for (const source of this.#sources) {
      const record = source.read(key);
      if (record) {
        return record;
      }
    }

    return undefined;
  }

  write(record: SettingRecord, to?: string) {
    const target = to ? this.#sources.find(s => s.name === to) : this.#default;
    if (!target) {
      const errorMessage = to ? `No source found with name ${to}` : 'No default source set';
      throw new Error(errorMessage);
    }

    target.write(record);
  }

  delete(key: string, to?: string) {
    if (to) {
      const source = this.#sources.find(s => s.name === to);
      if (!source) {
        throw new Error(`No source found with name ${to}`);
      }

      source.delete(key);
      return;
    }

    for (const source of this.#sources) {
      source.delete(key);
    }
  }

  async save(to?: string) {
    if (to) {
      const source = this.#sources.find(s => s.name === to);
      if (!source) {
        throw new Error(`No source found with name ${to}`);
      }

      await source.save();
      return;
    }

    await Promise.all(this.#sources.map(s => s.save()));
  }
}
