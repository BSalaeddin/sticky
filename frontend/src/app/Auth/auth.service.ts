import { Injectable } from '@angular/core';
import { AuthData } from './auth-data.model';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { NgxUiLoaderService } from 'ngx-ui-loader';

const BACKEND_URL = environment.apiUrl + '/user/';

@Injectable({ providedIn: 'root'})

export class AuthService {
  private token: string;
  private authStatusListener = new Subject<boolean>();
  private tokenTimer: any;
  private userId: string;
  private isAuthenticated = false;

  constructor(private http: HttpClient,
              private router: Router,
              private ngxLoader: NgxUiLoaderService) {}
  /**
   * Creating new user
   * @param  {string} email
   * @param  {string} password
   */
  createUser(email: string, password: string) {
    this.ngxLoader.start(); // Start loader
    const authData: AuthData = {email: email, password: password};
    return this.http.post( BACKEND_URL + 'signup', authData); // Api request
  }
  /**
   * Authenticating user
   * @param  {string} email
   * @param  {string} password
   */
  login(email: string, password: string) {
    this.ngxLoader.start(); // Start loader
    const authData: AuthData = {email: email, password: password};
    // Api request
    this.http.post<{token: string, expiresIn: number, userId: string}>( BACKEND_URL + 'login', authData)
      .subscribe( response => {
        const token = response.token;
        this.token = token;
        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true); // Emit auth changes
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(['/projects']); // Redirect to /projects
        }
        this.ngxLoader.stop(); // Stop loader
      }, () => {
        this.ngxLoader.stop(); // Stop loader
        this.authStatusListener.next(false); // Emit auth changes
      });
  }
  /**
   * Getting user id
   */
  getUserId() {
    return this.userId;
  }
  /**
   * Logout user
   */
  logout() {
    this.ngxLoader.start(); // Start loader
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false); // Emit auth changes
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/auth/login-register']);
    this.ngxLoader.stop();
  }
  /**
   * Getting token
   */
  getToken() {
    return this.token;
  }
  /**
   * Getting and returning authStatusListener Subject as an Observable
   */
  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }
  /**
   * Getting isAuthenticated
   */
  getIsAuth() {
    return this.isAuthenticated;
  }
  /**
   * Automatic authenticating user
   */
  autoAuthUser() {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }
    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      this.userId = authInformation.userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', this.userId);
  }
  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }
  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem('userId');
    if (!token || !expirationDate) {
      return;
    }
    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }
}
