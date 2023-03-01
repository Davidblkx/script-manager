// deno-lint-ignore-file no-explicit-any
export type Token<T> = symbol & { __type: T };

export interface IContainer {
  get<T>(token: Token<T>): T;
  register<T>(service: IService<T>): void;
}

export type IServiceDep0<T> = {
  token: Token<T>;
  target: new () => T;
  deps?: [];
};

export type IServiceDep1<T, D1> = {
  token: Token<T>;
  target: new (dep1: D1) => T;
  deps: [Token<D1>];
};

export type IServiceDep2<T, D1, D2> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2) => T;
  deps: [Token<D1>, Token<D2>];
};

export type IServiceDep3<T, D1, D2, D3> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>];
};

export type IServiceDep4<T, D1, D2, D3, D4> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>];
};

export type IServiceDep5<T, D1, D2, D3, D4, D5> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4, dep5: D5) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>, Token<D5>];
};

export type IServiceDep6<T, D1, D2, D3, D4, D5, D6> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4, dep5: D5, dep6: D6) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>, Token<D5>, Token<D6>];
};

export type IServiceDep7<T, D1, D2, D3, D4, D5, D6, D7> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4, dep5: D5, dep6: D6, dep7: D7) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>, Token<D5>, Token<D6>, Token<D7>];
};

export type IServiceDep8<T, D1, D2, D3, D4, D5, D6, D7, D8> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4, dep5: D5, dep6: D6, dep7: D7, dep8: D8) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>, Token<D5>, Token<D6>, Token<D7>, Token<D8>];
};

export type IServiceDep9<T, D1, D2, D3, D4, D5, D6, D7, D8, D9> = {
  token: Token<T>;
  target: new (dep1: D1, dep2: D2, dep3: D3, dep4: D4, dep5: D5, dep6: D6, dep7: D7, dep8: D8, dep9: D9) => T;
  deps: [Token<D1>, Token<D2>, Token<D3>, Token<D4>, Token<D5>, Token<D6>, Token<D7>, Token<D8>, Token<D9>];
};

export type IService<T> =
  | IServiceDep0<T>
  | IServiceDep1<T, any>
  | IServiceDep2<T, any, any>
  | IServiceDep3<T, any, any, any>
  | IServiceDep4<T, any, any, any, any>
  | IServiceDep5<T, any, any, any, any, any>
  | IServiceDep6<T, any, any, any, any, any, any>
  | IServiceDep7<T, any, any, any, any, any, any, any>
  | IServiceDep8<T, any, any, any, any, any, any, any, any>
  | IServiceDep9<T, any, any, any, any, any, any, any, any, any>;

export type DepList = [unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown, unknown];
