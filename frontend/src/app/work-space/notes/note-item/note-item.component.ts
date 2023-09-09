import { Component, Input } from '@angular/core';
import { Note, NoteColor } from '../note.model';
import { NotesService } from '../notes.service';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { CdkDragEnd } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-note-item',
  // Toggle note settings animation
  animations: [
    trigger('openCloseNoteSettings', [
      state('open', style({
        transform: 'translateX(-45px)'
      })),
      state('closed', style({
        transform: 'translateX(0px)',
        opacity: 0,

      })),
      transition('open => closed', [
        animate('150ms ease-in')
      ]),
      transition('closed => open', [
        animate('150ms ease-out')
      ]),
    ]),

  ],
  templateUrl: './note-item.component.html',
  styleUrls: ['./note-item.component.css']
})

export class NoteItemComponent {

  constructor(private notesService: NotesService) {}

  @Input() note: Note;

  freeDragPosition: { x: number, y: number };
  noteContent = '';
  noteSettingsIsOpen = false ;
  noteColorsIsOpen = false ;
  noteActionsIsOpen = true ;
  noteContentEditing = false ;
  inFront = false ;
  closed = false ;

  /**
   * Open and close note settings menu
   */
  toggleNoteSettingsMenu() {
    this.noteSettingsIsOpen = !this.noteSettingsIsOpen;
    this.noteActionsIsOpen = true;
    this.noteColorsIsOpen = false;
  }
  /**
   * Open colors selection
   */
  onOpenColors() {
    this.noteActionsIsOpen = false;
    this.noteColorsIsOpen = true;
  }
  /**
   * Bring note to front
   */
  onBringNoteToFront() {
    this.inFront = true;
  }
  /**
   * Save note position after CdkDragEnd event
   */
  onChangeNotePosition(event: CdkDragEnd) {
    const noteNewPosition = event.source.getFreeDragPosition();
    this.notesService.changeNotePosition(noteNewPosition, this.note._id);
  }
  /**
   * Delete note
   */
  onDeleteNote() {
    this.notesService.deleteNote(this.note._id);
  }
  /**
   * Change note color
   */
  onChangeColor(color: NoteColor) {
    this.noteSettingsIsOpen = false;
    this.notesService.changeNoteColor(color, this.note._id);
  }
  /**
   * Get current note content
   */
  getCurrentNoteContent(content: string) {
    this.noteContent = content;
  }
  /**
   * Save note content if changed
   */
  onChangeNoteContent(content: string) {
    // Test if content is changed
    if (content !== this.noteContent) {
      this.notesService.changeNoteContent(content, this.note._id);
    }
  }
  /**
   * Close note
   */
  onCloseNote() {
    this.notesService.closeNote(this.note._id);
  }
}
