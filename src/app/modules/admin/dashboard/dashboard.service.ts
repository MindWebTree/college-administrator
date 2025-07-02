import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { studentExamSummaryGrid } from '../common/gridFilter';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,private _errorHandling: ApiErrorHandlerService, private _matSnockbar: MatSnackBar) {

  }
  getSubjectQbankTypesCourses(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/subjects-qbanktypes-courses`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getQuestionCreator(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/questioncreators`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getExamByMonth(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/exam-by-month/${courseYearId}`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getSubjectWiseAvgMarks(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/subjectwiseaveragemarks/${courseYearId}`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  // lecturere apis
  getSubjectQbanksCoures(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/subjects-qbanktypes-courses`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  getLecturerSubjectWiseAvg(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/subjectwiseaveragemarks/${courseYearId}`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  getLecturerOverView(courseYearId): Observable<any> {

    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/exam/${courseYearId}`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  // student 
  getStudentExamSummaryGrid(_gridFilter: studentExamSummaryGrid): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',
    });
    return this._httpClient.post<any>(`${environment.apiURL}/student/exam-summary-grid`, { ..._gridFilter }, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getAssignedTeamDetails(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/student/student-hod-lecture`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };

  getStudentiUpcomingExam(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',
    });
    return this._httpClient.get<any>(`${environment.apiURL}/exam/student/upcoming-exam`, { headers }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  };
  getStudentSubjectWiseAvgMarks(): Observable<any> {
    const userid = '';
    return this._httpClient.get<any>(`${environment.apiURL}/student/subjectwiseaveragemarks/${userid}`, {  }).pipe(
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


