import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotesComponent } from './work-space/notes/notes.component';
import { WorkSpaceComponent } from './work-space/work-space.component';
import { AuthComponent } from './Auth/auth.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { AuthGuard } from './Auth/auth.guard';

// Routes definition
const routes: Routes = [
  { path: 'projects', component: WorkSpaceComponent, children: [
    { path: ':projectId', component: NotesComponent, canActivate: [AuthGuard]},
  ], canActivate: [AuthGuard]},
  { path: 'auth/login-register', component: AuthComponent},
  { path: '', redirectTo: 'auth/login-register', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
