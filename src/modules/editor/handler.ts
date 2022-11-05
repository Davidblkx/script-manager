import { EditorConfig, IConfigHandler } from '../config.ts';
import { getFileInfo } from '../utils/file.ts';
import { ISettingsManager, ISection } from '../settings.ts';
import type { IEditorHandler } from './models.ts';
import { IRunProcess } from '../infra/run-process.ts';
import { logger } from '../logger.ts';
import { editorSection, EditorSettings } from './settings.ts';

const DEFAULT_TARGET_ALIAS = '__TARGET_PATH';

export class EditorHandler implements IEditorHandler {
  #section: ISection<EditorSettings>;
  #config: IConfigHandler;
  #runner: IRunProcess;

  get #settings() {
    return this.#section.value;
  }

  constructor({
    settings,
    config,
    runner,
  }: {
    settings: ISettingsManager;
    config: IConfigHandler;
    runner: IRunProcess;
  }) {
    this.#section = editorSection(settings);
    this.#config = config;
    this.#runner = runner;
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
    const key: keyof EditorSettings = `editor.${type}.tool`;
    const id = this.#settings[key];
    if (typeof id !== 'string') {
      logger.error(`No default editor for ${type}`);
      return undefined;
    }

    return this.get(id);
  }

  async setDefault(editor: string, type: 'folder' | 'file' | 'diff', _: boolean): Promise<void> {
    const key: keyof EditorSettings = `editor.${type}.tool`;
    const config = this.get(editor);
    if (!config) { return }

    if (!this.#canEdit(config, type)) {
      logger.error(`Editor ${editor} is not configured for '${type}'`);
      return;
    }

    logger.debug(`Setting default editor for ${type} to ${editor}`);
    await this.#section.set(key, editor);
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
