import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateQuestion } from './QuestionModel';
import { environment } from 'environments/environment';
import { HttpClient } from '@angular/common/http';
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
    this.QbanksfilterValues$.subscribe(res=>{console.log(res,"ss")})
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
}
