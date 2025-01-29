import { inject } from '@angular/core';
import { CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from 'app/core/auth/auth.service';
import { Observable, of, switchMap } from 'rxjs';

export const AuthGuard: CanActivateFn = (route, state) => {
    const router: Router = inject(Router);
    let ChildQueryparams: any;

    if (route.routeConfig.path === '') {
        return true
    }
    else {
        let parentPath = '';
        let childPath;
        let fullPath
        if (route.parent.url.length > 0) {
            route.parent.url.forEach(url => {
                parentPath += url.path + "/";
            })
        }
        childPath = route.routeConfig.path;
        if (route.parent.url.length > 0) {
            fullPath = `/${parentPath}${childPath}`;
            if (fullPath.endsWith('/')) {
                fullPath = fullPath.slice(0, -1);
            }
            ChildQueryparams = route.params;
            const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
            return data._check(redirectUrl, fullPath);
        }
    }

};

export const ChildAuthGuard: CanActivateChildFn = (route, state) => {
    const router: Router = inject(Router);
    let ChildQueryparams: any;

    let parentPath = '';
        let childPath = '';
        let fullPath
        if (route.parent.url.length > 0) {
            route.parent.url.forEach(url => {
                parentPath += url.path + "/";
            })
        }
        childPath = route.routeConfig.path;
        if (route.parent.url.length > 0) {
            fullPath = `/${parentPath}${childPath}`;
            if (fullPath.endsWith('/')) {
                fullPath = fullPath.slice(0, -1);
            }
            ChildQueryparams = route.params;
            const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
            return data._check(redirectUrl, fullPath);
        }
        

};
export const data={
    _check(redirectURL: string, url: any): Observable<boolean> {

        const baseUrl = url.split('?')[0];
        return this._authService?.check()
            .pipe(
                switchMap((authenticated) => {
                    // If the user is not authenticated...
                    if (!authenticated) {
                        // Redirect to the sign-in page

                        this._router.navigate(['sign-in'], { queryParams: { redirectURL } });

                        // Prevent the access
                        return of(false);
                    }
                    else {
                        this.RoleId = this._helperservice.getUserDetail()
                        this.isUserAuthenticated = false;
                        this.navigation.forEach(route => {

                            if (route.link == baseUrl && route.roles.includes(this.RoleId.Roles)) {
                                this.isUserAuthenticated = true;
                                return true;
                            }
                            else {

                                if (route.children) {
                                    this.checkRouteChildren(route.children, baseUrl);
                                }
                            }
                        })
                        if (baseUrl == '/sign-out') {
                            return of(true);
                        }
                        if (this.isUserAuthenticated == false) {
                            this._router.navigate(['/sign-out']);
                        }
                        return of(this.isUserAuthenticated);
                    }
                })
            );
    },
    checkRouteChildren(children: any[], currenturl: any): any {
        for (const child of children) {
            // debugger;
            if (child.link == currenturl) {// checks link
                if (child.roles.includes(this.RoleId.Roles)) {
                    this.isUserAuthenticated = true;
                    return true;
                }
            }
            if (child.children?.length > 0) {
                this.checkRouteChildren(child.children, currenturl); // Recursively check children's children
            }
        }
        return this.isUserAuthenticated;
    }
}