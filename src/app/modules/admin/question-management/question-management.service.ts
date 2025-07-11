import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, Observable, tap, throwError } from 'rxjs';
import { CreateQuestion } from './question-management.model';
import { environment } from 'environments/environment';
import { QuestionListFilter } from '../common/QuestionModel';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class QuestionManagementService {
  question_list: BehaviorSubject<any>;
  createQuestion: CreateQuestion;
  public Qbanksfilter: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public QbanksfilterValues$ = this.Qbanksfilter.asObservable();
  private QuestionFilter: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public QuestionFilterValues$: Observable<number[]> = this.QuestionFilter.asObservable();

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar,
    private _errorHandling: ApiErrorHandlerService
  ) {
    this.question_list = new BehaviorSubject([]);
  }

  setQbanksfilterValues(values: number[]): void {
    this.Qbanksfilter.next(values);
  }
  // setQustionFiltervalue(values: number[]) {
  //   this.QuestionFilter.next(values);
  // }

  getQbankTypes(qbankCategory): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanktypes/${qbankCategory}`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getQbankTypesLecturer(qbankCategory): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/lecturer/qbanktypes/${qbankCategory}`, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getSubjectsbyQbanktypeId(qBankTypeId: number, qbankCategory: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/${qBankTypeId}/${qbankCategory}`, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getSubjectsbyQbanktypeIdLecturer(qBankTypeId: number, qbankCategory: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/lecturer/subjects/${qBankTypeId}/${qbankCategory}`, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getTopicsBySubjectId(subjectId: number, qbankCategory: string): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-topics/${subjectId}/${qbankCategory}`, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  questionCreate(_questionData: CreateQuestion) {
    return this._httpClient.post(`${environment.apiURL}/qbank/create`, { ..._questionData }, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  updateQuestion(_questionData: CreateQuestion): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/qbank/update`, { ..._questionData }, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };



  qbankSearch(_gridFilter: QuestionListFilter): Observable<CreateQuestion[]> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.post<CreateQuestion[]>(`${environment.apiURL}/qbank/search`, { ..._gridFilter }, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getQwnedQuestion(_gridFilter: QuestionListFilter): Observable<CreateQuestion[]> {
    return this._httpClient.post<CreateQuestion[]>(`${environment.apiURL}/qbank/owned-questions`, { ..._gridFilter }, {  }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };


  getQuestionbyID(questionDetailID: number): Observable<CreateQuestion[]> {
    return this._httpClient.get<CreateQuestion[]>(`${environment.apiURL}/qbank/get-by-id/${questionDetailID}`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  // deleteQuestion(questionDetailID: number): Observable<any> {
  //   const headers = new HttpHeaders({
  //     'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

  //   });
  //   return this._httpClient.post<any>(`${environment.apiURL}/admin/qbank/delete/${questionDetailID}`, {}, { headers });
  // }


  deleteQuestion(questionDetailID): Promise<any> {

    return new Promise(() => {

      const headers = new HttpHeaders({
        'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

      });

      this._httpClient.post(`${environment.apiURL}/admin/qbank/delete/${questionDetailID}`, {}, { headers })
        .subscribe(response => {
          if (response) {
            this.question_list.next(this.createQuestion);
            this.openSnackBar("Successfully removed.", "Close");
          }
          else {
            this.openSnackBar("Failed", "Close");
          }
        });
    });
  }



  getCbmeCodeByTopicId(topicId): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/admin/cbmecode/${topicId}/list`, {},).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };


}
