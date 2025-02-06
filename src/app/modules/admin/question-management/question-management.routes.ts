import { Routes } from '@angular/router';
import { CreateQuestionComponent } from './create-question/create-question.component';
import { QuestionListComponent } from './question-list/question-list.component';


export default [
    {
        path: 'create',
        component: CreateQuestionComponent,
    },
    {
        path: 'question-list',
        component: QuestionListComponent,
    },
    {
        path: 'Edit/:questionDetailId',
        component: CreateQuestionComponent,

    },
] as Routes;