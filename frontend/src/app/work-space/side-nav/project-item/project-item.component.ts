import { Component, OnInit, Input} from '@angular/core';
import { Project } from '../project.model';
import { MatDialog } from '@angular/material/dialog';
import { ProjectsService } from '../projects.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-item',
  templateUrl: './project-item.component.html',
  styleUrls: ['./project-item.component.css']
})
export class ProjectItemComponent {

  selected = false;
  @Input() project: Project;

  constructor(public dialog: MatDialog,
              private projectsService: ProjectsService,
              private ngxLoader: NgxUiLoaderService,
              private router: Router) {}

  openDialog(event): void {
    event.stopPropagation();
    // Open delete project confirmation
    const dialogRef = this.dialog.open(DeleteProjectDialog, {width: '400px'});
    dialogRef.afterClosed().subscribe(result => {
      // If deleting confirmed refresh project list
      if (result) {
          this.projectsService.deletProject(this.project._id).subscribe(() => {
          this.projectsService.getProjects();
          this.router.navigate(['projects']); // Redirect to /projects
        });
      }
    });
  }
}

@Component({
  selector: 'delete-project-confirmation',
  templateUrl: 'delete-project-confirmation.html',
  styleUrls: ['delete-project-confirmation.css']
})
export class DeleteProjectDialog {}
