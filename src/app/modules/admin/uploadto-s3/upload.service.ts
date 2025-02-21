import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'environments/environment';
import { studentAnalyticGrid, studentGrid } from '../common/gridFilter';
import { NavigationMockApi } from 'app/mock-api/common/navigation/api';
import { NavigationService } from 'app/core/navigation/navigation.service';
import { catchError, map, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar, private _navigationTypeService: NavigationService, private _navigationService: NavigationMockApi
  ) {
    
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  uploadDoc(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file, file.name);

    return this._httpClient.post(`${environment.apiURL}/admin/s3fileupload/image`, formData)
      .pipe(
        map((response: any) => {
          return {
            fileName: response?.fileName || '',
            uploaded: response?.uploaded || 0,
            url: response?.url || ''
          };
        }),
        catchError(error => {
          console.error('Error uploading file:', error);
          console.error('Full Error Response:', error);
          throw error;
        })
      );
  }
}


