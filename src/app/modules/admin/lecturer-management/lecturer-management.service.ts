import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BehaviorSubject, catchError, map, Observable } from 'rxjs';
import { lectureModel, QBankCategory } from './lecturer-management.model';
import { environment } from 'environments/environment';
import { GridFilter, lecturerAnalyticGrid } from '../common/gridFilter';

@Injectable({
  providedIn: 'root'
})
export class LectureService {

  lecture: lectureModel;
  onlectureManagementChanged: BehaviorSubject<any>;
  openSnackBar(message: string, action: string) {
    this._matSnockbar.open(message, action, {
      duration: 2000,
    });
  }
  constructor(private _httpClient: HttpClient,
    private _matSnockbar: MatSnackBar
  ) {
    this.onlectureManagementChanged = new BehaviorSubject([]);
  }

  /**
   * Get student Grid
   *
   * @returns {Observable<any>}
   */
  getlectureForGrid(_gridFilter: GridFilter): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.post(`${environment.apiURL}/lecturer/grid`, { ..._gridFilter }, { headers });

  }
  /**
         * Get lecture by Id
         *
         * @returns {Promise<any>}
         */

  getLectureDetailsById(id): Promise<lectureModel> {
    return new Promise((resolve, reject) => {
      const params = new HttpParams().set('userId', id);
      const headers = new HttpHeaders({
        'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

      });
      this._httpClient.get(`${environment.apiURL}/lecturer/get-by-id`, { params, headers })
        .subscribe((response: any) => {
          this.lecture = response;
          resolve(this.lecture);
        }, reject);
    }
    );
  }
  /**
     * Create leacture
     *
     * @param leacture
     * @returns {Promise<any>}
     */
  createLecture(lecture: lectureModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/lecturer/create`, { ...lecture })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onlectureManagementChanged.next(this.lecture);
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to Update", "Close");
              reject("Failed to add subject");
            }
          },
          (error: any) => {
            const errorMessage = error.error?.exception || "An unexpected error occurred.";
            this.openSnackBar(`${errorMessage} `, "Close");
            reject(error);
          }
        );
    });
  }
  /**
     * update leacture
     *
     * @param leacture
     * @returns {Promise<any>}
     */
  updateLecturer(lecturer: lectureModel): Promise<any> {
    return new Promise((resolve, reject) => {
      this._httpClient.post(`${environment.apiURL}/lecturer/update`, { ...lecturer })
        .subscribe(
          (response: any) => {
            if (response) {
              this.onlectureManagementChanged.next(this.lecture);
              this.openSnackBar("Successfully added.", "Close");
              resolve(response);
            } else {
              this.openSnackBar("Failed to Update.", "Close");
              reject("Failed to add subject");
            }
          },
          (error: any) => {
            const errorMessage = error.error?.exception || "An unexpected error occurred.";
            this.openSnackBar(`${errorMessage} `, "Close");
            reject(error);
          }
        );
    });
  }
  uploadImage(file: File): Observable<any> {
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

  qbankTypeList(qbankCategory: QBankCategory): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/common/get-qbanktypes/${qbankCategory}`, { headers });

  }
  // getCourseYaerByCousreGuid(): Promise<any> {
  //   return new Promise((resolve, reject) => {
  //     // const params = new HttpParams().set('courseId', guid);
  //     this._httpClient.get(`${environment.apiURL}/course/courseyear`)
  //       .subscribe((response: any) => {
  //         resolve(response);
  //       }, reject);
  //   });
  // }

  getCourseYear(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/courseyear`)
  }
  getCourseYearName(guid) {
    return this._httpClient.get(`${environment.apiURL}/course/courseyear-by-guid?courseYearId=${guid}`, {});
  }

  cousreList(): Observable<any> {
    return this._httpClient.get<any>(`${environment.apiURL}/course/list`);

  }
  /**
    * Delete Student
    *
    * @param user
    */
  deleteLecture(userId): Promise<any> {

    return new Promise(() => {
      const params = new HttpParams().set('userId', userId);
      const headers = new HttpHeaders({
        'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

      });

      this._httpClient.post(`${environment.apiURL}/lecturer/delete`, {}, { params, headers })
        .subscribe(response => {
          if (response) {
            this.onlectureManagementChanged.next(this.lecture);
            this.openSnackBar("Successfully removed.", "Close");
          }
          else {
            this.openSnackBar("Failed", "Close");
          }
        });
    });
  }
  lecturerAnalyticsListing(_gridFilter: lecturerAnalyticGrid): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.post<any>(`${environment.apiURL}/lecturer/exam-summary-grid`, { ..._gridFilter }, { headers });

  }
  lecturereQbankSummary(userId): Observable<any> {
    const headers = new HttpHeaders({
      'Tenant': '8932d354-1dd2-4ace-81ed-25d9809d9f86',

    });
    return this._httpClient.get<any>(`${environment.apiURL}/lecturer/qbank-summary/${userId}`, { headers });
  }
}
