import { createSection, createKeys } from '../settings.ts';

export type EditorSettings = {
  'editor.file.tool': string;
  'editor.folder.tool': string;
  'editor.diff.tool': string;
};

export const editorSection = createSection<EditorSettings>();
export const editorKeys = createKeys<EditorSettings>();
