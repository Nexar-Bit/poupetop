import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {
  private activeRequests = 0;

  constructor() {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Skip loading indicator for certain requests (e.g., polling, background updates)
    const skipLoading = req.headers.has('X-Skip-Loading');

    if (!skipLoading) {
      this.activeRequests++;
      // You can emit to a service here if you want global loading state
      // For now, we'll just track it
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!skipLoading) {
          this.activeRequests--;
          // Emit loading state change if needed
        }
      })
    );
  }

  getActiveRequestsCount(): number {
    return this.activeRequests;
  }
}
