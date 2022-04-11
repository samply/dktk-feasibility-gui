import { Injectable } from '@angular/core'
import { OAuthStorage, OAuthService } from 'angular-oauth2-oidc'
import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http'
import { Observable, throwError } from 'rxjs'
import { catchError } from 'rxjs/operators'
import { AppConfigService } from '../../config/app-config.service'

@Injectable()
export class OAuthInterceptor implements HttpInterceptor {
  excludedUrls = ['assets', '/assets']

  constructor(
    private oauthService: OAuthService,
    private authStorage: OAuthStorage,
    private appConfig: AppConfigService
  ) {}

  private isExcluded(req: HttpRequest<any>): boolean {
    if (this.appConfig.getConfig()?.auth?.excludedUrls !== undefined) {
      this.appConfig.getConfig().auth.excludedUrls.forEach((url) => {
        if (this.excludedUrls.indexOf(url) === -1) {
          this.excludedUrls.push(url)
        }
      })
    }

    const excludedUrlsRegEx = this.excludedUrls.map((url) => new RegExp('^' + url, 'i'))
    return excludedUrlsRegEx.some((toBeExcluded) => toBeExcluded.test(req.url))
  }
  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.isExcluded(req)) {
      return next.handle(req)
    }
    const token = this.authStorage.getItem('access_token')
    const headers = req.headers.set('Authorization', 'Bearer ' + token)
    req = req.clone({ headers })
    return next.handle(req).pipe(catchError(this.handleError.bind(this)))
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
    if (error.status === 401) {
      this.oauthService.logOut()
    }
    return throwError(error)
  }
}
