import { logger } from '../logger.ts';

export interface ProcessResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly success: boolean;
}

export interface IRunProcess {
  run(args: string[], cwd?: string): Promise<ProcessResult>;
}

export class DenoRunProcess implements IRunProcess {
  async run(args: string[], cwd = Deno.cwd()): Promise<ProcessResult> {

    logger.debug(`Running ${args.join(' ')} in ${cwd}`);

    const p = Deno.run({
      cmd: args,
      stdout: 'piped',
      stderr: 'piped',
      cwd,
    });

    try {
      const [status, stdout, stderr] = await Promise.all([
        p.status(),
        p.output(),
        p.stderrOutput(),
      ]);
      p.close();
  
      return {
        code: status.code,
        stdout: new TextDecoder().decode(stdout),
        stderr: new TextDecoder().decode(stderr),
        success: status.success,
      };
    } catch (e) {
      logger.error(`Failed to run ${args.join(' ')} in ${cwd}`, e);
      return {
        code: 1,
        stdout: '',
        stderr: e.message,
        success: false,
      }
    }
  }
}
