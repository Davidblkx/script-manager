import {
  CONFIG_HANDLER,
  CONFIG_PROVIDER,
  condigHandlerService,
  configProviderService,
} from "./config/service.ts";
import { LOGGER_FACTORY, loggerFactoryService } from "./logger/service.ts";
import {
  GIT,
  GIT_BUILDER,
  GIT_HANDLER,
  gitBuilderService,
  gitHandlerService,
  gitService,
} from "./git/services.ts";
import {
  SUBPROCESS_FACTORY,
  subprocessFactoryService,
} from "./subprocess/service.ts";
import {} from "./ssh/mod.ts";
import { FILE_SYSTEM, fileSystemService } from "./file-system/services.ts";
import { SSH, sshService } from "./ssh/services.ts";

import type { IContainer, Token } from "./container/mod.ts";

import { container } from "./container/container.ts";

export const knownServices = {
  "config.handler": CONFIG_HANDLER,
  "config.provider": CONFIG_PROVIDER,
  logger: LOGGER_FACTORY,
  git: GIT,
  "git.builder": GIT_BUILDER,
  "git.handler": GIT_HANDLER,
  subprocess: SUBPROCESS_FACTORY,
  "file-system": FILE_SYSTEM,
  ssh: SSH,
};

export interface IServices {
  readonly container: IContainer;

  use(container: IContainer): void;

  get<T extends keyof typeof knownServices>(
    key: T
  ): (typeof knownServices)[T] extends Token<infer U> ? U : never;

  registerDefaults(): void;
}

class Services implements IServices {
  #container: IContainer = container;
  #initialized = false;

  get container(): IContainer {
    return this.#container;
  }

  use(container: IContainer): void {
    this.#container = container;
    this.#initialized = false;
  }

  get<T extends keyof typeof knownServices>(
    key: T
  ): (typeof knownServices)[T] extends Token<infer U> ? U : never {
    const token = knownServices[key] as Token<unknown>;
    return this.#container.get(
      token
    ) as (typeof knownServices)[T] extends Token<infer U> ? U : never;
  }

  registerDefaults(): void {
    if (this.#initialized) {
      return;
    }

    this.#container.register(condigHandlerService);
    this.#container.register(configProviderService);
    this.#container.register(loggerFactoryService);
    this.#container.register(gitService);
    this.#container.register(gitBuilderService);
    this.#container.register(gitHandlerService);
    this.#container.register(subprocessFactoryService);
    this.#container.register(fileSystemService);
    this.#container.register(sshService);
    this.#initialized = true;
  }
}

export const services: IServices = new Services();
