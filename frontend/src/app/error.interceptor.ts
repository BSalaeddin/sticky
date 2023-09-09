import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ErrorComponent } from './error/error.component';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Injectable()

export class ErrorInterceptor implements HttpInterceptor {

  constructor(private dialog: MatDialog, private ngxLoader: NgxUiLoaderService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        this.ngxLoader.stop(); // Stop loader
        // Unknown error message
        let errorMessage = error.message;

        // Known error message
        if (error.error.message) {
          errorMessage = error.error.message;
        }

        // Opening error dialog
        this.dialog.open(ErrorComponent, {
          data: {
            message: errorMessage
          },
          width: '400px'
        });
        return throwError(error);
      })
    );
  }
}
