import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { environment } from 'environments/environment';
import { CommanService } from 'app/modules/common/comman.service';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { AttendanceGridFilter, AttendanceLogger } from './attendance.model';
import { ApiErrorHandlerService } from '../common/api-error-handler.service';

@Injectable({
  providedIn: 'root'
})
export class AttendanceService {
  onAttendanceLoggerChanged: BehaviorSubject<any>;
  attendance: AttendanceLogger[];

  constructor(private _errorHandling: ApiErrorHandlerService,private _httpClient: HttpClient, private _CommanService: CommanService, private _navigationService: NavigationMockApi, private _navigationTypeService: NavigationService) {
    this.onAttendanceLoggerChanged = new BehaviorSubject([]);
  }

  getAttendanceLoggerForGrid(_gridFilter: AttendanceGridFilter): Observable<any> {
        
    // return this._httpClient.post(`${environment.externalApiURL}/attendance/get-grid-attendance-log`, { ..._gridFilter });
    // }
    return this._httpClient.post(`https://care-next.api.adrplexus.com/attendance/get-grid-attendance-log`, { ..._gridFilter }).pipe(
      tap((response: any) => {
        return response
      }),
      catchError((error) => {
        this._errorHandling.handleError(error);
        return throwError(() => error);
      })
    );
  }

}
