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
        let isJsonParsingError = false;

        // Define optional endpoints that can fail without showing errors to users
        const optionalEndpoints = ['/api/banners', '/api/purchases', '/estabelecimentos'];
        const isOptionalEndpoint = optionalEndpoints.some(endpoint => req.url.includes(endpoint));

        if (error.error instanceof ErrorEvent) {
          // Client-side error
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Check if this is a JSON parsing error with status 200 (server returned HTML instead of JSON)
          if (error.status === 200 && error.error && typeof error.error === 'object' && error.error.text) {
            // Server returned HTML instead of JSON
            errorMessage = 'Server returned invalid response format.';
            isJsonParsingError = true;
            showSnackbar = false; // Don't show snackbar for JSON parsing errors
          } else {
            // Server-side error
            switch (error.status) {
            case 0:
              // CORS or network errors
              // CORS errors typically have status 0 with external HTTPS URLs
              
              // If it's an external HTTPS URL, it's likely a CORS error
              if (req.url.startsWith('https://')) {
                errorMessage = 'CORS error: Backend server needs to allow requests from this domain.';
                // Suppress snackbar for optional endpoints
                if (isOptionalEndpoint) {
                  showSnackbar = false;
                }
              } else {
                errorMessage = 'Unable to connect to server. Please check your connection.';
              }
              break;
            case 400:
              // API may return plain text (e.g., "Município não existente") or JSON with message
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = 'Bad request. Please check your input.';
              }
              break;
            case 401:
              errorMessage = 'Unauthorized. Please log in.';
              break;
            case 403:
              errorMessage = 'Access forbidden.';
              break;
            case 404:
              // API may return plain text or JSON with message
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = 'Resource not found.';
              }
              break;
            case 500:
              errorMessage = 'Server error. Please try again later.';
              // Suppress snackbar for optional endpoints that might not be implemented yet
              if (isOptionalEndpoint) {
                showSnackbar = false;
              }
              break;
            default:
              // API may return plain text or JSON with message
              if (typeof error.error === 'string') {
                errorMessage = error.error;
              } else if (error.error?.message) {
                errorMessage = error.error.message;
              } else {
                errorMessage = `Error: ${error.status} ${error.statusText}`;
              }
              break;
            }
          }
        }

        // Log error for debugging with full details
        // Suppress verbose logging for:
        // 1. JSON parsing errors (status 200 with HTML content)
        // 2. Optional endpoints with 500 errors
        const shouldSuppressLogs = isJsonParsingError || (isOptionalEndpoint && error.status === 500);
        
        if (shouldSuppressLogs) {
          // Quiet debug log for suppressed errors
          if (isJsonParsingError) {
            console.debug(`[JSON Parse Error] ${req.method} ${req.url} - Server returned HTML instead of JSON`);
          } else {
            console.debug(`[Optional Endpoint] ${req.method} ${req.url} - ${error.status}: ${error.error?.message || 'Not implemented yet'}`);
          }
        } else {
          // Full error log for other errors
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
