import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateQuestion } from './QuestionModel';
import { environment } from 'environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { QBankFilter } from './QuestionModel'

@Injectable({
  providedIn: 'root'
})
export class QuestionService {
  // private Qbanksfilter = new BehaviorSubject<QBankFilter>({});
  onQuestionSetChanged: BehaviorSubject<any>;

  public Qbanksfilter: BehaviorSubject<any> = new BehaviorSubject<any>([]);
  public QbanksfilterValues$ = this.Qbanksfilter.asObservable();
  private QuestionFilter: BehaviorSubject<number[]> = new BehaviorSubject<number[]>([]);
  public QuestionFilterValues$: Observable<number[]> = this.QuestionFilter.asObservable();

  constructor(private _httpClient:HttpClient) {
    this.onQuestionSetChanged = new BehaviorSubject([]);
   }

  setQbanksfilterValues(values: any): void {
    this.Qbanksfilter.next(values);
  }
  setQustionFiltervalue(values: number[]) {
    this.QuestionFilter.next(values);
  }

  QuestionCreate(_questionData:CreateQuestion){
    return this._httpClient.post(`${environment.apiURL}/qbank/create`, { ..._questionData});
  }
  UpdateCreate(_questionData:CreateQuestion){
    return this._httpClient.post(`${environment.apiURL}/qbank/update`, { ..._questionData});
  }
  getExamDetails(id){
    const headers = new HttpHeaders({
      'ExamId': id,

    });
    return this._httpClient.get(`${environment.apiURL}/exam/get-exam-detail/${id}`, {headers});
  }
  getExamList(request:any): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/exam/student/exams/grid/`, { ...request })
  }
  getQbankExamQuestion(Examid): Observable<any> {
    const headers = new HttpHeaders({
      'ExamId': Examid,
    });
    return this._httpClient.get<any>(`${environment.apiURL}/exam/exam-questions/${Examid}`, { headers })
  }
  submitQuestion(request: any): Promise<any> {
    const headers = new HttpHeaders({
      'ExamId': request.examId,
    });
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/exam/submit-question/`, { ...request }, {headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  finishExam(request: any): Promise<any> {
    const headers = new HttpHeaders({
      'ExamId': request.examId,
    });
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/exam/submit-exam/`, { ...request }, {headers})
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }
  getQbnkquestionDetailById(QuestionDetailId, Examid) {
    return this._httpClient.get<any>(`${environment.apiURL}/exam/question-detail/${QuestionDetailId}/${Examid}`,)
  }
  reportQuestion(request: any): Promise<any> {
    var self = this;
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/exam/exam-report/${request.questionDetailID}/`, { ...request })
        .subscribe((response: any) => {
          resolve(response);
        }, reject);
    });
  }

  BookmarkQbnkQuestion(request: any): Observable<any> {
    const params = new HttpParams()
      .set('examid', request.examid.toString())
      .set('courseId', request.courseId.toString())
      .set('questionId', request.questionId.toString())
      .set('IsBookMark', request.IsBookMark)
    return this._httpClient.post<any>(`${environment.apiURL}/exam/bookmark`, null, { params })
  }

  getQbankExamResult(examId, courseId) {
    const headers = new HttpHeaders({
      'ExamId': examId,
    });
    let params = new HttpParams();
    params = params.append('examid', examId);
    params = params.append('courseId', courseId);
    return this._httpClient.get<any>(`${environment.apiURL}/exam/exam-result?${params}`, {headers})
  }
  getQbnkAnswersheet(CourseId, Examid) {
    const headers = new HttpHeaders({
      'ExamId': Examid,
    });
    let params = new HttpParams();
    params = params.append('examid', Examid.toString());
    params = params.append('courseId', CourseId.toString());
    return this._httpClient.get<any>(`${environment.apiURL}/exam/answersheet?${params}`, { headers })
  }
}
