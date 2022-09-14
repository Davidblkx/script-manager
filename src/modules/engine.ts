import { RuntimeHandler, SMXConfig, RuntimeType } from './config.ts';
import { getConfigPath, getDefaultRepo } from '../utils/config.ts';

let engine: SMXEngine | undefined;

export class SMXEngine {
  #config: SMXConfig;
  #runtimes = new Map<string, RuntimeHandler>();

  public get listRuntimes() { return [...this.#runtimes.values()]; }

  constructor(config: SMXConfig) {
    this.#config = config;
  }

  get config() {
    return this.#config;
  }

  set config(config: SMXConfig) {
    this.#config = config;
  }

  getRuntime(type: RuntimeType) {
    return this.#runtimes.get(type);
  }

  setRuntime(type: RuntimeType, runtime: RuntimeHandler) {
    const config = this.#config.engines.find((e) => e.type === type);
    if (config) {
      runtime.setConfig(config);
      this.#runtimes.set(type, runtime);
    } else {
      throw new Error(`Runtime type ${type} not found in config`);
    }
  }

  static create = () => getEngine();
}

export async function loadConfig(): Promise<SMXConfig> {
  const configPath = getConfigPath();
  const config = await Deno.readTextFile(configPath);
  const baseConfig = JSON.parse(config);

  return {
    dotFiles: [],
    engines: [],
    global: false,
    repo: getDefaultRepo(),
    editor: 'code',
    ...baseConfig,
  }
}


export async function getEngine() {
  if (!engine) {
    const config = await loadConfig();
    engine = new SMXEngine(config);
  }
  return engine;
}
