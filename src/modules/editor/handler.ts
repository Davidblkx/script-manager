import { EditorConfig, IConfigHandler } from '../config.ts';
import { getFileInfo } from '../utils/file.ts';
import { ISettingsManager, getSettingsObj, settingKeys } from '../settings.ts';
import type { IEditorHandler } from './models.ts';
import { IRunProcess } from '../infra/run-process.ts';

import { logger } from '../logger.ts';

const DEFAULT_TARGET_ALIAS = '__TARGET_PATH';

export class EditorHandler implements IEditorHandler {
  #settings: ReturnType<typeof getSettingsObj>;
  #settingsManager: ISettingsManager;
  #config: IConfigHandler;
  #runner: IRunProcess;

  constructor({
    settings,
    config,
    runner,
  }: {
    settings: ISettingsManager;
    config: IConfigHandler;
    runner: IRunProcess;
  }) {
    this.#settings = getSettingsObj(settings);
    this.#config = config;
    this.#runner = runner;
    this.#settingsManager = settings;
  }

  get(name: string): EditorConfig | undefined {
    const localFile = this.#config.localFile;
    if (!localFile) {
      logger.error('No local file loaded');
      return undefined;
    }

    return localFile.config.editors[name];
  }

  getDefault(type: 'folder' | 'file' | 'diff'): EditorConfig | undefined {
    const id = this.#settings.editor[type].tool;
    if (typeof id !== 'string') {
      logger.error(`No default editor for ${type}`);
      return undefined;
    }

    return this.get(id);
  }

  async setDefault(editor: string, type: 'folder' | 'file' | 'diff', saveToTarget: boolean): Promise<void> {
    const config = this.get(editor);
    if (!config) { return }

    if (!this.#canEdit(config, type)) {
      logger.error(`Editor ${editor} is not configured for '${type}'`);
      return;
    }

    const saveTarget = saveToTarget ? 'target' : 'local';

    logger.debug(`Setting default editor for ${type} to ${editor} [${saveTarget}]`);
    await this.#settingsManager.setSetting(settingKeys.editor[type].tool, editor, saveTarget);
  }

  async edit(path: string, editor?: string): Promise<void> {
    const info = await getFileInfo(path);
    if (!info) {
      logger.error(`File not found: ${path}`);
      return;
    }

    const type = info.isDirectory ? 'folder' : 'file';
    const config = editor ? this.get(editor) : this.getDefault(type);

    if (!config) {
      logger.error(`No editor configured for ${type}`);
      return;
    }

    if (!this.#canEdit(config, type)) {
      logger.error(`Editor ${editor} is not configured for '${type}'`);
      return;
    }

    const argAlias = config.targetAlias ?? DEFAULT_TARGET_ALIAS;
    const args = config.args.map((arg) => {
      if (arg === argAlias) {
        return path;
      }
      return arg;
    });

    await this.#runner.run(args);
  }

  #canEdit(editor: EditorConfig, type: 'folder' | 'file' | 'diff'): boolean {
    if (editor.context === type) { return true; }
    if (Array.isArray(editor.context) && editor.context.includes(type)) { return true; }
    return false;
  }
}
