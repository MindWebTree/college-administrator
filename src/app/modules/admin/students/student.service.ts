import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { studentModel } from '../student-management/student-management.model';

@Injectable({
  providedIn: 'root'
})
export class StudentsService {

  onFirstYearGridChanged: BehaviorSubject<any>;
  onAttendanceGridChanged: BehaviorSubject<any>;
  onAssessmentGridChanged: BehaviorSubject<any>;

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(
    private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar,
    private _navigationTypeService: NavigationService,
    private _navigationService: NavigationMockApi
  ) {
    this.onFirstYearGridChanged = new BehaviorSubject([]);
    this.onAttendanceGridChanged = new BehaviorSubject([]);
    this.onAssessmentGridChanged = new BehaviorSubject([]);
  }

  getYears(guid): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/batchyears/${guid}`, {})
  }

  getStudentForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/student/grid`, { ..._gridFilter }, {});

  }
  getAttendanceForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/attendence-grid`, { ..._gridFilter }, {});

  }
  getAssessmentForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/assesment-grid`, { ..._gridFilter }, {});

  }
  getStudentDetailsById(id): Promise<studentModel> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('userId', id);
      this._httpClient.get(`${environment.apiURL}/student/get-by-id`, { params })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    }
    );
  }
  getSubjectbyBatchYear(guid): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/academicyear/${guid}`);
  }
  bulkUploadUsers(batchGuid, batchYearId, data: any[]): Promise<any> {
    var self = this;
    console.log(JSON.stringify(data))
    return new Promise((resolve, reject) => {

      this._httpClient.post(`${environment.apiURL}/student/bulk-create/${batchGuid}/${batchYearId}`, [...data])
        .subscribe((response: any) => {
          this.openSnackBar(response, "Close");
          resolve(response);
        }, reject);
    });
  }
  bulkAssessmentandAttendanceReport(date, subjectId, IANo, data: any[]): Promise<any> {
    var self = this;
    console.log(JSON.stringify(data))
    return new Promise((resolve, reject) => {

      this._httpClient.post(`${environment.apiURL}/academic/import/${subjectId}/${date}?iANumber=${IANo}`, [...data])
        .subscribe((response: any) => {
          this.openSnackBar("Bulk upload Successfully", "Close");
          resolve(response);
        }, reject);
    });
  }
  updateAssessment(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/assesment-update`, { ..._gridFilter }, {});
  }
  updateAttendance(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/attendence-update`, { ..._gridFilter }, {});
  }
  deleteAssessment(id): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/assesment-delete/${id}`, {}, {});
  }
  deleteAttendance(id): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/attendence-delete/${id}`, {}, {});
  }
}
