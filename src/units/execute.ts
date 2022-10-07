import { write } from 'tty';
import { logger } from '../logger.ts';
import { Hook } from './models.ts';
import { getUnitManager, UnitStatus } from './unit-manager.ts';
import type { HookProps } from '../core/hooks.ts';

export async function showHelpForCommands(command: string, unitIdOrName?: string): Promise<void> {
  const units = loadByCommandHook(command, unitIdOrName);
  if (!units) { return; }

  const helpList: Record<string, string> = {};

  for (const unit of units) {
    logger.debug(`Loading help for unit ${unit.id}`);
    const cmdHelp = await getHelpForCommand(command, unit);
    if (cmdHelp) {
      helpList[unit.name] = cmdHelp;
    }
  }

  if (Object.keys(helpList).length === 0) {
    logger.debug(`No help found for command ${command}`);
    return;
  }

  await write(`About ${command}:\n`, Deno.stdout);

  for (const [name, help] of Object.entries(helpList)) {
    await write(` - ${name}\n`, Deno.stdout);
    await write(`   ${help}\n`, Deno.stdout);
  }
}

export async function dryRunCommand(command: string, props: HookProps, unitIdOrName?: string): Promise<void> {
  const units = loadByCommandHook(command, unitIdOrName);
  if (!units) { return; }

  for (const unit of units) {
    const hook = unit.hooks[command as unknown as Hook];
    if (!hook) {
      logger.error(`Command hook '${command}' not found in unit ${unit.name}`);
      return;
    }

    try {
      logger.debug(`Running dry-run for unit ${unit.id}`);
      await hook.dry(props)
    } catch (e) {
      logger.error(`Error running dry-run for unit ${unit.name}: ${e}`);
    }
  }
}

export async function executeCommand(command: string, props: HookProps, unitIdOrName?: string): Promise<void> {
  const units = loadByCommandHook(command, unitIdOrName);
  if (!units) { return; }

  for (const unit of units) {
    const hook = unit.hooks[command as unknown as Hook];
    if (!hook) {
      logger.error(`Command hook '${command}' not found in unit ${unit.name}`);
      return;
    }

    try {
      logger.debug(`Running command for unit ${unit.id}`);
      await hook.handler(props)
    } catch (e) {
      logger.error(`Error running command for unit ${unit.name}: ${e}`);
    }
  }
}

async function getHelpForCommand(command: string, unit: UnitStatus): Promise<string | undefined> {
  const hook = unit.hooks[command as unknown as Hook];
  if (!hook) {
    logger.error(`Command hook '${command}' not found in unit ${unit.name}`);
    return undefined;
  }

  try {
    return await hook.help();
  } catch (e) {
    logger.error(`Error generating help for unit ${unit.name} in command ${command}`, e);
    return undefined;
  }
}

function loadByCommandHook(command: string, unitIdOrName?: string): UnitStatus[] | undefined {
  const unitManager = getUnitManager();
  const units = unitIdOrName ?
    unitManager.getUnitById(unitIdOrName) || unitManager.getUnitByName(unitIdOrName)
    : unitManager.getUnits({ hook: command, enabled: true, installed: true });

  if (!!unitIdOrName && !units) {
    logger.error(`Unit ${unitIdOrName} not found`);
    return;
  }

  if (Array.isArray(units) && units.length === 0) {
    logger.error(`No units found for command ${command}`);
    return;
  }

  return Array.isArray(units)
    ? units
    : units
      ? [units]
      : undefined;
}
