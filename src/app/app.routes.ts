import { Route } from '@angular/router';
import { initialDataResolver } from 'app/app.resolvers';
import { AuthGuard, ChildAuthGuard } from 'app/core/auth/guards/auth.guard';
import { NoAuthGuard } from 'app/core/auth/guards/noAuth.guard';
import { LayoutComponent } from 'app/layout/layout.component';

// @formatter:off
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
export const appRoutes: Route[] = [

    // Redirect empty path to '/example'
    { path: '', pathMatch: 'full', redirectTo: 'dashboard' },

    // Redirect signed-in user to the '/example'
    //
    // After the user signs in, the sign-in page will redirect the user to the 'signed-in-redirect'
    // path. Below is another redirection for that path to redirect the user to the desired
    // location. This is a small convenience to keep all main routes together here on this file.
    { path: 'signed-in-redirect', pathMatch: 'full', redirectTo: 'dashboard' },

    // Auth routes for guests
    {
        path: '',
        canActivate: [NoAuthGuard],
        canActivateChild: [NoAuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'confirmation-required', loadChildren: () => import('app/modules/auth/confirmation-required/confirmation-required.routes') },
            { path: 'forgot-password', loadChildren: () => import('app/modules/auth/forgot-password/forgot-password.routes') },
            { path: 'reset-password', loadChildren: () => import('app/modules/auth/reset-password/reset-password.routes') },
            { path: 'sign-in', loadChildren: () => import('app/modules/auth/sign-in/sign-in.routes') },
            { path: 'sign-up', loadChildren: () => import('app/modules/auth/sign-up/sign-up.routes') }
        ]
    },

    // Auth routes for authenticated users
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'sign-out', loadChildren: () => import('app/modules/auth/sign-out/sign-out.routes') },
            { path: 'unlock-session', loadChildren: () => import('app/modules/auth/unlock-session/unlock-session.routes') }
        ]
    },

    // Landing routes
    {
        path: '',
        component: LayoutComponent,
        data: {
            layout: 'empty'
        },
        children: [
            { path: 'home', loadChildren: () => import('app/modules/landing/home/home.routes') },
        ]
    },

    // Admin routes
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'example', loadChildren: () => import('app/modules/admin/example/example.routes') },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'qbank', loadChildren: () => import('app/modules/admin/qbank/qbank.routes') },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'exam', loadChildren: () => import('app/modules/admin/exam/exam.routes') },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'student', loadChildren: () => import('app/modules/admin/student-management/student-management.routes') },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard, ChildAuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'lecturer', loadChildren: () => import('app/modules/admin/lecturer-management/lecturer-management.routes') },
        ]
    },

    //dashboard
    {
        path: '',
        canActivate: [AuthGuard],
        canActivateChild: [AuthGuard, ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            { path: 'dashboard', loadChildren: () => import('app/modules/admin/dashboard/dashboard.routes') },
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'qbank', loadChildren: () => import('app/modules/admin/question-management/question-management.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'attendance', loadChildren: () => import('app/modules/admin/attendence/attendence.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'upload', loadChildren: () => import('app/modules/admin/uploadto-s3/upload.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'competency', loadChildren: () => import('app/modules/admin/competency/competency.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'batch', loadChildren: () => import('app/modules/admin/Batch/batch.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'students', loadChildren: () => import('app/modules/admin/students/student.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'setting', loadChildren: () => import('app/modules/admin/settings/settings.routes')},
        ]
    },
    {
        path: '',
        canActivate: [AuthGuard,ChildAuthGuard],
        canActivateChild: [AuthGuard,ChildAuthGuard],
        component: LayoutComponent,
        resolve: {
            initialData: initialDataResolver
        },
        children: [
            {path: 'hod', loadChildren: () => import('app/modules/admin/HOD/HOD.routes')},
        ]
    },
    //dashboard End
];
