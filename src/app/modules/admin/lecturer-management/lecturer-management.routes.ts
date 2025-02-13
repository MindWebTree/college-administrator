import { Routes } from '@angular/router';
import { ListLecturerComponent } from './list-lecturer/list-lecturer.component';
import { BioLecturerComponent } from './bio-lecturer/bio-lecturer.component';

export default [
    {
        path: 'list/:guid',
        component: ListLecturerComponent,
    },
    {
        path: 'lecturer-bio/:userId/:courseYear',
        component: BioLecturerComponent,
    },
] as Routes;