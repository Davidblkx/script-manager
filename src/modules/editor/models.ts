import type { EditorConfig } from '../config.ts';

export interface IEditorHandler {

  edit(path: string, editor?: string): Promise<void>;

  get(name: string): EditorConfig | undefined;
  setDefault(editor: string, type: 'folder' | 'file' | 'diff', saveToTarget: boolean): Promise<void>;
  getDefault(type: 'folder' | 'file' | 'diff'): EditorConfig | undefined;
}
