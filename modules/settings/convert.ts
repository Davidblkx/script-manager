export interface Converter<T> {
  toString(value: T): string | undefined;
  fromString(value: string): T | undefined;
}

export interface ConvertMap {
  string: Converter<string>;
  number: Converter<number>;
  boolean: Converter<boolean>;
}

export const converters: ConvertMap = {
  string: {
    toString: (value: string) => value,
    fromString: (value: string) => value,
  },
  number: {
    toString: (value: number) => value.toString(),
    fromString: (value: string) => Number(value),
  },
  boolean: {
    toString: (value: boolean) => value.toString(),
    fromString: (value: string) => value === 'true',
  },
};
