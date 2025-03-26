import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { environment } from 'environments/environment';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  onFirstYearGridChanged: BehaviorSubject<any>;

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
  }

  sendReport(req): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/academic/attendance-mails/schedule`, { ...req });
  }

}
