import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AuthUtils } from 'app/core/auth/auth.utils';
import { UserService } from 'app/core/user/user.service';
import { environment } from 'environments/environment';
import { catchError, Observable, of, switchMap, tap, throwError } from 'rxjs';
import { DataGuardService } from './data.guard';
import { helperService } from './helper';
import { SignalRService } from 'app/modules/admin/common/signalr.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
    private _authenticated: boolean = false;
    private _httpClient = inject(HttpClient);
    private _dataGuard = inject(DataGuardService);
    private _userService = inject(UserService);
    private _helperService = inject(helperService);
    private _signalRService = inject(SignalRService );

    // -----------------------------------------------------------------------------------------------------
    // @ Accessors
    // -----------------------------------------------------------------------------------------------------

    /**
     * Setter & getter for access token
     */
    set accessToken(token: string) {
        localStorage.setItem('accessToken', token);
    }

    get accessToken(): string {
        return localStorage.getItem('accessToken') ?? '';
        // return this._dataGuard.getLocalData('accessToken') ?? '';
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Public methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Forgot password
     *
     * @param email
     */
    forgotPassword(email: string): Observable<any> {
        return this._httpClient.post('api/auth/forgot-password', email);
    }

    /**
     * Reset password
     *
     * @param password
     */
    resetPassword(password: string): Observable<any> {
        return this._httpClient.post('api/auth/reset-password', password);
    }

    /**
     * Sign in
     *
     * @param credentials
     */
    signIn(credentials: { email: string; password: string }): Observable<any> {
        // Throw error, if the user is already logged in
        if (this._authenticated) {
            return throwError('User is already logged in.');
        }

        return this._httpClient.post('api/auth/sign-in', credentials).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.accessToken;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Store the user on the user service
                this._userService.user = response.user;

                // Return a new observable with the response
                return of(response);
            })
        );
    }
    signInWithPassword(user): Observable<any> {
        return this._httpClient.post(`${environment.externalApiURL}/api/tokens`, user).pipe(
            switchMap((response: any) => {
                // Store the access token in the local storage
                this.accessToken = response.token;

                // Set the authenticated flag to true
                this._authenticated = true;

                // Return a new observable with the response
                return of(response);
            })
        );
    }

    /**
     * Sign in using the access token
     */
    signInUsingToken(): Observable<any> {
        // Sign in using the token
        return this._httpClient
            .post('api/auth/sign-in-with-token', {
                accessToken: this.accessToken,
            })
            .pipe(
                catchError(() =>
                    // Return false
                    of(false)
                ),
                switchMap((response: any) => {
                    // Replace the access token with the new one if it's available on
                    // the response object.
                    //
                    // This is an added optional step for better security. Once you sign
                    // in using the token, you should generate a new one on the server
                    // side and attach it to the response object. Then the following
                    // piece of code can replace the token with the refreshed one.
                    if (response.accessToken) {
                        this.accessToken = response.accessToken;
                    }

                    // Set the authenticated flag to true
                    this._authenticated = true;

                    // Store the user on the user service
                    this._userService.user = response.user;

                    // Return true
                    return of(true);
                })
            );
    }

    /**
     * Sign out
     */
    signOut(): Observable<any> {
        // Remove the access token from the local storage
        localStorage.removeItem('accessToken');

        // Disconnect SignalR
        this._signalRService.disconnect();

        // Set the authenticated flag to false
        this._authenticated = false;

        // Return the observable
        return of(true);
    }
    GetTinatDetail(DomainName: any): Observable<any> {
        return this._httpClient.get(`${environment.tenantvalidateURl}/api/saas/Tenant/validate-tenant/` + DomainName, {});
    }

    /**
     * Sign up
     *
     * @param user
     */
    signUp(user: {
        name: string;
        email: string;
        password: string;
        company: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/sign-up', user);
    }

    /**
     * Unlock session
     *
     * @param credentials
     */
    unlockSession(credentials: {
        email: string;
        password: string;
    }): Observable<any> {
        return this._httpClient.post('api/auth/unlock-session', credentials);
    }

    /**
     * Check the authentication status
     */
    // check(): Observable<boolean> {
    //     debugger
    //     console.log(this.accessToken,"this.accessToken")
    //     // this.accessToken = this._dataGuard.getLocalData('accessToken')
    //     // this.accessToken = localStorage.getItem('accessToken') ?? '';
    //     let _u = this._helperService.getUserDetail();
    //     // Check if the user is logged in
    //     if (this._authenticated) {
    //         return of(true);
    //     }

    //     // Check the access token availability
    //     if (!this.accessToken) {
    //         return of(false);
    //     }

    //     // Check the access token expire date
    //     if (AuthUtils.isTokenExpired(this.accessToken)) {
    //         return of(false);
    //     }

    //     // If the access token exists, and it didn't expire, sign in using it
    //     return this.signInUsingToken();
    // }
    check(): Observable<boolean> {
        // this.accessToken = this._dataGuard.getLocalData('accessToken')
        // this.accessToken = localStorage.getItem('accessToken') ?? '';
        let _u = this._helperService.getUserDetail();
        if (_u) {
            this._authenticated = true;

        }
        if (this._authenticated) {
            return of(true);
        }

        // Check the access token availability
        if (!this.accessToken) {
            return of(false);
        }

        // If the access token exists and it didn't expire, sign in using it
        return of(_u ? true : false);
    }
   
    refreshToken(): Observable<any> {
        var request = {
            token: this.accessToken,
            refreshToken: this.getRefreshToken()
        };
        return this._httpClient.post(`${environment.externalApiURL}/api/tokens/refresh`, { ...request }).pipe(
            tap((response) => {
                // console.log('Token Refresh Response:', response);
            }),
            catchError((error) => {
                console.error('Error occurred during refreshToken():', error);
                return throwError(error);
            })
        );
    }
    getRefreshToken(): string {
        return localStorage.getItem('refreshToken') ?? '';
    }
}
