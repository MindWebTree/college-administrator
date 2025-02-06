import { Routes } from '@angular/router';
import { ExamListComponent } from './exam-list/exam-list.component';
import { WaitingForApprovalComponent } from './waiting-for-approval/waiting-for-approval.component';
import { CreateExamComponent } from './create-exam/create-exam.component';
import { CreatedExamListComponent } from './created-exam-list/created-exam-list.component';
// import { AdrplexusQbankComponent } from './adrplexus-qbank/adrplexus-qbank.component';

export default [
    {
        path     : 'create',
        component: CreateExamComponent,
    },
    {
        path     : 'edit/:id',
        component: CreateExamComponent,
    },
    {
        path     : 'list/waiting-for-approval',
        component: WaitingForApprovalComponent,
    },
    {
        path     : 'list/:guid',
        component: ExamListComponent,
    },
    {
        path     : 'created-examlist',
        component: CreatedExamListComponent,
    },
] as Routes;
