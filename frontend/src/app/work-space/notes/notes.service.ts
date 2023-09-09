import { Note, NoteColor } from './note.model';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import ObjectID from 'bson-objectid';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { ProjectsService } from '../side-nav/projects.service';
import { Router } from '@angular/router';

const BACKEND_URL = environment.apiUrl + '/projects/';

@Injectable({providedIn: 'root'})

export class NotesService {

  private notes: Note[] = []; // Array of notes
  // This Subject is used to emit an event with every note changes
  private notesUpdated = new Subject<{notes: Note[], projectChanged: boolean}>();

  constructor(private http: HttpClient,
              private ngxLoader: NgxUiLoaderService,
              private projectsService: ProjectsService,
              private router: Router) {}
  /**
   * Getting and returning notesUpdated Subject as an Observable
   */
  getNoteUpdateListener() {
    return this.notesUpdated.asObservable();
  }
  /**
   * Gettign project notes from api
   * @param  {string} projectId
   */
  getNotes(projectId: string) {
    this.ngxLoader.start(); // Start loader
    // Api request
    this.http.get<{message: string, notes: Note[]}>(BACKEND_URL + projectId + '/notes')
    .subscribe(responseData => {
      this.notes = responseData.notes;
      if (responseData.notes.length === 0) {
        this.notesUpdated.next({notes: [], projectChanged: false}); // Emit notes changes
      } else {
        this.notesUpdated.next({notes: [...this.notes], projectChanged: false}); // Emit notes changes
      }
    }, error => {
      this.ngxLoader.stop(); // Stop loader
      this.router.navigate(['projects']); // Redirect to /projects
    });
  }

  /**
   * Adding empty note
   */
  addNote() {
    const id  = new ObjectID(); // Generate an id
    // New note object
    const note: Note = { _id:  id.toString(),
                         content: '',
                         position: {x: Math.random() * 200, y:  Math.random() * 200}, // Random position
                         color: NoteColor.COLOR_4, visible: true };
    this.notes.push(note);
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
  /**
   * Deleting note by id
   * @param  {string} id
   */
  deleteNote(id: string) {
    this.notes = this.notes.filter( note => note._id !== id);
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
  /**
   * Changing note color by id
   * @param  {NoteColor} color
   * @param  {string} id
   */
  changeNoteColor(color: NoteColor, id: string) {
    this.notes.find(note => note._id === id).color = color;
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
  /**
   * Changing note position by id
   * @param  {{x: number, y: number}} position
   * @param  {string} id
   */
  changeNotePosition(position: {x: number, y: number} , id: string) {
    this.notes.find(note => note._id === id).position = position;
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
  /**
   * Changing note content by id
   * @param  {string} content
   * @param  {string} id
   */
  changeNoteContent(content: string, id: string) {
    this.notes.find(note => note._id === id).content = content;
    this.notesUpdated.next(
      {notes: [...this.notes], projectChanged: true}
    );
  }
  /**
   * Saving project chnages by id
   * @param  {string} projectId
   */
  saveNotesChanges(projectId: string) {
     this.ngxLoader.start(); // Start loader
     // Api request
     this.http.post<{ message: string, note: Note }>( BACKEND_URL + projectId + '/notes', this.notes)
    .subscribe(responseData => {
      this.projectsService.getProjects(); // Update projects
      this.notesUpdated.next({notes: [...this.notes], projectChanged: false}); // Emit notes changes
    }, error  => {
      this.ngxLoader.stop(); // Stop loader
    });
  }
  /**
   * Closing a note by id
   * @param  {string} id
   */
  closeNote(id: string) {
    this.notes.find(note => note._id === id).visible = false;
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
  /**
   * Showing invisible notes a note
   */
  showInvisibleNote() {
    this.notes = this.notes.map( note => {
      if (!note.visible) { note.visible = true; }
      return note;
    });
    this.notesUpdated.next({notes: [...this.notes], projectChanged: true}); // Emit notes changes
  }
}
