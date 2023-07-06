import { colors } from 'https://deno.land/x/cliffy@v1.0.0-rc.1/ansi/colors.ts';
import { Input } from 'https://deno.land/x/cliffy@v1.0.0-rc.1/prompt/mod.ts';
import { isInteractive, opt } from './options.ts';

type Colors = typeof colors;
type ColorKeys = keyof Colors;

export function C<C extends ColorKeys>(
  key: C,
  message: string,
): Colors[C] extends (str: string) => string ? string : never {
  // deno-lint-ignore no-explicit-any
  return opt.useColors ? (colors[key] as any)(message) : message;
}

export function E(e: string, alt = ''): string {
  return opt.useEmojis ? e : alt;
}

export async function requestInput({
  message,
  flag,
  defaultValue,
  hint,
}: {
  message: string;
  flag: string;
  defaultValue?: string;
  hint?: string;
}): Promise<string> {
  const flagValue = Deno.args.find((a) => a.startsWith(`${flag}=`));
  if (flagValue) return flagValue.split('=')[1].replace(/^['"](.*)['"]$/, '$1');

  if (!isInteractive()) {
    if (!defaultValue) {
      throw new Error(`${flag} flag is required in non-interactive mode!`);
    }
    return defaultValue;
  }

  return await Input.prompt({
    message: C('yellow', message),
    default: defaultValue,
    hint,
  });
}
