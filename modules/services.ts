import { CONFIG_HANDLER, CONFIG_PROVIDER } from './config/service.ts';
import { LOGGER_FACTORY } from './logger/service.ts';
import { GIT, GIT_BUILDER, GIT_HANDLER } from './git/services.ts';
import { SUBPROCESS_FACTORY } from './subprocess/service.ts';
import { FILE_SYSTEM } from "./file-system/services.ts";

import type { IContainer, Token } from './container/mod.ts';

import { container } from './container/container.ts';

export const knownServices = {
  "config.handler": CONFIG_HANDLER,
  "config.provider": CONFIG_PROVIDER,
  logger: LOGGER_FACTORY,
  git: GIT,
  "git.builder": GIT_BUILDER,
  "git.handler": GIT_HANDLER,
  subprocess: SUBPROCESS_FACTORY,
  "file-system": FILE_SYSTEM,
};

export interface IServices {
  use(container: IContainer): void;

  get<T extends keyof typeof knownServices>(key: T): typeof knownServices[T] extends Token<infer U> ? U : never;
}

class Services implements IServices {
  #container: IContainer = container;

  use(container: IContainer): void {
    this.#container = container;
  }

  get<T extends keyof typeof knownServices>(key: T): typeof knownServices[T] extends Token<infer U> ? U : never {
    const token = knownServices[key] as Token<unknown>;
    return this.#container.get(token) as typeof knownServices[T] extends Token<infer U> ? U : never;
  }
}

export const services: IServices = new Services();
