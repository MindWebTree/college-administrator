import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';

@Injectable({
  providedIn: 'root'
})
export class CertificateService {
  onStudentManagementChanged: BehaviorSubject<any>;

  private titleSubject = new BehaviorSubject<string>('');
  public title$ = this.titleSubject.asObservable();  
  private ModuleTitle = new BehaviorSubject<string>('');
  public Moduletitle$ = this.ModuleTitle.asObservable();

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  setTitle(newTitle: string) {
    this.titleSubject.next(newTitle);
}
  setModuleTitle(newTitle: string) {
      this.ModuleTitle.next(newTitle);
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    this.onStudentManagementChanged = new BehaviorSubject([]);
  }

  getCertificateDetials(id): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/student/competency-certificate/${id}`, {  });
  }
}


