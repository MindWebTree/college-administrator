import { Routes } from '@angular/router';
import { ListCompetencyComponent } from './list-competency/list-competency.component';
import { CreateCompetencyComponent } from './create-competency/create-competency.component';
import { StudentCompetencyComponent } from './student-competency/student-competency.component';
import { RubricListComponent } from './rubric-construction-management/rubric-list/rubric-list.component';
import { StepListComponent } from './step-management/step-list/step-list.component';
import { CriteriaListComponent } from './criteria-management/criteria-list/criteria-list.component';
import { StudentCompetencyListComponent } from './student-competency-list/student-competency-list.component';
import { GradingComponent } from './grading/grading.component';
export default [
    {
        path: 'create',
        component: CreateCompetencyComponent,
    },
    {
        path: 'edit/:id',
        component: CreateCompetencyComponent,
    },
    {
        path: 'list',
        component: ListCompetencyComponent,
    },
    {
        path: 'student-grid/:guid',
        component: StudentCompetencyComponent,
    },
    {
        path: 'rubric-sections',
        component: RubricListComponent,
    },
    {
        path: 'grading/:id',
        component: GradingComponent,
    },
    {
        path: 'sections/:guid',
        component: StepListComponent,
    },
    {
        path: 'rubric-criteria-list/:guid',
        component: CriteriaListComponent,
    },
    {
        path: 'student',
        component: StudentCompetencyListComponent,
    },
] as Routes;