export interface ITarget {
  readonly id: string;
  readonly isDefault: boolean;
  readonly name: string;

  init(setDefault: boolean): Promise<void>;
  reset(type: 'all' | 'settings' | 'content'): Promise<void>;
  setDefault(): Promise<void>;
  delete(): Promise<void>;
  setName(value: string): Promise<void>;
}

export interface ITargetHandler {
  get(id: string): Promise<ITarget | undefined>;
  create(name: string, id?: string, setDefault?: boolean): Promise<ITarget>;
  delete(id: string): Promise<void>;
}
