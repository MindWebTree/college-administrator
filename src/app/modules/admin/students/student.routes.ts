import { Routes } from '@angular/router';
import { StudentListComponent } from './student-list/student-list.component';
import { AssessmentAttendenceReportComponent } from './assessment-attendence-report/assessment-attendence-report.component';
import { LecturerStudentListComponent } from './lecturer-student-list/lecturer-student-list.component';

export default [
    {
        path: ':guid',
        component: StudentListComponent,
    },
    {
        path: 'lecturer/:guid',
        component: LecturerStudentListComponent,
    },
    {
        path: ':guid/:batchYearId/:id',
        component: AssessmentAttendenceReportComponent,
    },
] as Routes;