import { Routes } from '@angular/router';
import { ListStudentComponent } from './list-student/list-student.component';
import { ReportCardComponent } from './report-card/report-card.component';
export default [
    {
        path: 'list/:guid',
        component: ListStudentComponent,
    },
    {
        path: 'student-report-card/:userId/:courseYear',
        component: ReportCardComponent,
    }
] as Routes;