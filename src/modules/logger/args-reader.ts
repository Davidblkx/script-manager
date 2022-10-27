import { parseFlags } from 'cliffy/flags/flags.ts'
import { LogLevel } from "./models.ts";

export function readLogLevel(): LogLevel {

  const args = Deno.args.filter(e =>
    e === '-v' || e === '--verbose'
    || e === '-q' || e === '--quiet'
  );

  const parsed = parseFlags(args, {
    flags: [{
      name: 'quiet',
      aliases: ['q'],
      type: 'boolean',
    }, {
      name: 'verbose',
      aliases: ['v'],
      type: 'boolean',
    }],
    stopEarly: true,
  });

  if (parsed.flags.quiet) {
    return LogLevel.disabled;
  } else if(parsed.flags.verbose) {
    return LogLevel.all;
  }

  return LogLevel.info;
}
