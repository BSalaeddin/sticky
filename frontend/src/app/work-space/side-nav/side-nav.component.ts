import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import { ProjectsService } from './projects.service';
import { Subscription } from 'rxjs';
import { Project } from './project.model';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { AuthService } from 'src/app/Auth/auth.service';

@Component({
  selector: 'app-side-nav',
  templateUrl: './side-nav.component.html',
  styleUrls: ['./side-nav.component.css']
})
export class SideNavComponent implements OnInit, OnDestroy {

  projects: Project[] = []; // Array of projects
  projectsSub: Subscription; // Project subscription to save getProjectUpdateListener() execution
  newProject = false;
  projectTitle = '';
  @ViewChild('drawer', {static: true}) drawer: MatDrawer;

  constructor(private projectService: ProjectsService,
              private ngxLoader: NgxUiLoaderService,
              private authService: AuthService) {}

  ngOnInit() {
    this.projectService.getProjects();
    // Listening to project updates
    this.projectsSub = this.projectService.getProjectUpdateListener()
    .subscribe((projects: Project[]) => {
      this.projects = projects;
      this.drawer.open(); // Opening drawer
      this.ngxLoader.stop(); // Stop loader
    },
    err => {
      this.ngxLoader.stop(); // Stop loader
    });
  }
  /**
   * Adding new project
   */
  onAddProject() {
    if ( this.projectTitle !== '') {
      this.newProject = false;
      this.projectService.addProject(this.projectTitle);
      this.projectTitle = '';
    }
  }
  /**
   * Displaying new project input
   */
  onDisplayNewProjectInput() {
    if ( !this.drawer.opened ) {
      this.drawer.toggle();
    }
    setTimeout(() => {
      this.newProject = true;
    }, 350);
  }
  /**
   * Logging
   */
  onLogout() {
    this.authService.logout();
  }
  /**
   * Unsubscribing notesSub
   */
  ngOnDestroy() {
    this.projectsSub.unsubscribe();
  }
}
