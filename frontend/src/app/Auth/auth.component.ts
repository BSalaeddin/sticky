import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { AuthService } from './auth.service';
import { NgxUiLoaderService } from 'ngx-ui-loader';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  userCreated = false;
  constructor(private authService: AuthService,
              private ngxLoader: NgxUiLoaderService,
              private router: Router) {}

  ngOnInit() {
    // Redirect to /project if user is authenticated
    if ( this.authService.getIsAuth() ) { this.router.navigate(['/projects']); }
  }
  /**
   * Authenticate user
   * @param  {NgForm} form
   */
  onLogin(form: NgForm) {
    if (form.invalid) { return; }
    this.authService.login(form.value.email, form.value.password);
  }
  /**
   * Register new user
   * @param  {NgForm} form
   */
  onSignup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    this.authService.createUser(form.value.email, form.value.password)
    .subscribe(() => {
      this.ngxLoader.stop(); // Stop loader
      this.userCreated = true;
      form.reset();
      setTimeout(() => {
        location.reload(); // Reload page
      }, 700);
    },
    () => {
      this.ngxLoader.stop();
    });
  }
}
