import type {
  IService,
  IServiceDep0,
  IServiceDep1,
  IServiceDep2,
  IServiceDep3,
  IServiceDep4,
  IServiceDep5,
  IServiceDep6,
  IServiceDep7,
  IServiceDep8,
  IServiceDep9,
  Token,
  IServiceInstanceDep0,
  IServiceInstanceDep1,
  IServiceInstanceDep2,
  IServiceInstanceDep3,
  IServiceInstanceDep4,
  IServiceInstanceDep5,
  IServiceInstanceDep6,
  IServiceInstanceDep7,
  IServiceInstanceDep8,
  IServiceInstanceDep9,
  InstanceFactoryDep0,
  InstanceFactoryDep1,
  InstanceFactoryDep2,
  InstanceFactoryDep3,
  InstanceFactoryDep4,
  InstanceFactoryDep5,
  InstanceFactoryDep6,
  InstanceFactoryDep7,
  InstanceFactoryDep8,
  InstanceFactoryDep9,
  IServiceInstance,
  IServiceTarget,
} from './model.ts';

export function createToken<T>(name: string, singleton = true): Token<T> {
  return (singleton ? Symbol.for(name) : Symbol(name)) as Token<T>;
}

export function declareService<T>(token: Token<T>, target: new () => T): IServiceDep0<T>;
export function declareService<T, T1>(
  token: Token<T>,
  target: new (t1: T1) => T,
  ...deps: [Token<T1>]
): IServiceDep1<T, T1>;
export function declareService<T, T1, T2>(
  token: Token<T>,
  target: new (t1: T1, t2: T2) => T,
  ...deps: [Token<T1>, Token<T2>]
): IServiceDep2<T, T1, T2>;
export function declareService<T, T1, T2, T3>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>]
): IServiceDep3<T, T1, T2, T3>;
export function declareService<T, T1, T2, T3, T4>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>]
): IServiceDep4<T, T1, T2, T3, T4>;
export function declareService<T, T1, T2, T3, T4, T5>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>]
): IServiceDep5<T, T1, T2, T3, T4, T5>;
export function declareService<T, T1, T2, T3, T4, T5, T6>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>]
): IServiceDep6<T, T1, T2, T3, T4, T5, T6>;
export function declareService<T, T1, T2, T3, T4, T5, T6, T7>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>]
): IServiceDep7<T, T1, T2, T3, T4, T5, T6, T7>;
export function declareService<T, T1, T2, T3, T4, T5, T6, T7, T8>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>, Token<T8>]
): IServiceDep8<T, T1, T2, T3, T4, T5, T6, T7, T8>;
export function declareService<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  token: Token<T>,
  target: new (t1: T1, t2: T2, t3: T3, t4: T4, t5: T5, t6: T6, t7: T7, t8: T8, t9: T9) => T,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>, Token<T8>, Token<T9>]
): IServiceDep9<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>;
export function declareService<T>(
  token: Token<T>,
  target: new (...args: unknown[]) => T,
  ...deps: Token<unknown>[]
): IServiceTarget<T> {
  return { token, target, deps } as unknown as IServiceTarget<T>;
}

export function declareFactory<T>(token: Token<T>, instance: T): IServiceInstanceDep0<T>;
export function declareFactory<T>(token: Token<T>, factory: InstanceFactoryDep0<T>): IServiceInstanceDep0<T>;
export function declareFactory<T, T1>(
  token: Token<T>,
  instance: InstanceFactoryDep1<T, T1>,
  ...deps: [Token<T1>]
): IServiceInstanceDep1<T, T1>;
export function declareFactory<T, T1, T2>(
  token: Token<T>,
  factory: InstanceFactoryDep2<T, T1, T2>,
  ...deps: [Token<T1>, Token<T2>]
): IServiceInstanceDep2<T, T1, T2>;
export function declareFactory<T, T1, T2, T3>(
  token: Token<T>,
  factory: InstanceFactoryDep3<T, T1, T2, T3>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>]
): IServiceInstanceDep3<T, T1, T2, T3>;
export function declareFactory<T, T1, T2, T3, T4>(
  token: Token<T>,
  factory: InstanceFactoryDep4<T, T1, T2, T3, T4>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>]
): IServiceInstanceDep4<T, T1, T2, T3, T4>;
export function declareFactory<T, T1, T2, T3, T4, T5>(
  token: Token<T>,
  factory: InstanceFactoryDep5<T, T1, T2, T3, T4, T5>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>]
): IServiceInstanceDep5<T, T1, T2, T3, T4, T5>;
export function declareFactory<T, T1, T2, T3, T4, T5, T6>(
  token: Token<T>,
  factory: InstanceFactoryDep6<T, T1, T2, T3, T4, T5, T6>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>]
): IServiceInstanceDep6<T, T1, T2, T3, T4, T5, T6>;
export function declareFactory<T, T1, T2, T3, T4, T5, T6, T7>(
  token: Token<T>,
  factory: InstanceFactoryDep7<T, T1, T2, T3, T4, T5, T6, T7>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>]
): IServiceInstanceDep7<T, T1, T2, T3, T4, T5, T6, T7>;
export function declareFactory<T, T1, T2, T3, T4, T5, T6, T7, T8>(
  token: Token<T>,
  factory: InstanceFactoryDep8<T, T1, T2, T3, T4, T5, T6, T7, T8>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>, Token<T8>]
): IServiceInstanceDep8<T, T1, T2, T3, T4, T5, T6, T7, T8>;
export function declareFactory<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>(
  token: Token<T>,
  factory: InstanceFactoryDep9<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>,
  ...deps: [Token<T1>, Token<T2>, Token<T3>, Token<T4>, Token<T5>, Token<T6>, Token<T7>, Token<T8>, Token<T9>]
): IServiceInstanceDep9<T, T1, T2, T3, T4, T5, T6, T7, T8, T9>;
export function declareFactory<T>(
  token: Token<T>,
  factory: InstanceFactoryDep0<T> | T,
  ...deps: Token<unknown>[]
): IServiceInstance<T> {
  return { token, instance: factory, deps } as unknown as IServiceInstance<T>;
}

export function isServiceTarget<T>(target: unknown): target is IServiceTarget<T> {
  return typeof (target as IServiceTarget<T>)?.token === 'symbol'
    && typeof (target as IServiceTarget<T>)?.target === 'function';
}

export function isServiceInstance<T>(instance: unknown): instance is IServiceInstance<T> {
  return typeof (instance as IServiceInstance<T>)?.token === 'symbol'
    && typeof (instance as IServiceInstance<T>)?.instance !== 'undefined';
}
