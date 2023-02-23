import type { DepList, IContainer, IService } from './model.ts';

export class Container implements IContainer {
  #services: Map<symbol, IService<unknown>> = new Map();
  #singletons: Map<symbol, unknown> = new Map();

  get<T>(token: symbol): T {
    if (this.#singletons.has(token)) {
      return this.#singletons.get(token) as T;
    }

    const service = this.#services.get(token);
    if (!service) {
      throw new Error(`Service not found: ${token.toString()}`);
    }

    const deps = (service.deps?.map((dep) => this.get(dep)) ?? []) as unknown as DepList;
    const instance = new service.target(...deps);

    if (this.#isSingleton(service)) {
      this.#singletons.set(token, instance);
    }

    return instance as T;
  }

  register<T>(service: IService<T>): void {
    this.#services.set(service.token, service.target as unknown as IService<unknown>);
    this.#singletons.delete(service.token);
  }

  #isSingleton<T>(service: IService<T>): boolean {
    return service.token === Symbol.for(service.target.name);
  }
}

export const container = new Container();
