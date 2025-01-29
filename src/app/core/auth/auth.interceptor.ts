import {
    HttpErrorResponse,
    HttpEvent,
    HttpHandlerFn,
    HttpRequest,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { AuthService } from 'app/core/auth/auth.service';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { CommanService } from 'app/modules/common/comman.service';
import { Observable, catchError, throwError } from 'rxjs';
import { DataGuardService } from './data.guard';
import { helperService } from './helper';

/**
 * Intercept
 *
 * @param req
 * @param next
 */
export const authInterceptor = (
    req: HttpRequest<unknown>,
    next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
    const authService = inject(AuthService);
    const dataService = inject(DataGuardService);
    const _helperService = inject(helperService);
    const _CommanService = inject(CommanService);
    let tenantid = '';

    _CommanService.getTenantDetails.subscribe((TenantInfo: any) => {
        tenantid = TenantInfo.Id;
    });
    // Clone the request object
    let token = dataService.getLocalData('accessToken')
    let cleanedtoken = token?.replace(/^"|"$/g, '');
    let newReq = req.clone();
    newReq = req.clone({
        headers: req.headers.set('DeviceId',"WEB")
                            .set('tenant', tenantid)
                            .set('DeviceName', "WEB")
                            .set('Authorization', 'Bearer ' + cleanedtoken)
    });

    // if (
    //     authService.accessToken &&
    //     !AuthUtils.isTokenExpired(authService.accessToken)
    // ) {
    //     newReq = req.clone({
    //         headers: req.headers.set(
    //             'Authorization',
    //             'Bearer ' + authService.accessToken
    //         )
    //     });
    // }else{
    //     newReq = req.clone({
    //         headers: req.headers.set('DeviceId',"WEB")
    //                             .set('tenant', tenantid)
    //                             .set('DeviceName', "WEB")
    //     });
    // }

    // Response
    return next(newReq).pipe(
        catchError((error) => {
            // Catch "401 Unauthorized" responses
            if (error instanceof HttpErrorResponse && error.status === 401 && !newReq.url.includes('api/tokens')) {
                // Sign out
                authService.signOut();

                // Reload the app
                location.reload();
            }

            return throwError(error);
        })
    );
};
