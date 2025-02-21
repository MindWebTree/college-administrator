import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { QbankcmbCode } from '../Models/commonModels/commonModel';
import { StudentProfile } from '../Models/StudentModels/studentModel';
import { QuestionListModel } from '../Models/QuestionModel/QuestionModel';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  private _cmbcode: BehaviorSubject<QbankcmbCode[] | null> = new BehaviorSubject(null);


  constructor(
    private _httpClient: HttpClient,
  ) { }

  getcbmesubjects(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/cmbeexam/subjects`, {});
  }

  getcbmeqbanktype(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/cmbeexam/qbanktypes`, {});
  }
  getCourses(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/course/list`, {});
  }
  getCollege(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/common/colleges`, {});
  }
  getQbankCmbCode(subjectId: any, TopicID: any): Promise<QbankcmbCode[]> {
    return new Promise((resolve, reject) => {
      this._httpClient.get<QbankcmbCode[]>(`${environment.apiURL}/cmbeexam/exams?subjectId=${subjectId = subjectId}&TopicID=${TopicID = TopicID}&ExamStatus=-1`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getCbmeExamDetail(CbmeId): Observable<any> {
    return this._httpClient.get<QbankcmbCode[]>(`${environment.apiURL}/cmbeexam/examdetails?cmBeCode=${CbmeId}`)
  }
  GetTopics(subjectId): Observable<any> {
    return this._httpClient.get<QbankcmbCode[]>(`${environment.apiURL}/cmbeexam/topics?SubjectID=${subjectId = subjectId}`)
  }

  getstates(): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/common/states`, {});
  }

  getcities(stateid: string): Observable<any> {
    return this._httpClient.get(`${environment.apiURL}/common/cities?stateid=` + stateid, {});
  }
  getRoles(): Observable<any> {
    return this._httpClient.get(`${environment.externalApiURL}/api/roles`);
  }
  getProfile() {
    return this._httpClient.get(`${environment.externalApiURL}/api/personal/profile`);
  }
  studentRegistration(ProfileData: StudentProfile): Observable<any> {
    return this._httpClient.put(`${environment.externalApiURL}/api/personal/updateprofile`, { ...ProfileData });
  }
  getExamQuestion(CbmeId: any): Observable<QuestionListModel[]> {
    return this._httpClient.get<QuestionListModel[]>(`${environment.apiURL}/cmbeexam/questions?CmbeCode=` + CbmeId,);
  }
  getExamAnswersheet(CbmeId: number): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/cmbeexam/answersheet?cmbeCode=` + CbmeId,);
  }
  changeStudentProfile(request): Observable<any> {
    return this._httpClient.put<any>(`${environment.externalApiURL}/api/personal/updateprofileimage`, { ...request });
  }
  submitQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmbeexam/submit-question/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishExam(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmbeexam/submit/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getExamResult(cbmeId: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/cmbeexam/result?cmbeCode=` + cbmeId)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getStudentDashboardDetail(): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.get(`${environment.apiURL}/cmbeexam/dashboard`)
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  answerSheetProgress(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmbeexam/answer-sheet-progress/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  SetQuestionsBookmark(request: any): Promise<any> {
    var self = this;

    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/cmbeexam/bookmark/`, { ...request })
        .subscribe((response: any) => {
          resolve(response.Data);
        }, reject);
    });
  }
}
