import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { environment } from 'environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ExamService {
    onExamListChanged : BehaviorSubject<any>;
  constructor(private _httpClient:HttpClient) {
    this.onExamListChanged = new BehaviorSubject([]);
   }

   getExamList(payload){
    return this._httpClient.post(`${environment.apiURL}/exam/grid`, { ...payload});
  }
   

  
}
