export interface ProcessResult {
  readonly code: number;
  readonly stdout: string;
  readonly stderr: string;
  readonly success: boolean;
}

export interface IRunProcess {
  run(args: string[]): Promise<ProcessResult>;
}

export class DenoRunProcess {
  async run(args: string[]): Promise<ProcessResult> {
    const p = Deno.run({
      cmd: args,
      stdout: 'piped',
      stderr: 'piped',
    });
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
  }
}
