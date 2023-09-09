import { Component, OnInit, OnDestroy } from '@angular/core';
import { NotesService } from './notes.service';
import { Note } from './note.model';
import { Subscription } from 'rxjs';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
  styleUrls: ['./notes.component.css']
})

export class NotesComponent implements OnInit, OnDestroy {

  notes: Note[] = []; // Notes array
  notesSub: Subscription; // Notes subscription to save getNoteUpdateListener() execution

  projectId: string;
  projectChangingAnimation = false;
  projectChanged = false;
  invisibleNotesCount = 0;

  constructor(private notesService: NotesService, public route: ActivatedRoute, private ngxLoader: NgxUiLoaderService) { }

  ngOnInit() {
    // Get the project ID from current activated route and fetch its notes
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('projectId')) {
        this.projectId = paramMap.get('projectId');
        this.notesService.getNotes(this.projectId);
      }
    });
    // Listening to note updates
    this.notesSub = this.notesService.getNoteUpdateListener()
      .subscribe((noteData) => {

        this.notes = noteData.notes;

        // Counting invisible notes
        this.invisibleNotesCount = 0;
        for (let note of this.notes) {
          if (!note.visible) {
            this.invisibleNotesCount++;
          }
        }

        this.projectChanged = noteData.projectChanged;
        this.ngxLoader.stop(); // Stop loader
        // Animate save button if project has changed
        if ( this.projectChanged ) {
          this.projectChangingAnimation = true;
        } else {
          this.projectChangingAnimation = false;
        }
      });
  }

  /**
   * Adding note
   */
  onAddNote() {
    this.notesService.addNote();
  }
  /**
   * Saving project changes if exist
   */
  onSaveNotesChanges() {
    if (this.projectChanged) {
      this.notesService.saveNotesChanges(this.projectId);
    }
  }
  /**
   * Showing invisible notes
   */
  onShowInvisibleNotes() {
    if (this.invisibleNotesCount > 0) {
      this.notesService.showInvisibleNote();
    }
  }
  /**
   * Unsubscribing notesSub
   */
  ngOnDestroy() {
    this.notesSub.unsubscribe();
  }

}
