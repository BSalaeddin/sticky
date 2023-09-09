import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SideNavComponent } from './work-space/side-nav/side-nav.component';
import { NoteItemComponent } from './work-space/notes/note-item/note-item.component';
import { NotesComponent } from './work-space/notes/notes.component';
import { DeleteProjectDialog, ProjectItemComponent } from './work-space/side-nav/project-item/project-item.component';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatSidenavModule } from '@angular/material/sidenav';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { NgxUiLoaderModule, NgxUiLoaderConfig, SPINNER, PB_DIRECTION } from 'ngx-ui-loader';
import { ClickOutsideModule } from 'ng-click-outside';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { AuthComponent } from './Auth/auth.component';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error.interceptor';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthInterceptor } from './Auth/auth-interceptor';
import 'hammerjs';


const ngxUiLoaderConfig: NgxUiLoaderConfig = {
  fgsColor: '#f42d66',
  bgsColor: '#C0AAC1	',
  fgsSize: 100,
  blur: 5,
  overlayColor: 'rgba(238,238,238,0.8)',
  bgsType: SPINNER.rectangleBounce, // background spinner type
  fgsType: SPINNER.ballScaleMultiple, // foreground spinner type
  pbDirection: PB_DIRECTION.leftToRight, // progress bar direction
  pbThickness: 5,
  pbColor: '#f42d66'
};

@NgModule({
  declarations: [
    AppComponent,
    SideNavComponent,
    NoteItemComponent,
    NotesComponent,
    ProjectItemComponent,
    DeleteProjectDialog,
    WorkSpaceComponent,
    AuthComponent,
    ErrorComponent,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    DragDropModule,
    HttpClientModule,
    FormsModule,
    MatSidenavModule,
    MatTooltipModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatButtonModule,
    NgxUiLoaderModule.forRoot(ngxUiLoaderConfig),
    ClickOutsideModule

  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
