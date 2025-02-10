import { Routes } from '@angular/router';
import { AdrplexusQbankComponent } from './adrplexus-qbank/adrplexus-qbank.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';

export default [
    {
        path     : 'adrplexus-qbank',
        component: AdrplexusQbankComponent,
    },
    {
        path     : 'subjects',
        component: SubjectListComponent,
    },
    {
        path     : 'exam-list',
        component: ExamListComponent,
    },
    {
        path     : 'exam-details/:id',
        component: ExamDetailComponent,
    },
] as Routes;
