import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, switchMap, tap } from 'rxjs';
import { environment } from 'environments/environment';
import { CommanService } from 'app/modules/common/comman.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  onExamListChanged: BehaviorSubject<any>;
  onUpcomingExamListChanged: BehaviorSubject<any>;
  onCompletedExamListChanged: BehaviorSubject<any>;
  onCancelledExamListChanged: BehaviorSubject<any>;
  onWaitingforApprovalExamListChanged: BehaviorSubject<any>;
  onExamReportListChanged: BehaviorSubject<any>;

  constructor(private _httpClient: HttpClient, private _CommanService: CommanService, private _navigationService: NavigationMockApi, private _navigationTypeService: NavigationService) {
    this.onExamListChanged = new BehaviorSubject([]);
    this.onUpcomingExamListChanged = new BehaviorSubject([]);
    this.onCompletedExamListChanged = new BehaviorSubject([]);
    this.onCancelledExamListChanged = new BehaviorSubject([]);
    this.onWaitingforApprovalExamListChanged = new BehaviorSubject([]);
    this.onExamReportListChanged = new BehaviorSubject([]);
  }

  getExamList(payload) {
    return this._httpClient.post(`${environment.apiURL}/exam/grid`, { ...payload });
  }
  approveExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/activate-exam/${examID}`, {}).pipe(
      tap(() => {

        // Fetch new navigation dynamically
        this._navigationService.fetchDynamicNavigation(this._navigationService._AdminNavigation).then(updatedNavigation => {

          // Explicitly trigger a navigation refresh
          this._navigationTypeService.refreshNavigation();

        });
      })
    );
  }
  cancelExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/cancel-exam/${examID}`, {}).pipe(
      tap(() => {
        // // Force navigation refresh by resetting the flag
        // this._navigationService.isnavigationalreadyexiest = false;

        // Fetch new navigation dynamically
        this._navigationService.fetchDynamicNavigation(this._navigationService._AdminNavigation).then(updatedNavigation => {

          // Explicitly trigger a navigation refresh
          this._navigationTypeService.refreshNavigation();

        });
      })
    );;
  }
  deleteExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/delete/${examID}`, {}).pipe(
      tap(() => {
        // // Force navigation refresh by resetting the flag
        // this._navigationService.isnavigationalreadyexiest = false;

        // Fetch new navigation dynamically
        this._navigationService.fetchDynamicNavigation(this._navigationService._AdminNavigation).then(updatedNavigation => {

          // Explicitly trigger a navigation refresh
          this._navigationTypeService.refreshNavigation();

        });
      })
    );
  }

  // deleteExam(examID) {
  //   return this._httpClient.post(`${environment.apiURL}/exam/delete/${examID}`, {});
  // }
  rescheduleExam(data: any) {
    return this._httpClient.post(`${environment.apiURL}/exam/reschedule`, data);
  }
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {});
  }

  CreateExam(data): Observable<any> {
    return this._httpClient.post<any[]>(`${environment.apiURL}/exam/create/`, data);
  }
  UpdateExam(data): Observable<any> {
    return this._httpClient.post<any[]>(`${environment.apiURL}/exam/update/`, data);
  }
  getExamByid(id) {

    return this._httpClient.get(`${environment.apiURL}/exam/get-by-id/${id}`, {});
  }
  getCourseYear(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/courseyear`)
  }
  getExamReport(id): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/exam/exam-report/${id}`)
  }

}
