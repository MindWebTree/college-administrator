import { Routes } from '@angular/router';
import { BatchListComponent } from './batch-list/batch-list.component';

export default [
    {
        path: ':guid',
        component: BatchListComponent,
    },
] as Routes;