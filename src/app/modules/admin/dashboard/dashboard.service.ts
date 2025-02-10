import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { Observable } from 'rxjs';
import { studentExamSummaryGrid } from '../common/gridFilter';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient, private _matSnockbar: MatSnackBar) {

  }
  getSubjectQbankTypesCourses(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/subjects-qbanktypes-courses`, { headers });

  }
  getQuestionCreator(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/questioncreators`, { headers });
  }
  getExamByMonth(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/exam-by-month/${courseYearId}`, { headers });
  }
  getSubjectWiseAvgMarks(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/collegeadmin/overview/subjectwiseaveragemarks/${courseYearId}`, { headers });
  }

  // lecturere apis
  getSubjectQbanksCoures(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/subjects-qbanktypes-courses`, { headers });

  }

  getLecturerSubjectWiseAvg(courseYearId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/subjectwiseaveragemarks/${courseYearId}`, { headers });
  }

  getLecturerOverView(courseYearId): Observable<any> {

    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/overview/exam/${courseYearId}`, { headers });
  }
  // student 
  getStudentExamSummaryGrid(_gridFilter: studentExamSummaryGrid): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',
    });
    return this._httpClient.post<any>(`${environment.apiURL}/student/exam-summary-grid`, { ..._gridFilter }, { headers });
  }

  getStudentiUpcomingExam(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',
    });
    return this._httpClient.get<any>(`${environment.apiURL}/exam/student/upcoming-exam`, { headers });
  }
  getStudentSubjectWiseAvgMarks(): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',
    });
    return this._httpClient.get<any>(`${environment.apiURL}/student/subjectwiseaveragemarks`, { headers });
  }
}


