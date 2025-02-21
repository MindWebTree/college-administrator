import { Injectable } from '@angular/core';
import { AppSyncenvironment } from 'environments/environment';
import AWSAppSyncClient, { AUTH_TYPE } from 'aws-appsync';
import gql from 'graphql-tag';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppSyncService {
  private client: any;

  constructor() {
    this.client = new AWSAppSyncClient({
      url: AppSyncenvironment.host,
      region: 'ap-south-1',
      auth: {
        type: AUTH_TYPE.API_KEY,
        apiKey: AppSyncenvironment.API_KEY,
      },
      disableOffline: true,
    });
  }

  subscribeToLiveQuizUpdates(examId: string, titleExamId: string): Observable<any> {
    const SUBSCRIPTION = gql`
      subscription OnUpdateLiveQuiz($examId: String!, $titleExamId: String!) {
        onUpdateLiveQuiz(ExamID: $examId, TitleExamID: $titleExamId) {
          ExamID
          TitleExamID
          Title
          CourseID
          CurrentQID
          CurrentQuestion
          NoOfQuestion
          SlideTimeOut
          StartDateTime
          Status
          SumOfScore
          hasAudienceReport
        }
      }
    `;

    return new Observable((observer) => {
      const observable = this.client.subscribe({
        query: SUBSCRIPTION,
        variables: {
          examId: examId,
          titleExamId: titleExamId
        }
      });

      const subscription = observable.subscribe({
        next: (data: any) => {
          observer.next(data.data.onUpdateLiveQuiz);
        },
        error: (error: any) => {
          observer.error(error);
        },
        complete: () => {
          observer.complete();
        },
      });

      // Cleanup function
      return () => {
        subscription.unsubscribe();
      };
    });
  }
}