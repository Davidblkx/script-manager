import { RuntimeHandler, SMXConfig, RuntimeType } from './config.ts';
import { getConfigPath } from '../utils/config.ts';

let engine: SMXEngine | undefined;

export class SMXEngine {
  #config: SMXConfig;
  #runtimes = new Map<string, RuntimeHandler>();

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
}

async function getConfig(): Promise<SMXConfig> {
  const config = await Deno.readTextFile(getConfigPath());
  return JSON.parse(config);
}


export async function getEngine() {
  if (!engine) {
    const config = await getConfig();
    engine = new SMXEngine(config);
  }
  return engine;
}
