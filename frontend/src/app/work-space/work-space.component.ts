import { Component } from '@angular/core';

@Component({
  selector: 'app-work-space',
  templateUrl: './work-space.component.html',
  styleUrls: ['./work-space.component.css']
})
export class WorkSpaceComponent {
  // Display help text if there is no selected project
  selectedProject = false;
  onActivate(event: any) {
    this.selectedProject = true;
  }
}
