import { Note } from '../notes/note.model';

export interface Project {
  _id: string;
  title: string;
  notes: Note[];
  createdAt: number;
}
