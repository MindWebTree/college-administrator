import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class BatchService {

  onFirstYearGridChanged: BehaviorSubject<any>;
  onSubGroupGridChanged: BehaviorSubject<any>;

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(
    private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar,
    private _errorHandling: ApiErrorHandlerService,
    private _navigationTypeService: NavigationService,
    private _navigationService: NavigationMockApi
  ) {
    this.onFirstYearGridChanged = new BehaviorSubject([]);
    this.onSubGroupGridChanged = new BehaviorSubject([]);
  }

  getYears(guid): Observable<any> {
    return this._httpClient.post<any>(`${environment.apiURL}/batch/batchyears/${guid}`, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  getSubjects(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  getSubjectsbyYear(guid): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/common/subjects/academicyear/${guid}`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  getTeams(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/teammanagement/list`).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  getStudentForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/student/grid`, { ..._gridFilter }, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  getHODStudentForGrid(_gridFilter: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/hod/student-grid/${_gridFilter?.batchId}`, { ..._gridFilter }, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }

  getfutureBatches(): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/batch/future-batches`, {}, {}).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  createBatch(req): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/batch/create`, { ...req }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  mapTeam(req): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/teammanagement/map-user-team`, { ...req }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }
  promoteToNextYear(req: any): Observable<any> {
    return this._httpClient.post(`${environment.apiURL}/hod/promote-students`, req).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
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
    })
  }
}
