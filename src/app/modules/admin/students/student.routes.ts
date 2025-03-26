import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { AssessmentAttendenceReportComponent } from './assessment-attendence-report/assessment-attendence-report.component';

export default [
    {
        path: ':guid',
        component: StudentListComponent,
    },
    {
        path: ':guid/:batchYearId/:id',
        component: AssessmentAttendenceReportComponent,
    },
] as Routes;