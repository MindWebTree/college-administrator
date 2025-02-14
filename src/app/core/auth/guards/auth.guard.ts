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
// import { inject } from '@angular/core';
// import { CanActivateChildFn, CanActivateFn, CanLoadFn, Router, UrlSegment } from '@angular/router';
// import { AuthService } from 'app/core/auth/auth.service';
// import { helperService } from '../helper';
// import { defaultNavigation } from 'app/mock-api/common/navigation/data';
// import { Observable, of, switchMap } from 'rxjs';
// import { User } from 'app/modules/admin/example/models/user';

// // Helper class to maintain state and shared logic
// class AuthGuardHelper {
//     private router: Router = inject(Router);
//     private authService: AuthService = inject(AuthService);
//     private helperService: helperService = inject(helperService);
//     private navigation = defaultNavigation;
//     private isUserAuthenticated: boolean = false;
//     private roleId: User;

//     check(redirectURL: string, url: string): Observable<boolean> {
//         const baseUrl = url.split('?')[0];
//         return this.authService.check().pipe(
//             switchMap((authenticated) => {
//                 if (!authenticated) {
//                     this.router.navigate(['sign-in'], { queryParams: { redirectURL } });
//                     return of(false);
//                 }
//                 console.log("hi");
//                 this.roleId = this.helperService.getUserDetail();
//                 if(this.roleId == null){
//                     this.router.navigate(['/sign-out']);
//                 }
//                 this.isUserAuthenticated = false;
                
//                 // Check route permissions
//                 this.navigation.forEach(route => {
                    
//                     if (route.link === baseUrl || route.roles.includes(this.roleId.Roles)) {
//                         this.isUserAuthenticated = true;
//                         return true;
//                     } else if (route.children) {
//                         this.checkRouteChildren(route.children, baseUrl);
//                     }
//                 });

//                 // Special case for sign-out
//                 if (baseUrl === '/sign-out') {
//                     return of(true);
//                 }

//                 if (!this.isUserAuthenticated) {
//                     this.router.navigate(['/sign-out']);
//                 }

//                 return of(this.isUserAuthenticated);
//             })
//         );
//     }

//     private checkRouteChildren(children: any[], currentUrl: string): boolean {
//         for (const child of children) {
//             if (child.link === currentUrl && child.roles.includes(this.roleId.Roles)) {
//                 this.isUserAuthenticated = true;
//                 return true;
//             }
            
//             if (child.children?.length > 0) {
//                 this.checkRouteChildren(child.children, currentUrl);
//             }
//         }
//         return this.isUserAuthenticated;
//     }

//     buildFullPath(route: any): string {
//         let parentPath = '';
//         const childPath = route.routeConfig?.path || '';

//         if (route.parent?.url.length > 0) {
//             parentPath = route.parent.url.map(url => url.path).join('/') + '/';
//         }

//         let fullPath = `/${parentPath}${childPath}`;
//         return fullPath.endsWith('/') ? fullPath.slice(0, -1) : fullPath;
//     }
// }

// export const AuthGuard: CanActivateFn = (route, state) => {
//     const helper = new AuthGuardHelper();

//     // Allow access to empty path
//     if (route.routeConfig?.path === '') {
//         return true;
//     }

//     const fullPath = helper.buildFullPath(route);
//     const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
//     return helper.check(redirectUrl, fullPath);
// };

// export const ChildAuthGuard: CanActivateChildFn = (childRoute, state) => {
//     const helper = new AuthGuardHelper();
    
//     const fullPath = helper.buildFullPath(childRoute);
//     const redirectUrl = state.url === '/sign-out' ? '/' : state.url;
//     return helper.check(redirectUrl, fullPath);
// };

// export const LoadGuard: CanLoadFn = (route, segments: UrlSegment[]) => {
//     const helper = new AuthGuardHelper();
//     return helper.check('/', '');
// };