import { Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

export default [
    {
        path: '',
        component: DashboardComponent,
    },
    // {
    //     path: 'lecturer-bio/:userId',
    //     component: LectureBioComponent,
    // },
] as Routes;