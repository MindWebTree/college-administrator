import { Routes } from '@angular/router';
import { AdrplexusQbankComponent } from './adrplexus-qbank/adrplexus-qbank.component';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { ExamListComponent } from './exam-list/exam-list.component';
import { ExamDetailComponent } from './exam-detail/exam-detail.component';
import { GameViewComponent } from './game-view/game-view.component';
import { GameReviewComponent } from './game-review/game-review.component';
import { GameAnalyticsComponent } from './game-analytics/game-analytics.component';

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
        path     : 'exam-details/:guid',
        component: ExamDetailComponent,
    },
    {
        path     : 'game-view/:guid',
        component: GameViewComponent,
        data: {
            layout: 'empty'
        },
    },
    {
        path     : 'game-review/:guid',
        component: GameReviewComponent,
        data: {
            layout: 'empty'
        },
    },
    {
        path     : 'game-analytics/:guid',
        component: GameAnalyticsComponent,
    }
] as Routes;
