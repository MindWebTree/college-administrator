import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
  onExamListChanged: BehaviorSubject<any>;
  onUpcomingExamListChanged: BehaviorSubject<any>;
  onCompletedExamListChanged: BehaviorSubject<any>;
  onCancelledExamListChanged: BehaviorSubject<any>;
  constructor(private _httpClient: HttpClient) {
    this.onExamListChanged = new BehaviorSubject([]);
    this.onUpcomingExamListChanged = new BehaviorSubject([]);
    this.onCompletedExamListChanged = new BehaviorSubject([]);
    this.onCancelledExamListChanged = new BehaviorSubject([]);
  }

  getExamList(payload) {
    return this._httpClient.post(`${environment.apiURL}/exam/grid`, { ...payload });
  }
  approveExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/activate-exam/${examID}`, {});
  }
  cancelExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/cancel-exam/${examID}`, {});
  }
  deleteExam(examID) {
    return this._httpClient.post(`${environment.apiURL}/exam/delete/${examID}`, {});
  }
  rescheduleExam(data:any) {
    return this._httpClient.post(`${environment.apiURL}/exam/reschedule`, data);
  }
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {});
  }
  
  CreateExam(data): Observable<any> {
    return this._httpClient.post<any[]>(`${environment.apiURL}/qbank/search/`, {  });
  }


}
