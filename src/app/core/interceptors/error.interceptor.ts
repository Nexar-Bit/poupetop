import { HttpInterceptor, HttpRequest, HttpHandler, HttpErrorResponse, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private snackBar: MatSnackBar) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'An error occurred';
        let showSnackbar = true;

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Server-side error
          switch (error.status) {
            case 0:
              errorMessage = 'Unable to connect to server. Please check your connection.';
              break;
            case 400:
              errorMessage = error.error?.message || 'Bad request. Please check your input.';
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in.';
              break;
            case 403:
              errorMessage = 'Access forbidden.';
              break;
            case 404:
              errorMessage = error.error?.message || 'Resource not found.';
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              // Suppress snackbar for optional endpoints that might not be implemented yet
              const optionalEndpoints = ['/api/banners', '/api/purchases'];
              if (optionalEndpoints.some(endpoint => req.url.includes(endpoint))) {
                showSnackbar = false;
              }
              break;
            default:
              errorMessage = error.error?.message || `Error: ${error.status} ${error.statusText}`;
          }
        }

        // Log error for debugging with full details
        console.error('API Error:', {
          url: req.url,
          method: req.method,
          status: error.status,
          statusText: error.statusText,
          message: errorMessage,
          error: error.error,
          headers: error.headers,
          fullError: error
        });
        
        // Log the full error response body if available
        if (error.error) {
          try {
            console.error('Error Response Body:', JSON.stringify(error.error, null, 2));
          } catch (e) {
            console.error('Error Response Body (raw):', error.error);
          }
        }

        // Show user-friendly error message only if not suppressed
        if (showSnackbar) {
          this.snackBar.open(errorMessage, 'Close', {
            duration: 5000,
            horizontalPosition: 'center',
            verticalPosition: 'bottom',
            panelClass: ['error-snackbar']
          });
        }

        return throwError(() => error);
      })
    );
  }
}
