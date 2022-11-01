import { IConfigHandler } from "../../modules/config.ts";
import { EditorHandler, IEditorHandler } from "../../modules/editor.ts";
import { DenoRunProcess } from "../../modules/infra/run-process.ts";
import { ISettingsManager } from "../../modules/settings.ts";

export function initEditorHandler(config: IConfigHandler, settings: ISettingsManager): IEditorHandler {
  return new EditorHandler({ config, settings, runner: new DenoRunProcess() });
}
