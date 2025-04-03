import { Routes } from '@angular/router';
import { BatchListComponent } from './batch-list/batch-list.component';
import { BatchSubgroupComponent } from './batch-subgroup/batch-subgroup.component';

export default [
    {
        path: ':guid',
        component: BatchListComponent,
    },
    {
        path: 'sub-group/:guid',
        component: BatchSubgroupComponent,
    },
] as Routes;