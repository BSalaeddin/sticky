
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Project } from './project.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';


const BACKEND_URL = environment.apiUrl + '/projects/';


@Injectable(
  {providedIn: 'root'}
)

export class ProjectsService {

  private projects: Project[] = []; // Array of projects
  // This Subject is used to emit an event with every project changes
  private projectsUpdated = new Subject<Project[]>();

  constructor(private http: HttpClient,
              private ngxLoader: NgxUiLoaderService,
              private router: Router) {}
  /**
   * Getting and returning projectsUpdated Subject as an Observable
   */
  getProjectUpdateListener() {
    return this.projectsUpdated.asObservable();
  }
  /**
   * Getting authenticated user projects from api
   */
  getProjects() {
    this.ngxLoader.start(); // Start loader
    // Api request
    this.http.get<{message: string, projects: Project[]}>(BACKEND_URL)
    .subscribe(responseData => {
      this.projects = responseData.projects;
      this.projectsUpdated.next([...this.projects]); // Emit projects changes
    });
  }
  /**
   * Adding new project
   * @param {string} projectTitle
   */
  addProject(projectTitle: string) {
    this.ngxLoader.start(); // Start loader
    // New project object
    const project: Project = {_id: null, title: projectTitle, notes: [], createdAt: Date.now()};
    // Api request
    this.http
    .post<{ message: string, project: Project }>( BACKEND_URL, project)
    .subscribe(responseData => {
      this.projects.push(responseData.project);
      this.projectsUpdated.next([...this.projects]); // Emit projects changes
      this.router.navigate(['projects']); // Redirect to /projects
    });
  }
  /**
   * Deleting project by id
   * @param {string} projectId
   */
  deletProject(projectId: string) {
    return this.http.delete(BACKEND_URL + projectId);
  }
}
