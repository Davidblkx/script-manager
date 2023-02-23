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
): IService<T> {
  return { token, target, deps } as unknown as IService<T>;
}
