import { Routes } from '@angular/router';
import { ListLecturerComponent } from './list-lecturer/list-lecturer.component';
import { BioLecturerComponent } from './bio-lecturer/bio-lecturer.component';
import { ListLecturerV1Component } from './list-lecturer-v1/list-lecturer-v1.component';

export default [
    // {
    //     path: 'list/:guid',
    //     component: ListLecturerComponent,
    // },
    {
        path: 'lecturer-bio/:userId',
        component: BioLecturerComponent,
    },
    {
        path: 'list/:guid',
        component: ListLecturerV1Component,
    }
] as Routes;