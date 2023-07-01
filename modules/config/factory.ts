import type { IReader, IWriter } from './models.ts';

/** Environment config reader */
export class EnvironmentConfig implements IReader {
  readonly name = 'environment';
  #canUse = false;

  isAvailable(): boolean {
    return this.#canUse;
  }

  async checkAvailability() {
    const status = await Deno.permissions.query({ name: 'env' });
    const setCanUse = (v: boolean) => (this.#canUse = v);
    status.addEventListener('change', function () {
      setCanUse(this.state === 'granted');
    });
    setCanUse(status.state === 'granted');
  }

  read(key: string): unknown {
    return Deno.env.get(key.toUpperCase().replaceAll('.', '_'));
  }
}

/** File config reader/writer */
export class AsyncConfig implements IReader, IWriter {
  #name: string;
  #data: Record<string, unknown>;
  #writer: (data: Record<string, unknown>) => void | Promise<void>;
  #useable: boolean | (() => boolean);

  isAvailable(): boolean {
    return typeof this.#useable === 'boolean' ? this.#useable : this.#useable();
  }

  constructor(
    name: string,
    data: Record<string, unknown>,
    writer: (data: Record<string, unknown>) => void | Promise<void>,
    canUse: boolean | (() => boolean) = true,
  ) {
    this.#name = name;
    this.#data = data;
    this.#writer = writer;
    this.#useable = canUse;
  }

  get name() {
    return this.#name;
  }

  read(key: string): unknown {
    return this.#data[key];
  }

  async write(key: string, value: unknown): Promise<void> {
    this.#data[key] = value;
    await this.#writer(this.#data);
  }
}
