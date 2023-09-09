export enum NoteColor {
  COLOR_1 = 'note-color-1',
  COLOR_2 = 'note-color-2',
  COLOR_3 = 'note-color-3',
  COLOR_4 = 'note-color-4'
}
export interface Note {
  _id: string;
  content: string;
  position: { x: number, y: number };
  color: NoteColor;
  visible: boolean;
}
